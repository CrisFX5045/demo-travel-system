export type Experience = {
  id: string;
  title: string;
  company: string;
  province: string;
  zone: string;
  category: string;
  price: number;
  priceCurrency: "USD" | "CRC";
  duration: string;
  rating: number;
  reviews: number;
  difficulty: string;
  status: "Published" | "Draft" | "Review";
  image: string;
  images?: string[];
  video?: string;
  tags: string[];
  leads: number;
  views: number;
  favorites: number;
  nextSlot: string;
  promoted?: boolean;
  promotion?: {
    badge: string;
    title: string;
    description: string;
    discountPercent?: number;
  };
};

export type Lead = {
  id: string;
  client: string;
  experience: string;
  date: string;
  status: "New" | "Contacted" | "Confirmed" | "Cancelled";
  channel: "Marketplace" | "WhatsApp" | "Campaign";
  value: number;
};

export type Campaign = {
  id: string;
  name: string;
  placement: string;
  budget: number;
  clicks: number;
  leads: number;
  status: "Active" | "Scheduled" | "Paused";
};

export const experiences: Experience[] = [
  {
    id: "EXP-1042",
    title: "Rafting en el rio Pacuare",
    company: "Aventura Verde CR",
    province: "Limon",
    zone: "Siquirres",
    category: "Aventura",
    price: 48000,
    priceCurrency: "CRC",
    duration: "8 horas",
    rating: 4.9,
    reviews: 184,
    difficulty: "Media",
    status: "Published",
    image: "/images/travel/travel-2.jpg",
    images: [
      "/images/travel/travel-2.jpg",
      "/images/travel/travel-3.jpg",
      "/images/travel/travel-4.jpg",
    ],
    tags: ["Eco-friendly", "Guia certificado", "Transporte", "Jaco"],
    leads: 38,
    views: 2480,
    favorites: 316,
    nextSlot: "Viernes 8:00 AM",
    promoted: true,
    promotion: {
      badge: "2x1",
      title: "Dos por uno",
      description:
        "Reserva esta experiencia y aprovecha una promocion 2x1 por tiempo limitado. Ideal para viajar en pareja o compartir la aventura con otra persona.",
    },
  },
  {
    id: "EXP-1188",
    title: "Catamaran al atardecer",
    company: "Pacific Blue Tours",
    province: "Guanacaste",
    zone: "Tamarindo",
    category: "Playa",
    price: 39500,
    priceCurrency: "CRC",
    duration: "4 horas",
    rating: 4.8,
    reviews: 121,
    difficulty: "Baja",
    status: "Published",
    image: "/images/travel/travel-9.jpg",
    images: [
      "/images/travel/travel-9.jpg",
      "/images/travel/travel-10.jpg",
      "/images/travel/travel-11.jpg",
    ],
    tags: ["Promocion", "Familiar", "Comida incluida", "Jaco"],
    leads: 29,
    views: 1985,
    favorites: 244,
    nextSlot: "Hoy 2:30 PM",
    promoted: true,
    promotion: {
      badge: "Familia",
      title: "Paga 3 y niños gratis",
      description:
        "Promocion familiar disponible para grupos seleccionados: pagan 3 adultos y los niños viajan gratis segun disponibilidad de cupos.",
    },
  },
  {
    id: "EXP-1217",
    title: "Caminata nocturna en Monteverde",
    company: "Bosque Vivo",
    province: "Puntarenas",
    zone: "Monteverde",
    category: "Naturaleza",
    price: 24900,
    priceCurrency: "CRC",
    duration: "2.5 horas",
    rating: 4.7,
    reviews: 89,
    difficulty: "Baja",
    status: "Published",
    image: "/images/travel/travel-6.jpg",
    images: [
      "/images/travel/travel-6.jpg",
      "/images/travel/travel-7.jpg",
      "/images/travel/travel-8.jpg",
    ],
    tags: ["Nocturno", "Parejas", "Biodiversidad", "Jaco"],
    leads: 17,
    views: 1430,
    favorites: 171,
    nextSlot: "Sabado 6:00 PM",
  },
  {
    id: "EXP-1301",
    title: "Cafe, carreta y cocina tradicional",
    company: "Raices Ticas",
    province: "Alajuela",
    zone: "Sarchi",
    category: "Cultura",
    price: 54,
    priceCurrency: "USD",
    duration: "5 horas",
    rating: 4.9,
    reviews: 64,
    difficulty: "Baja",
    status: "Review",
    image: "/images/travel/travel-13.jpg",
    images: [
      "/images/travel/travel-13.jpg",
      "/images/travel/travel-14.jpg",
      "/images/travel/travel-15.jpg",
    ],
    tags: ["Gastronomia", "Cultural", "Familia"],
    leads: 11,
    views: 820,
    favorites: 96,
    nextSlot: "Domingo 9:00 AM",
  },
  {
    id: "EXP-1420",
    title: "Tour privado a cataratas escondidas",
    company: "Aventura Verde CR",
    province: "Alajuela",
    zone: "Bajos del Toro",
    category: "Naturaleza",
    price: 100,
    priceCurrency: "USD",
    duration: "7 horas",
    rating: 4.9,
    reviews: 73,
    difficulty: "Media",
    status: "Published",
    image: "/images/travel/travel-16.jpg",
    images: [
      "/images/travel/travel-16.jpg",
      "/images/travel/travel-1.jpg",
      "/images/travel/climber-man.jpg",
    ],
    tags: ["Privado", "Cataratas", "Fotografia"],
    leads: 24,
    views: 1120,
    favorites: 138,
    nextSlot: "Martes 7:30 AM",
    promoted: true,
    promotion: {
      badge: "30%",
      title: "30% de descuento por tiempo limitado",
      description:
        "Esta experiencia tiene un 30% de descuento por tiempo limitado para reservas anticipadas y cupos seleccionados.",
      discountPercent: 30,
    },
  },
  {
    id: "EXP-1475",
    title: "Picnic premium frente al mar",
    company: "Pacific Blue Tours",
    province: "Guanacaste",
    zone: "Playa Conchal",
    category: "Wellness",
    price: 88,
    priceCurrency: "USD",
    duration: "3 horas",
    rating: 4.8,
    reviews: 52,
    difficulty: "Baja",
    status: "Published",
    image: "/images/travel/picnic-1.jpg",
    images: [
      "/images/travel/picnic-1.jpg",
      "/images/travel/picnic-2.jpg",
      "/images/travel/picnic-3.jpg",
    ],
    tags: ["Parejas", "Atardecer", "Gastronomia"],
    leads: 19,
    views: 950,
    favorites: 117,
    nextSlot: "Viernes 4:00 PM",
  },
];

