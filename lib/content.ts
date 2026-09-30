/** All facts below come from the hospital's previous website. Keep them in sync with the front desk. */
export const CONTACT = {
  phone: "6361035840",
  phoneHref: "tel:+916361035840",
  whatsapp: "916361035840",
  email: "vigneshhospital18@gmail.com",
  address: ["Opposite Sai Gokul Convention Hall", "Madhugiri Road, Yallapura", "Tumkur, Karnataka 572106"],
  maps: "https://maps.google.com/maps/search/Vignesh%20Children%20Hospital/@13.38672065,77.11799518,17z?hl=en",
  mapEmbed: "https://www.google.com/maps?q=13.38672065,77.11799518&z=16&output=embed",
};

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Doctors", href: "#doctors" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export const ALWAYS_ON = ["Emergency", "Admission", "Pharmacy", "ECG"];

export type Stat = { value?: number; suffix?: string; display: string; label: string };

export const STATS: Stat[] = [
  { value: 20, display: "20", label: "Beds" },
  { value: 11500, suffix: "+", display: "11,500+", label: "Digital patient records*" },
  { value: 29000, suffix: "+", display: "29,000+", label: "Appointments recorded*" },
  { display: "24×7", label: "Emergency & admission" },
];

export const DOCTORS = [
  {
    name: "Dr. Santhosh V",
    degrees: "MBBS, DCH, MD (Pediatrics)",
    role: "Consultant Pediatrician & Developmental Pediatrician",
    photo: "/images/dr-santhosh.jpg",
    opd: "OPD: 1–2 PM & 6:30–9 PM",
    note: "Morning consultation by prior appointment / on-call basis.",
  },
  {
    name: "Dr. Shruthi R",
    degrees: "MDS",
    role: "Dental Surgeon",
    photo: "/images/dr-shruthi.jpg",
    opd: "Dental OPD: prior appointment only",
    note: "Please call or WhatsApp to book a dental slot.",
  },
];

export const FEES = [
  { item: "Specialist consultation", value: "₹300" },
  { item: "Night specialist consultation", value: "₹500" },
  { item: "Duty doctor, 10 PM–8 AM", value: "₹350" },
  { item: "Vaccination", value: "Morning hours" },
  { item: "Laboratory / X-ray", value: "8 AM–8 PM" },
  { item: "Pharmacy / ECG / Admissions", value: "24×7" },
];

export const GALLERY = [
  { src: "/images/hospital-front.jpg", alt: "Vignesh Hospital entrance with Kannada signage", w: 1200, h: 1600 },
  { src: "/images/newborn-care.jpg", alt: "Newborn care room with radiant warmers and phototherapy units", w: 1600, h: 900 },
  { src: "/images/pediatric-ward.jpg", alt: "Bright pediatric ward with two beds", w: 1600, h: 900 },
  { src: "/images/operation-theatre.jpg", alt: "Surgical team at work in the operation theatre", w: 1200, h: 1600 },
  { src: "/images/emergency-ward.jpg", alt: "Emergency ward bed with monitors and curtains", w: 1600, h: 900 },
  { src: "/images/laboratory.jpg", alt: "In-house laboratory with analysers", w: 1600, h: 900 },
  { src: "/images/dental-clinic.jpg", alt: "Dental chair in the dental clinic", w: 1600, h: 900 },
  { src: "/images/consultation-room.jpg", alt: "Vaccination and consultation room", w: 1600, h: 1200 },
  { src: "/images/reception.jpg", alt: "Reception and waiting area", w: 1200, h: 1600 },
  { src: "/images/ot-table.jpg", alt: "Operation theatre table and equipment", w: 1600, h: 900 },
  { src: "/images/front-desk.jpg", alt: "Front desk and records counter", w: 1600, h: 900 },
  { src: "/images/building.jpg", alt: "Vignesh Hospital building on Madhugiri Road", w: 1600, h: 1200 },
  { src: "/images/signboard.jpg", alt: "Hospital signboard with consultant names", w: 1200, h: 1600 },
];

export function whatsappHref(text = "Hello Vignesh Hospital, I would like to book an appointment.") {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}
