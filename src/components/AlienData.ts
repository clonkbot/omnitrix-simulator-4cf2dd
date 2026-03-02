export interface Alien {
  id: string;
  name: string;
  species: string;
  planet: string;
  powers: string[];
  color: string;
  emoji: string;
  description: string;
}

export const ALIENS: Alien[] = [
  {
    id: "heatblast",
    name: "Heatblast",
    species: "Pyronite",
    planet: "Pyros",
    powers: ["Pyrokinesis", "Fire Absorption", "Flight via fire propulsion"],
    color: "#FF4500",
    emoji: "🔥",
    description: "A magma-based life form that can generate and control intense heat and flames.",
  },
  {
    id: "diamondhead",
    name: "Diamondhead",
    species: "Petrosapien",
    planet: "Petropia",
    powers: ["Crystallokinesis", "Diamond projectiles", "Regeneration"],
    color: "#00CED1",
    emoji: "💎",
    description: "A silicon-based life form made of extremely durable crystal.",
  },
  {
    id: "xlr8",
    name: "XLR8",
    species: "Kineceleran",
    planet: "Kinet",
    powers: ["Super speed", "Enhanced reflexes", "Sharp claws"],
    color: "#00BFFF",
    emoji: "⚡",
    description: "A velociraptor-like alien capable of reaching speeds up to 500 mph.",
  },
  {
    id: "grey_matter",
    name: "Grey Matter",
    species: "Galvan",
    planet: "Galvan Prime",
    powers: ["Super intelligence", "Small size", "Wall climbing"],
    color: "#808080",
    emoji: "🧠",
    description: "A tiny frog-like alien with incredible intelligence and problem-solving abilities.",
  },
  {
    id: "fourarms",
    name: "Four Arms",
    species: "Tetramand",
    planet: "Khoros",
    powers: ["Super strength", "Enhanced durability", "Shockwave clap"],
    color: "#DC143C",
    emoji: "💪",
    description: "A massive four-armed alien with incredible physical strength.",
  },
  {
    id: "stinkfly",
    name: "Stinkfly",
    species: "Lepidopterran",
    planet: "Lepidopterra",
    powers: ["Flight", "Slime projection", "Sharp tail"],
    color: "#9ACD32",
    emoji: "🦟",
    description: "An insectoid alien capable of flight and shooting streams of slime.",
  },
  {
    id: "ripjaws",
    name: "Ripjaws",
    species: "Piscciss Volann",
    planet: "Piscciss",
    powers: ["Underwater breathing", "Sharp teeth", "Bioluminescence"],
    color: "#2E8B57",
    emoji: "🦈",
    description: "An aquatic alien with powerful jaws and the ability to breathe underwater.",
  },
  {
    id: "upgrade",
    name: "Upgrade",
    species: "Galvanic Mechamorph",
    planet: "Galvan B",
    powers: ["Technopathy", "Shapeshifting", "Technology enhancement"],
    color: "#32CD32",
    emoji: "🤖",
    description: "A technological life form that can merge with and upgrade any machine.",
  },
  {
    id: "ghostfreak",
    name: "Ghostfreak",
    species: "Ectonurite",
    planet: "Anur Phaetos",
    powers: ["Invisibility", "Intangibility", "Possession"],
    color: "#4B0082",
    emoji: "👻",
    description: "A ghost-like alien that can turn invisible and phase through solid matter.",
  },
  {
    id: "wildmutt",
    name: "Wildmutt",
    species: "Vulpimancer",
    planet: "Vulpin",
    powers: ["Enhanced senses", "Sharp claws", "Agility"],
    color: "#FF8C00",
    emoji: "🐕",
    description: "A beast-like alien with no eyes but incredible sensory abilities.",
  },
  {
    id: "cannonbolt",
    name: "Cannonbolt",
    species: "Arburian Pelarota",
    planet: "Arburia",
    powers: ["Sphere form", "Enhanced durability", "Momentum attacks"],
    color: "#FFD700",
    emoji: "🔵",
    description: "A pillbug-like alien that can curl into an indestructible ball.",
  },
  {
    id: "wildvine",
    name: "Wildvine",
    species: "Florauna",
    planet: "Flors Verdance",
    powers: ["Chlorokinesis", "Elasticity", "Seed bombs"],
    color: "#228B22",
    emoji: "🌿",
    description: "A plant-based alien that can stretch and control plant life.",
  },
];

export const getAlienById = (id: string): Alien | undefined => {
  return ALIENS.find((alien) => alien.id === id);
};
