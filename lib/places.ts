export type Place = {
  id: string;
  name: string;
  category: "Food" | "Activities";
  tag: string;
  description: string;
  address: string;
  emoji: string;
  color: string;
  source: string;
  tip: string;
  audience: string[];
};
export const places: Place[] = [
  {
    id: "pin-wei",
    name: "Pin Wei Chee Cheong Fun",
    category: "Food",
    tag: "A breakfast worth waking up for",
    description:
      "Silky rice rolls, steamed to order. Start your Pek Kio food adventure with this much-loved hawker classic.",
    address: "41A Cambridge Road, #01-25",
    emoji: "🥢",
    color: "peach",
    source:
      "https://cnalifestyle.channelnewsasia.com/dining/best-local-food-singapore-chee-cheong-fun-pek-kio-pin-wei-256311",
    tip: "Try a morning visit. Stalls can sell out, so check opening hours before heading over.",
    audience: ["Youths", "Adults"],
  },
  {
    id: "wah-kee",
    name: "Wah Kee Big Prawn Noodles",
    category: "Food",
    tag: "Old-school, big flavour",
    description:
      "A longtime Pek Kio institution known for its prawn broth and generous sea prawns. One for your local food list.",
    address: "41A Cambridge Road, #01-15",
    emoji: "🍜",
    color: "yellow",
    source:
      "https://cnalifestyle.channelnewsasia.com/dining/wah-kee-big-prawn-noodles-reopens-after-3-month-closure-583786",
    tip: "CNA reported a planned June 2026 reopening. Confirm current hours with the stall before visiting.",
    audience: ["Youths", "Adults"],
  },
  {
    id: "market",
    name: "Pek Kio Market & Food Centre",
    category: "Food",
    tag: "The heart of the neighbourhood",
    description:
      "Follow your appetite through the stalls, pick up market essentials, and settle into the rhythm of a local morning.",
    address: "41A Cambridge Road, Singapore 211041",
    emoji: "☕",
    color: "mint",
    source: "https://sethlui.com/pek-kio-market-food-centre-food-guide/",
    tip: "Bring some cash, return your tray, and leave a little room to try something new.",
    audience: ["Youths", "Adults"],
  },
  {
    id: "badminton",
    name: "A little friendly competition",
    category: "Activities",
    tag: "Move · play · meet",
    description:
      "Get your friends together for badminton or table tennis at Pek Kio CC. A good game makes a great icebreaker.",
    address: "Pek Kio CC, 21 Gloucester Road",
    emoji: "🏸",
    color: "lavender",
    source: "https://www.onepa.gov.sg/cc/pek-kio-cc",
    tip: "Check onePA for facility booking, fees and available slots. Equipment and booking are not included.",
    audience: ["Youths", "Adults"],
  },
  {
    id: "arts",
    name: "Find your creative people",
    category: "Activities",
    tag: "For your next side quest",
    description:
      "Explore the MAEC Youth Performing Arts & Cultural Group at Pek Kio CC and discover a different way to connect.",
    address: "Pek Kio CC, 21 Gloucester Road",
    emoji: "🎨",
    color: "peach",
    source:
      "https://www.onepa.gov.sg/interest-groups/maec-youth-performing-arts-cultural-group-i000010496",
    tip: "Contact the organiser for age eligibility, upcoming sessions and how to join.",
    audience: ["Youths"],
  },
  {
    id: "neighbours",
    name: "Say hello to your neighbours",
    category: "Activities",
    tag: "A small hello goes a long way",
    description:
      "Get to know Pek Kio Residents’ Network and find out how to take part in neighbourhood life.",
    address: "48 Dorset Road, #01-113",
    emoji: "🌻",
    color: "yellow",
    source: "https://www.onepa.gov.sg/rc/pek-kio-rn",
    tip: "Ask the Residents’ Network about current volunteering and community programmes.",
    audience: ["Youths", "Adults"],
  },
  {
    id: "heritage",
    name: "Take the scenic way home",
    category: "Activities",
    tag: "Slow walks, little discoveries",
    description:
      "Explore Dorset and Cambridge Roads. Pek Kio means “white bridge” in Hokkien — a little clue to the area’s past.",
    address: "Dorset Road, Pek Kio",
    emoji: "🚶",
    color: "mint",
    source:
      "https://www.pa.gov.sg/resource/speeches/speech-by-prime-minister-lee-hsien-loong-at-the-opening-of-pek-kio-cc/",
    tip: "A self-guided neighbourhood stroll, not an organised tour. Bring water and choose a cooler part of the day.",
    audience: ["Youths", "Adults"],
  },
];