export const leads: Lead[] = [
  {
    id: "LEAD-8821",
    client: "Emily Carter",
    experience: "Catamaran al atardecer",
    date: "May 22",
    status: "New",
    channel: "Marketplace",
    value: 152,
  },
  {
    id: "LEAD-8814",
    client: "Carlos Mendez",
    experience: "Rafting en el rio Pacuare",
    date: "May 22",
    status: "Contacted",
    channel: "WhatsApp",
    value: 276,
  },
  {
    id: "LEAD-8799",
    client: "Sofia Ramirez",
    experience: "Caminata nocturna en Monteverde",
    date: "May 21",
    status: "Confirmed",
    channel: "Campaign",
    value: 96,
  },
  {
    id: "LEAD-8788",
    client: "Daniel Brooks",
    experience: "Cafe, carreta y cocina tradicional",
    date: "May 20",
    status: "New",
    channel: "Marketplace",
    value: 108,
  },
];

export const campaigns: Campaign[] = [
  {
    id: "CAM-301",
    name: "Guanacaste temporada alta",
    placement: "Home + Feed vertical",
    budget: 450,
    clicks: 1280,
    leads: 42,
    status: "Active",
  },
  {
    id: "CAM-288",
    name: "Aventura y naturaleza",
    placement: "Categoria aventura",
    budget: 280,
    clicks: 740,
    leads: 26,
    status: "Active",
  },
  {
    id: "CAM-277",
    name: "Familias en vacaciones",
    placement: "Provincia Puntarenas",
    budget: 190,
    clicks: 410,
    leads: 11,
    status: "Scheduled",
  },
];

export const provinces = [
  "San Jose",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
  "Limon",
];

export const categories = [
  "Aventura",
  "Playa",
  "Montana",
  "Naturaleza",
  "Familiar",
  "Gastronomia",
  "Wellness",
  "Cultura",
];
