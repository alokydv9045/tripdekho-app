import { Smartphone, Zap, Map, Bell, ShieldCheck, Gift } from 'lucide-react';

export interface AppFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

export const appFeatures: AppFeature[] = [
  {
    id: '1',
    title: 'One-Tap Bookings',
    description: 'Book your entire itinerary in seconds with secure biometric checkout. no more manual entry.',
    icon: Zap,
    color: 'text-amber-500'
  },
  {
    id: '2',
    title: 'Offline Explorer',
    description: 'Access your trip details, tickets, and maps even without an internet connection. never get lost.',
    icon: Map,
    color: 'text-blue-500'
  },
  {
    id: '3',
    title: 'Real-time Alerts',
    description: 'Get instant notifications for gate changes, flight delays, and exclusive local deals around you.',
    icon: Bell,
    color: 'text-purple-500'
  },
  {
    id: '4',
    title: 'App-Exclusive Perks',
    description: 'Unlock 15% extra discount on selected premium stays only available through the TripDekho app.',
    icon: Gift,
    color: 'text-pink-500'
  }
];

export const mobilePerks = [
  { title: "24/7 Concierge", desc: "Direct chat with local experts", icon: ShieldCheck },
  { title: "Smart Sync", desc: "Web and app data always in sync", icon: Smartphone },
  { title: "Flash Deals", desc: "Last-minute local discounts", icon: Zap },
];
