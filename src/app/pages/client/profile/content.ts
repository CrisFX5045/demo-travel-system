import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  DocumentTextIcon,
  HeartIcon,
  LifebuoyIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import type { ElementType } from "react";

import type { ClientLanguage } from "../i18n";

export type ProfileCopy = {
  title: string;
  eyebrow: string;
  verified: string;
  memberSince: string;
  profileCompletion: string;
  completeProfile: string;
  verifyIdentity: string;
  nextTrips: string;
  nextTripsHint: string;
  history: string;
  historyHint: string;
  preferences: string;
  preferencesHint: string;
  account: string;
  support: string;
  settings: string;
  darkMode: string;
  darkModeHint: string;
  travelAlerts: string;
  travelAlertsHint: string;
  saveSearches: string;
  saveSearchesHint: string;
  locationRecommendations: string;
  locationRecommendationsHint: string;
  viewAll: string;
  manage: string;
  requestChanges: string;
  open: string;
  noTrips: string;
  bookingDetail: string;
  bookingDetailHint: string;
  bookingCode: string;
  meetingPoint: string;
  guests: string;
  companyContact: string;
  importantInfo: string;
  cancellationPolicy: string;
  toursHistoryTitle: string;
  toursHistoryHint: string;
  reviewsTitle: string;
  reviewsHint: string;
  ViewDetails: string;
  completed: string;
  tourDate: string;
  ratingLabel: string;
  reviewPlaceholder: string;
  reviewSubmitted: string;
  stats: {
    trips: string;
    favorites: string;
    reviews: string;
  };
};

export type ProfileAction = {
  label: string;
  description: string;
  icon: ElementType;
  href?: string;
};

export type ProfilePreference = {
  label: string;
  value: string;
  icon: ElementType;
};

export const profileCopy: Record<ClientLanguage, ProfileCopy> = {
  es: {
    title: "Perfil",
    eyebrow: "Tu cuenta viajera",
    verified: "Viajero verificado",
    memberSince: "Miembro desde 2026",
    profileCompletion: "Perfil al",
    completeProfile: "Completar perfil",
    verifyIdentity: "Verificar identidad",
    nextTrips: "Próximas reservas",
    nextTripsHint: "Tus tours confirmados y solicitudes recientes.",
    history: "Historial",
    historyHint: "Experiencias completadas y listas para valorar.",
    preferences: "Preferencias de viaje",
    preferencesHint: "Usaremos esto para recomendar mejores tours.",
    account: "Cuenta y seguridad",
    support: "Ayuda y soporte",
    settings: "Configuración",
    darkMode: "Modo oscuro",
    darkModeHint: "Cambia la apariencia de la app para usarla con menos brillo.",
    travelAlerts: "Alertas de viaje",
    travelAlertsHint: "Recibe recordatorios de reservas, cambios y mensajes.",
    saveSearches: "Guardar búsquedas",
    saveSearchesHint: "Mantén tus filtros recientes para explorar más rápido.",
    locationRecommendations: "Recomendaciones por ubicación",
    locationRecommendationsHint: "Usa tu zona aproximada para sugerir tours cercanos.",
    viewAll: "Ver todo",
    manage: "Gestionar",
    requestChanges: "Solicitar cambios",
    open: "Abrir",
    noTrips: "Aún no tienes reservas activas.",
    bookingDetail: "Detalle de reserva",
    bookingDetailHint: "Información útil para llegar preparado al tour.",
    bookingCode: "Código de reserva",
    meetingPoint: "Punto de encuentro",
    guests: "Viajeros",
    companyContact: "Contacto de la empresa",
    importantInfo: "Información importante",
    cancellationPolicy: "Cancelación gratis hasta 24 horas antes del tour.",
    toursHistoryTitle: "Historial de tours",
    toursHistoryHint: "Tus reservas pasadas y tours completados.",
    reviewsTitle: "Reseñas",
    reviewsHint: "Comparte tu experiencia y ayuda a otros viajeros.",
    ViewDetails: "Ver detalles",
    completed: "Finalizado",
    tourDate: "Fecha",
    ratingLabel: "Tu calificación",
    reviewPlaceholder: "Cuéntanos cómo estuvo la experiencia...",
    reviewSubmitted: "Reseña guardada",
    stats: {
      trips: "Tours",
      favorites: "Favoritos",
      reviews: "Reseñas",
    },
  },
  en: {
    title: "Profile",
    eyebrow: "Your traveler account",
    verified: "Verified traveler",
    memberSince: "Member since 2026",
    profileCompletion: "Profile at",
    completeProfile: "Complete profile",
    verifyIdentity: "Verify identity",
    nextTrips: "Upcoming bookings",
    nextTripsHint: "Your confirmed tours and recent requests.",
    history: "History",
    historyHint: "Completed experiences ready to review.",
    preferences: "Travel preferences",
    preferencesHint: "We will use this to recommend better tours.",
    account: "Account and security",
    support: "Help and support",
    settings: "Settings",
    darkMode: "Dark mode",
    darkModeHint: "Switch the app appearance for a lower-brightness experience.",
    travelAlerts: "Travel alerts",
    travelAlertsHint: "Get booking reminders, updates and company messages.",
    saveSearches: "Save searches",
    saveSearchesHint: "Keep recent filters so exploring is faster.",
    locationRecommendations: "Location recommendations",
    locationRecommendationsHint: "Use your approximate area to suggest nearby tours.",
    viewAll: "View all",
    manage: "Manage",
    requestChanges: "Request changes",
    open: "Open",
    noTrips: "You do not have active bookings yet.",
    bookingDetail: "Booking detail",
    bookingDetailHint: "Useful information to arrive prepared for the tour.",
    bookingCode: "Booking code",
    meetingPoint: "Meeting point",
    guests: "Travelers",
    companyContact: "Company contact",
    importantInfo: "Important information",
    cancellationPolicy: "Free cancellation up to 24 hours before the tour.",
    toursHistoryTitle: "Tour history",
    toursHistoryHint: "Your past bookings and completed tours.",
    reviewsTitle: "Reviews",
    reviewsHint: "Share your experience and help other travelers.",
    ViewDetails: "View details",
    completed: "Finished",
    tourDate: "Date",
    ratingLabel: "Your rating",
    reviewPlaceholder: "Tell us how the experience went...",
    reviewSubmitted: "Review saved",
    stats: {
      trips: "Tours",
      favorites: "Favorites",
      reviews: "Reviews",
    },
  },
};

