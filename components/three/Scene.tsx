"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { onCanvasActive, story } from "@/lib/story";
import {
  glowFragment,
  glowVertex,
  orbFragment,
  orbVertex,
  particleFragment,
  particleVertex,
} from "./particleShader";

const INK = "#081C2E";
const PEARL = "#FBFDFD";
const AQUA = "#2CC6D3";
const LILAC = "#8E6CD1";

const SEAL_R = 1.6;
const TRACE_WIDTH = 8;

const smooth = (a: number, b: number, v: number) => {
  const t = THREE.MathUtils.clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const easeOutBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Keyframes per story stage (0..3): where the cloud sits and how big it is. */
const LAYOUT = {
  wide: {
    pos: [
      [2.5, 0.15],
      [2.4, -0.1],
      [2.5, 0.05],
      [2.5, 0.0],
    ],
    scale: [1, 0.85, 1, 1],
    camY: [0, 0.3, 0.8, 0],
  },
  narrow: {
    pos: [
      [0, 2.9],
      [0, 1.7],
      [0, 1.55],
      [0, 1.4],
    ],
    scale: [0.8, 0.48, 0.52, 0.62],
    camY: [0, 0.3, 0.6, 0],
  },
};

function sampleKeys(keys: number[], p: number) {
  const i = Math.min(Math.floor(p), keys.length - 2);
  const t = smooth(0, 1, p - i);
  return THREE.MathUtils.lerp(keys[i], keys[i + 1], t);
}

function useField(count: number) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4);
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number;
      if (i % 10 < 7) {
        // Soft spiral arms facing the camera.
        const arm = i % 3;
        const r = Math.pow(Math.random(), 0.75) * 11 + 0.9;
        const a = (arm / 3) * Math.PI * 2 + r * 0.38 + gauss() * 0.55;
        x = Math.cos(a) * r + gauss() * 0.5;
        y = Math.sin(a) * r * 0.62 + gauss() * 0.5;
        z = gauss() * 2.2 - 1.2;
      } else {
        // Loose outer halo for depth.
        const r = 5 + Math.random() * 10;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        x = r * Math.sin(ph) * Math.cos(th);
        y = r * Math.sin(ph) * Math.sin(th) * 0.7;
        z = r * Math.cos(ph) * 0.5 - 3;
      }
      positions.set([x, y, z], i * 3);
      seeds.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    }
    return { positions, seeds };
  }, [count]);
}

