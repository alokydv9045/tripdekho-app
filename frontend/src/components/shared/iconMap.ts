import { 
  Building2, 
  Hotel, 
  Waves, 
  Mountain, 
  TreePine, 
  Tent, 
  MapPin,
  Compass,
  Ship,
  Umbrella,
  Clover,
  Camera
} from 'lucide-react';

export const iconMap: Record<string, any> = {
  'Building2': Building2,
  'Hotel': Hotel,
  'Waves': Waves,
  'Mountain': Mountain,
  'TreePine': TreePine,
  'Tent': Tent,
  'MapPin': MapPin,
  'Compass': Compass,
  'Ship': Ship,
  'Umbrella': Umbrella,
  'Clover': Clover,
  'Camera': Camera
};

export const getIcon = (_name: string) => MapPin;
