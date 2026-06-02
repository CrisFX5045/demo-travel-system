import {
  HeartIcon,
  MagnifyingGlassIcon,
  MapIcon,
  PlayCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import type { ElementType } from "react";

export type ClientTab = {
  label: string;
  image: string;
  badge?: string;
};

export type CategoryTile = {
  label: string;
  image: string;
};

export type PopularTour = {
  id: string;
  title: string;
  company: string;
  location: string;
  price: string;
  rating: string;
  image: string;
};

export type ClientNavItem = {
  label: string;
  href: string;
  icon: ElementType;
};

export const tabs: ClientTab[] = [
  {
    label: "Tours",
    image: "/images/superior-categories/category-1.png",
  },
  {
    label: "Experiencias",
    image: "/images/superior-categories/category-2.png",
    badge: "NOVEDAD",
  },
  {
    label: "Servicios",
    image: "/images/superior-categories/category-3.png",
    badge: "NOVEDAD",
  },
];

export const categoryTiles: CategoryTile[] = [
  { label: "Aventura", image: "/images/travel/travel-2.jpg" },
  { label: "Playa", image: "/images/travel/travel-9.jpg" },
  { label: "Montana", image: "/images/travel/travel-6.jpg" },
  { label: "Wellness", image: "/images/travel/picnic-1.jpg" },
  { label: "Cultura", image: "/images/travel/travel-13.jpg" },
  { label: "Familia", image: "/images/travel/hotel-1.jpg" },
];

export const filterPills = [
  "Ofertas",
  "Pet-friendly",
  "Mayor calificacion",
  "Nacionales",
];

export const popularTours: PopularTour[] = [
  {
    id: "EXP-1042",
    title: "Rafting en Pacuare",
    company: "Aventura Verde CR",
    location: "Jaco, Puntarenas",
    price: "Desde CRC 48,000 por persona",
    rating: "4.79",
    image: "/images/travel/travel-2.jpg",
  },
  {
    id: "EXP-1188",
    title: "Catamaran en Tamarindo",
    company: "Pacific Blue Tours",
    location: "Tamarindo, Guanacaste",
    price: "Desde CRC 39,500 por persona",
    rating: "4.86",
    image: "/images/travel/travel-9.jpg",
  },
  {
    id: "EXP-1217",
    title: "Caminata en Monteverde",
    company: "Bosque Vivo",
    location: "Monteverde, Puntarenas",
    price: "Desde CRC 24,900 por persona",
    rating: "4.92",
    image: "/images/travel/travel-6.jpg",
  },
  {
    id: "EXP-1420",
    title: "Cataratas escondidas",
    company: "Aventura Verde CR",
    location: "Bajos del Toro, Alajuela",
    price: "Desde $125 por persona",
    rating: "4.9",
    image: "/images/travel/travel-16.jpg",
  },
  {
    id: "EXP-1475",
    title: "Picnic frente al mar",
    company: "Pacific Blue Tours",
    location: "Playa Conchal, Guanacaste",
    price: "Desde $88 por persona",
    rating: "4.8",
    image: "/images/travel/picnic-1.jpg",
  },
];

export const navItems: ClientNavItem[] = [
  { label: "Explora", href: "#home", icon: MagnifyingGlassIcon },
  { label: "Feed", href: "/client/feed", icon: PlayCircleIcon },
  { label: "Mapa", href: "#map", icon: MapIcon },
  { label: "Favoritos", href: "/client/favorites", icon: HeartIcon },
  { label: "Perfil", href: "/client/profile", icon: UserCircleIcon },
];

export const desktopSidebarItems = [
  "Inicio",
  "Tours",
  "Experiencias",
  "Servicios",
  "Promociones",
  "Favoritos",
  "Registrate",
  "Iniciar sesion",
];