/** The hospital seal as a minted coin: navy body, pearl rim, the real logo on both faces. */
function Seal() {
  const logo = useTexture("/images/logo.jpg");
  useMemo(() => {
    logo.colorSpace = THREE.SRGBColorSpace;
    logo.anisotropy = 8;
  }, [logo]);

  return (
    <>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[SEAL_R, SEAL_R, 0.26, 96]} />
        <meshStandardMaterial color="#12324f" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh>
        <torusGeometry args={[SEAL_R, 0.08, 24, 128]} />
        <meshStandardMaterial color={PEARL} metalness={0.6} roughness={0.25} />
      </mesh>
      {[1, -1].map((side) => (
        <mesh key={side} position-z={0.132 * side} rotation-y={side < 0 ? Math.PI : 0}>
          <circleGeometry args={[SEAL_R - 0.06, 96]} />
          {/* Slightly under 1.0 so bloom keeps the white face crisp. */}
          <meshBasicMaterial map={logo} color="#e9eeee" toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function Story({ bloom, count }: { bloom: boolean; count: number }) {
  const { camera, size, gl } = useThree();
  const group = useRef<THREE.Group>(null!);
  const sealRot = useRef<THREE.Group>(null!);
  const sealBody = useRef<THREE.Group>(null!);
  const orb = useRef<THREE.Group>(null!);
  const glow = useRef<THREE.Mesh>(null!);

  const { positions, seeds } = useField(count);
  const narrow = size.width < 768;

  const particleMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uIntro: { value: 0 },
          uSize: { value: 32 },
          uPixelRatio: { value: 1 },
          uRepel: { value: 0 },
          uWidth: { value: TRACE_WIDTH },
          uMouse: { value: new THREE.Vector3(99, 99, 0) },
          uPearl: { value: new THREE.Color(PEARL) },
          uAqua: { value: new THREE.Color(AQUA) },
          uLilac: { value: new THREE.Color(LILAC) },
        },
      }),
    [],
  );

  const glowMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: glowVertex,
        fragmentShader: glowFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColor: { value: new THREE.Color(AQUA) },
          uOpacity: { value: 0.9 },
        },
      }),
    [],
  );

  const orbMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: orbVertex,
        fragmentShader: orbFragment,
        uniforms: {
          uCore: { value: new THREE.Color("#E6FDFF").multiplyScalar(bloom ? 1.5 : 1) },
          uEdge: { value: new THREE.Color(AQUA) },
        },
      }),
    [bloom],
  );

  const tmp = useMemo(
    () => ({
      ray: new THREE.Raycaster(),
      plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
      hit: new THREE.Vector3(),
      ptr: new THREE.Vector2(),
      smooth: new THREE.Vector2(),
      repel: 0,
    }),
    [],
  );

  useEffect(() => () => {
    particleMat.dispose();
    glowMat.dispose();
    orbMat.dispose();
  }, [particleMat, glowMat, orbMat]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = THREE.MathUtils.clamp(story.progress, 0, 3);
    const layout = narrow ? LAYOUT.narrow : LAYOUT.wide;
    const k = 1 - Math.pow(0.001, delta); // frame-rate independent lerp factor

    // Pointer: real mouse / tilt, otherwise a slow auto-drift.
    const target = story.pointerActive
      ? tmp.ptr.set(story.pointer.x, story.pointer.y)
      : tmp.ptr.set(Math.sin(t * 0.21) * 0.45, Math.cos(t * 0.17) * 0.3);
    tmp.smooth.lerp(target, Math.min(1, k * 0.9));

    const gx = sampleKeys(layout.pos.map((v) => v[0]), p);
    const gy = sampleKeys(layout.pos.map((v) => v[1]), p);
    const gs = sampleKeys(layout.scale, p);
    group.current.position.set(gx, gy, 0);
    group.current.scale.setScalar(gs);

    const camY = sampleKeys(layout.camY, p);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tmp.smooth.x * 0.9, k);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, camY + tmp.smooth.y * 0.6, k);
    camera.lookAt(0, 0, 0);

    const u = particleMat.uniforms;
    if (story.pointerActive && !narrow) {
      tmp.ray.setFromCamera(tmp.smooth, camera);
      if (tmp.ray.ray.intersectPlane(tmp.plane, tmp.hit)) {
        tmp.hit.sub(group.current.position).divideScalar(gs);
        u.uMouse.value.copy(tmp.hit);
      }
      tmp.repel = THREE.MathUtils.lerp(tmp.repel, 1.1, k * 0.5);
    } else {
      tmp.repel = THREE.MathUtils.lerp(tmp.repel, 0, k * 0.5);
    }

    u.uTime.value = t;
    u.uProgress.value = p;
    u.uIntro.value = story.intro;
    u.uRepel.value = tmp.repel;
    u.uSize.value = narrow ? 26 : 32;
    u.uPixelRatio.value = gl.getPixelRatio();

    // Core: quiet during the trace, swells as it gathers the heart, then flashes into the seal.
    const trace = smooth(0.2, 1.0, p) * (1 - smooth(1.2, 1.9, p));
    const absorb = smooth(2.0, 2.45, p);
    const minted = smooth(2.4, 2.85, p);
    const flash = Math.sin(smooth(2.25, 2.7, p) * Math.PI);
    const pulse = 1 + Math.sin(t * 2.2) * 0.07 * (1 - minted);
    const grow = (1 - trace * 0.75) * (1 + absorb * 1.1);
    orb.current.scale.setScalar(Math.max(0.0001, THREE.MathUtils.lerp(grow, 0.0001, minted) * pulse * (0.3 + 0.7 * story.intro)));
    glow.current.scale.setScalar((1 - trace * 0.6) * THREE.MathUtils.lerp(1, 1.9, minted) * (1 + flash * 0.8));
    glow.current.position.z = -0.4 * minted;
    glowMat.uniforms.uOpacity.value = (0.75 + flash * 0.9 + Math.sin(t * 2.2) * 0.1) * story.intro * (1 - minted * 0.45);

    // Seal spins in around the core.
    const b = smooth(2.4, 2.95, p);
    sealBody.current.scale.setScalar(Math.max(0.0001, easeOutBack(b)));
    sealBody.current.rotation.y = (1 - b) * -Math.PI * 1.5;
    sealBody.current.visible = b > 0.001;

    const w = smooth(2.4, 3.0, p);
    sealRot.current.rotation.y = w * (Math.sin(t * 0.35) * 0.3 + tmp.smooth.x * 0.4);
    sealRot.current.rotation.x = w * (-tmp.smooth.y * 0.28 + Math.sin(t * 0.27) * 0.06);
  });

  return (
    <group ref={group}>
      <points material={particleMat} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 4]} />
        </bufferGeometry>
      </points>

      <group ref={sealRot}>
        <group ref={orb}>
          <mesh material={orbMat}>
            <sphereGeometry args={[0.32, 48, 48]} />
          </mesh>
        </group>
        <Billboard>
          <mesh ref={glow} material={glowMat}>
            <planeGeometry args={[3.4, 3.4]} />
          </mesh>
        </Billboard>
        <group ref={sealBody} scale={0.0001}>
          <Suspense fallback={null}>
            <Seal />
          </Suspense>
        </group>
      </group>

      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 6]} intensity={1.6} color={PEARL} />
      <pointLight position={[1.4, -0.8, 1.6]} intensity={6} distance={6} color={AQUA} />
    </group>
  );
}

export default function Scene() {
  const [active, setActive] = useState(true);
  const [config] = useState(() => {
    if (typeof window === "undefined") return { bloom: false, count: 6000 };
    const small = window.innerWidth < 768;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    return { bloom: !small && !coarse, count: small ? 4000 : 6500 };
  });

  useEffect(() => onCanvasActive(setActive), []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 60 }}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      aria-hidden
    >
      <color attach="background" args={[INK]} />
      <Story bloom={config.bloom} count={config.count} />
      {config.bloom && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.55} luminanceThreshold={0.95} luminanceSmoothing={0.2} radius={0.65} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
