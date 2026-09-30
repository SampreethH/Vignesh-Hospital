/**
 * One Points cloud, four formations. Every formation is computed on the GPU
 * from per-particle seeds so scroll only has to move a single uniform:
 *   uProgress 0 → dawn over farmland: crop rows, hills, fireflies and a lit road to the sun
 *   uProgress 1 → a live heartbeat trace (24×7 care)
 *   uProgress 2 → a beating heart (child & family care)
 *   uProgress 3 → gathered into the core, which becomes the hospital seal
 */
export const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uIntro;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uRepel;
  uniform float uWidth;
  uniform vec3 uMouse;

  attribute vec4 aSeed;
  /** 0 crop row, 1 road, 2 distant hill, 3 firefly */
  attribute float aKind;

  varying float vAccent;
  varying float vWarm;
  varying float vAlpha;

  mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  float stage(float start, float delay) {
    float t = clamp((uProgress - start - delay * 0.35) / 0.65, 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  float bump(float x, float c, float w) {
    float d = (x - c) / w;
    return exp(-d * d);
  }

  // One PQRST cycle on phase 0..1.
  float ecg(float ph) {
    return 0.22 * bump(ph, 0.16, 0.035)
         - 0.28 * bump(ph, 0.30, 0.012)
         + 1.75 * bump(ph, 0.335, 0.014)
         - 0.55 * bump(ph, 0.37, 0.014)
         + 0.42 * bump(ph, 0.58, 0.05);
  }

  // Classic parametric heart, roughly unit sized.
  vec2 heart(float a) {
    float s = sin(a);
    return vec2(16.0 * s * s * s,
                13.0 * cos(a) - 5.0 * cos(2.0 * a) - 2.0 * cos(3.0 * a) - cos(4.0 * a)) / 16.0;
  }

  void main() {
    // 1. Dawn landscape. Positions come from the CPU; here we only add life.
    float isRow = 1.0 - step(0.5, aKind);
    float isRoad = step(0.5, aKind) * (1.0 - step(1.5, aKind));
    float isHill = step(1.5, aKind) * (1.0 - step(2.5, aKind));
    float isFly = step(2.5, aKind);
    vec3 g = position;
    // Wind rolling across the crops, a slower breath on the hills.
    float gust = sin(g.x * 0.5 - uTime * 1.1 + g.z * 0.35) * 0.5 + 0.5;
    g.y += (isRow * 0.09 + isHill * 0.02) * gust * sin(uTime * 2.2 + aSeed.x * 20.0);
    g.x += isRow * 0.06 * gust;
    // Fireflies drift and bob.
    g += isFly * vec3(
      sin(uTime * 0.35 + aSeed.x * 30.0) * 0.45,
      sin(uTime * 0.6 + aSeed.y * 30.0) * 0.3,
      cos(uTime * 0.3 + aSeed.z * 30.0) * 0.3
    );
    // A pulse of light travelling up the road toward the sun.
    float roadT = clamp((g.z + 22.0) / 27.0, 0.0, 1.0);
    float roadPulse = isRoad * bump(fract(roadT + uTime * 0.12), 0.5, 0.06);
    float blink = pow(0.5 + 0.5 * sin(uTime * 1.8 + aSeed.w * 50.0), 4.0);
    // Distance haze so the horizon melts into the sunrise glow.
    float haze = mix(1.0, smoothstep(-27.0, -12.0, g.z) * (0.45 + 0.55 * smoothstep(5.0, 2.0, g.z)), isRow + isRoad) * mix(1.0, 0.9, isHill);

    // 2. Heartbeat: particles ride a PQRST trace that sweeps left to right.
    float lx = (aSeed.x - 0.5) * uWidth;
    float period = uWidth / 2.2;
    float ph = fract(lx / period - uTime * 0.42);
    float jitter = (aSeed.y - 0.5) * 0.07 + (aSeed.z - 0.5) * 0.05;
    vec3 beat = vec3(lx, ecg(ph) * 1.25 + jitter, (aSeed.z - 0.5) * 0.35);
    // Bright head just behind the QRS spike.
    float head = bump(ph, 0.34, 0.09);

    // 3. Heart: outline-heavy, a soft fill, and a lub-dub pulse.
    float ha = aSeed.x * 6.28318;
    float fill = mix(0.72, 1.0, pow(aSeed.y, 0.35));
    float bt = fract(uTime * 0.9);
    float lubdub = 0.07 * bump(bt, 0.1, 0.05) + 0.045 * bump(bt, 0.3, 0.05);
    vec3 hrt = vec3(heart(ha) * fill * 2.3 * (1.0 + lubdub), (aSeed.z - 0.5) * 0.6 * fill);
    hrt.y += 0.25;
    hrt.xz = rot(sin(uTime * 0.5) * 0.35) * hrt.xz;

    // 4. Converge into the core.
    vec3 dir = normalize(vec3(aSeed.x, aSeed.y, aSeed.z) - 0.5 + 0.001);
    vec3 core = dir * 0.25 * aSeed.w;

    float p1 = stage(0.0, aSeed.z);
    float p2 = stage(1.0, aSeed.w);
    float p3 = stage(2.0, aSeed.y);

    vec3 pos = mix(g, beat, p1);
    pos.xy = rot(sin(p1 * 3.14159) * 0.35) * pos.xy;
    pos = mix(pos, hrt, p2);
    pos.xz = rot(sin(p2 * 3.14159) * 1.1) * pos.xz;
    pos = mix(pos, core, p3);

    float intro = 1.0 - pow(1.0 - uIntro, 3.0);
    pos *= mix(0.15, 1.0, intro);

    vec2 d = pos.xy - uMouse.xy;
    float falloff = exp(-dot(d, d) * 0.55);
    pos.xy += normalize(d + 0.0001) * uRepel * falloff * (1.0 - p3);
    pos.z += uRepel * falloff * 0.6 * (1.0 - p3);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Colour: road and fireflies aqua, crops faintly green-aqua, hills violet at dawn,
    // the pulse head glows, the heart turns logo violet, all aqua at the end.
    float field = (isRoad + isFly + isRow * 0.2 + roadPulse) * (1.0 - p1);
    float pulse = head * p1 * (1.0 - p2);
    vAccent = clamp(max(field, pulse) + step(aSeed.z, 0.35) * p2 + p3, 0.0, 1.0);
    vWarm = max(step(0.35, aSeed.z) * step(aSeed.z, 0.75) * p2, isHill * 0.8 * (1.0 - p1)) * (1.0 - p3);

    float kindSize = mix(1.0, isRow * 0.55 + isRoad * 0.9 + isHill * 1.3 + isFly * 1.6 + roadPulse * 0.8, 1.0 - p1);
    float scale = (0.55 + aSeed.w * 1.1) * kindSize;
    float size = uSize * scale * (1.0 + max(vAccent, vWarm) * 0.35 + pulse * 0.6) * (1.0 - p3 * 0.6);
    gl_PointSize = size * uPixelRatio / -mv.z;

    float twinkle = 0.55 + 0.45 * sin(uTime * 1.3 + aSeed.x * 60.0);
    // The trace fades toward the ends so it reads as an endless monitor line.
    float edge = mix(1.0, smoothstep(0.5, 0.36, abs(aSeed.x - 0.5)), p1 * (1.0 - p2));
    float absorbed = 1.0 - smoothstep(0.55, 1.0, p3);
    float land = mix(1.0, haze * mix(1.0, blink, isFly) * (1.0 + roadPulse), 1.0 - p1);
    // Crops and hills hold steady; only the field of fireflies and later stages twinkle.
    float steady = (isRow + isHill + isRoad) * (1.0 - p1);
    vAlpha = intro * mix(mix(twinkle, 0.75 + 0.25 * twinkle, p1), 0.8 + 0.2 * twinkle, steady) * edge * absorbed * land;
  }
`;

export const particleFragment = /* glsl */ `
  uniform vec3 uPearl;
  uniform vec3 uAqua;
  uniform vec3 uLilac;

  varying float vAccent;
  varying float vWarm;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.8);
    vec3 col = mix(uPearl * 0.85, uAqua * 1.2, vAccent);
    col = mix(col, uLilac * 1.3, vWarm);
    gl_FragColor = vec4(col, a * vAlpha);
    #include <colorspace_fragment>
  }
`;

/** Radial glow sprite used as a cheap halo around the core (works without bloom). */
export const glowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.6);
    gl_FragColor = vec4(uColor, a * uOpacity);
    #include <colorspace_fragment>
  }
`;

/** Core: hot white centre fading to aqua at the rim, so bloom keeps the hue. */
export const orbVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const orbFragment = /* glsl */ `
  uniform vec3 uCore;
  uniform vec3 uEdge;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0);
    vec3 col = mix(uEdge, uCore, pow(f, 3.0));
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;