export const profileActions: Record<ClientLanguage, ProfileAction[]> = {
  es: [
    {
      label: "Datos personales",
      description: "Nombre, teléfono, documento y contacto de emergencia.",
      icon: UserCircleIcon,
    },
    {
      label: "Métodos de pago",
      description: "Tarjetas guardadas y moneda preferida.",
      icon: CreditCardIcon,
    },
    {
      label: "Notificaciones",
      description: "Recordatorios, ofertas y mensajes de empresas.",
      icon: BellIcon,
    },
    {
      label: "Privacidad y seguridad",
      description: "Sesiones, contraseña y verificación de cuenta.",
      icon: ShieldCheckIcon,
    },
    {
      label: "Preferencias de viaje",
      description: "Destino favorito, intereses y estilo de viaje.",
      icon: SparklesIcon,
    },
  ],
  en: [
    {
      label: "Personal details",
      description: "Name, phone, document and emergency contact.",
      icon: UserCircleIcon,
    },
    {
      label: "Payment methods",
      description: "Saved cards and preferred currency.",
      icon: CreditCardIcon,
    },
    {
      label: "Notifications",
      description: "Reminders, deals and company messages.",
      icon: BellIcon,
    },
    {
      label: "Privacy and security",
      description: "Sessions, password and account verification.",
      icon: ShieldCheckIcon,
    },
    {
      label: "Travel preferences",
      description: "Favorite destination, interests and travel style.",
      icon: SparklesIcon,
    },
  ],
};

export const supportActions: Record<ClientLanguage, ProfileAction[]> = {
  es: [
    {
      label: "Centro de ayuda",
      description: "Preguntas frecuentes y políticas de reserva.",
      icon: LifebuoyIcon,
    },
    {
      label: "Mensajes",
      description: "Conversaciones con empresas turísticas.",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      label: "Documentos",
      description: "Comprobantes, facturas y vouchers.",
      icon: DocumentTextIcon,
    },
  ],
  en: [
    {
      label: "Help center",
      description: "FAQs and booking policies.",
      icon: LifebuoyIcon,
    },
    {
      label: "Messages",
      description: "Conversations with tour companies.",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      label: "Documents",
      description: "Receipts, invoices and vouchers.",
      icon: DocumentTextIcon,
    },
  ],
};

export const profilePreferences: Record<ClientLanguage, ProfilePreference[]> = {
  es: [
    { label: "Destino favorito", value: "Pacífico Central", icon: MapPinIcon },
    { label: "Intereses", value: "Aventura y naturaleza", icon: SparklesIcon },
    { label: "Viaja con", value: "Pareja o amigos", icon: HeartIcon },
  ],
  en: [
    { label: "Favorite destination", value: "Central Pacific", icon: MapPinIcon },
    { label: "Interests", value: "Adventure and nature", icon: SparklesIcon },
    { label: "Travels with", value: "Partner or friends", icon: HeartIcon },
  ],
};
