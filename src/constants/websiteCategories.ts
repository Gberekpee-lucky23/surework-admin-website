import { ServiceCategory } from "@/components/website/CategoryCard";

export function getCategoryImage(idOrSlug: string): string {
  const normalized = idOrSlug.toLowerCase();
  if (normalized.includes("plumb")) return "/images/plumbing.jpg";
  if (normalized.includes("electric") || normalized.includes("wiring")) return "/images/electrical.jpg";
  if (normalized.includes("carpent")) return "/images/carpenters.jpg";
  if (normalized.includes("mason") || normalized.includes("civil")) return "/images/masons.png";
  if (normalized.includes("paint")) return "/images/painter.jpg";
  if (normalized.includes("clean") || normalized.includes("janitor")) return "/images/com-cleaning.jpg";
  if (normalized.includes("hvac") || normalized.includes("ac") || normalized.includes("air")) return "/images/ac-repair.jpg";
  if (normalized.includes("fumi") || normalized.includes("pest")) return "/images/fumigation.jpg";
  if (normalized.includes("hair")) return "/images/hair.png";
  if (normalized.includes("makeup")) return "/images/makeup.jpg";
  if (normalized.includes("nail")) return "/images/nail-tech.jpg";
  if (normalized.includes("scaffold")) return "/images/scaffolder.jpg";
  if (normalized.includes("wig")) return "/images/wig.jpg";
  
  return `/images/${normalized}.jpg`;
}

const STATIC_CATEGORIES: ServiceCategory[] = [
  // Group 1 — Home & Property Services
  {
    id: "plumbers",
    name: "Plumbing Installation & Repair",
    description: "Expert leak repairs, pipe fitting, water heater installation, bathroom fixtures, and drainage unblocking.",
    icon: "🔧",
    group: "home_property",
    groupLabel: "Home & Property",
    popular: true,
  },
  {
    id: "electricians",
    name: "Electrical Maintenance & Repair",
    description: "Fault diagnosis, house rewiring, prepaid meter connections, breaker fixes, and inverter setups.",
    icon: "⚡",
    group: "home_property",
    groupLabel: "Home & Property",
    popular: true,
  },
  {
    id: "carpenters",
    name: "Carpentry & Woodwork",
    description: "Custom furniture repair, door installation, roof framing, kitchen cabinets, and woodwork restoration.",
    icon: "🔨",
    group: "home_property",
    groupLabel: "Home & Property",
  },
  {
    id: "masons",
    name: "Masonry & Civil Maintenance",
    description: "Bricklaying, wall plastering, concrete repairs, interlock paving, and foundation maintenance.",
    icon: "🧱",
    group: "home_property",
    groupLabel: "Home & Property",
  },
  {
    id: "painters",
    name: "Interior & Exterior Painting",
    description: "Professional house painting, wall damp treatment, screeding, texture coatings, and color consultations.",
    icon: "🎨",
    group: "home_property",
    groupLabel: "Home & Property",
  },
  {
    id: "cleaners",
    name: "Comprehensive Cleaning",
    description: "Deep home cleaning, post-construction cleanup, office maintenance, rug washing, and window cleaning.",
    icon: "🧹",
    group: "home_property",
    groupLabel: "Home & Property",
    popular: true,
  },
  {
    id: "hvac",
    name: "AC & HVAC Maintenance",
    description: "Air conditioner servicing, gas refilling, compressor repairs, duct cleaning, and new AC installations.",
    icon: "❄️",
    group: "home_property",
    groupLabel: "Home & Property",
    popular: true,
  },
  {
    id: "tilers",
    name: "Tiling & Flooring",
    description: "Granite, marble, ceramic tile installation, floor leveling, epoxy coating, and tile repair.",
    icon: "📐",
    group: "home_property",
    groupLabel: "Home & Property",
  },

  // Group 2 — Personal & Lifestyle Specialists
  {
    id: "generators",
    name: "Generator Servicing & Repair",
    description: "Diesel and petrol generator overhaul, ATS panel installation, oil changes, and monthly maintenance contracts.",
    icon: "⚙️",
    group: "personal_specialist",
    groupLabel: "Personal & Specialist",
    popular: true,
  },
  {
    id: "solar",
    name: "Solar & Inverter Systems",
    description: "Solar panel mounting, lithium battery installation, hybrid inverter setup, and energy audit services.",
    icon: "☀️",
    group: "personal_specialist",
    groupLabel: "Personal & Specialist",
    popular: true,
  },
  {
    id: "cctv",
    name: "CCTV & Security Systems",
    description: "IP camera installation, DVR/NVR configuration, remote mobile monitoring setup, and electric fence installation.",
    icon: "📹",
    group: "personal_specialist",
    groupLabel: "Personal & Specialist",
  },
  {
    id: "borehole",
    name: "Borehole & Water Treatment",
    description: "Submersible pump replacement, water treatment plant setup, borehole drilling, and pressure tank maintenance.",
    icon: "🚰",
    group: "personal_specialist",
    groupLabel: "Personal & Specialist",
  },
  {
    id: "fumigation",
    name: "Fumigation & Pest Control",
    description: "Termite eradication, bedbug treatment, rodent control, mosquito fogging, and eco-friendly disinfections.",
    icon: "🦟",
    group: "personal_specialist",
    groupLabel: "Personal & Specialist",
  },
  {
    id: "welding",
    name: "Welding & Metal Fabrication",
    description: "Burglar proofing, iron gate fabrication, handrail installation, structural steel welding, and tank stand fixes.",
    icon: "💥",
    group: "personal_specialist",
    groupLabel: "Personal & Specialist",
  },
];

// Map categories to dynamically include their image paths
export const ALL_CATEGORIES: ServiceCategory[] = STATIC_CATEGORIES.map((cat) => ({
  ...cat,
  imagePath: getCategoryImage(cat.id),
}));

