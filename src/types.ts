export interface Trek {
  id: string;
  name: string;
  tagline: string;
  region: string;
  altitudeFt: number;
  altitudeM: number;
  durationDays: number;
  difficulty: 'Easy-Moderate' | 'Moderate' | 'Difficult' | 'Challenging';
  bestSeason: string;
  priceInr: number;
  priceUsd: number;
  rating: number;
  reviewsCount: number;
  nextDeparture: string;
  availableSlots: number;
  overview: string;
  highlights: string[];
  itinerary: { day: number; title: string; desc: string; altitude: string }[];
  panoramaSceneId: string;
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  trekName: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
  badge?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  trek: string;
  altitude: string;
  category: 'summit' | 'meadow' | 'lake' | 'campsite' | 'culture';
  image: string;
  panoramaId?: string;
}

export interface Hotspot {
  id: string;
  title: string;
  altitude: string;
  description: string;
  phi: number; // vertical angle in degrees
  theta: number; // horizontal angle in degrees
  type: 'peak' | 'pass' | 'camp' | 'glacier';
}

export interface PanoramaScene {
  id: string;
  name: string;
  location: string;
  altitude: string;
  description: string;
  hotspots: Hotspot[];
  skyTheme: 'daylight' | 'golden' | 'twilight';
  coords?: { lat: number; lon: number };
}

export interface TeamMember {
  name: string;
  role: string;
  experience: string;
  certifications: string[];
  image: string;
  bio: string;
}
