import { 
  MapPin, 
} from 'lucide-react';

export interface City {
  id: string;
  name: string;
  label: string;
  value?: string;
  isNewlyAdded?: boolean;
  icon: any;
}

export const cities: City[] = [
  { id: 'delhi', name: 'Delhi', label: 'Delhi', icon: MapPin },
  { id: 'gurgaon', name: 'Gurgaon', label: 'Gurgaon', icon: MapPin },
  { id: 'noida', name: 'Noida', label: 'Noida', icon: MapPin },
  { id: 'ghaziabad', name: 'Ghaziabad', label: 'Ghaziabad', icon: MapPin },
  { id: 'mumbai', name: 'Mumbai', label: 'Mumbai', icon: MapPin },
  { id: 'pune', name: 'Pune', label: 'Pune', icon: MapPin },
  { id: 'hyderabad', name: 'Hyderabad', label: 'Hyderabad', icon: MapPin },
  { id: 'bangalore', name: 'Bangalore', label: 'Bangalore', icon: MapPin },
  { id: 'chennai', name: 'Chennai', label: 'Chennai', isNewlyAdded: true, icon: MapPin },
  { id: 'jaipur', name: 'Jaipur', label: 'Jaipur', isNewlyAdded: true, icon: MapPin },
  { id: 'chandigarh', name: 'Chandigarh', label: 'Chandigarh', isNewlyAdded: true, icon: MapPin },
  { id: 'ahmedabad', name: 'Ahmedabad', label: 'Ahmedabad', isNewlyAdded: true, icon: MapPin },
  { id: 'lucknow', name: 'Lucknow', label: 'Lucknow', isNewlyAdded: true, icon: MapPin },
  { id: 'kolkata', name: 'Kolkata', label: 'Kolkata', isNewlyAdded: true, icon: MapPin },
  { id: 'navi-mumbai', name: 'Navi Mumbai', label: 'Navi Mumbai', icon: MapPin },
  { id: 'thane', name: 'Thane', label: 'Thane', icon: MapPin },
  { id: 'greater-noida', name: 'Greater Noida', label: 'Greater Noida', icon: MapPin },
  { id: 'faridabad', name: 'Faridabad', label: 'Faridabad', isNewlyAdded: true, icon: MapPin },
];

export const POPULAR_DESTINATIONS = [
  // India - Popular Tourist
  'Manali', 'Leh', 'Ladakh', 'Rishikesh', 'Jaipur', 'Udaipur', 'Goa', 'Shimla', 'Mussoorie', 'Nainital',
  'Dharamshala', 'McLeodganj', 'Kasol', 'Spiti Valley', 'Meghalaya', 'Varanasi', 'Munnar', 'Coorg', 'Andaman',
  'Kodaikanal', 'Ooty', 'Alleppey', 'Jodhpur', 'Pushkar', 'Hampi', 'Rann of Kutch', 'Darjeeling', 'Gangtok',
  'Tawang', 'Auli', 'Chopta', 'Kedarnath', 'Badrinath', 'Valley of Flowers', 'Zanskar', 'Sandakphu',
  'Bir Billing', 'Tirthan Valley', 'Pahalgam', 'Gulmarg', 'Srinagar', 'Dalhousie', 'Jaisalmer', 'Mount Abu',
  'Matheran', 'Mahabaleshwar', 'Lonavala', 'Khandala', 'Pondicherry', 'Gokarna', 'Varkala', 'Wayanad', 'Khajjiar',
  
  // India - Major Cities / Metros
  'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Gurgaon',
  'Noida', 'Chandigarh', 'Lucknow', 'Kochi', 'Thiruvananthapuram', 'Indore', 'Bhopal', 'Agra', 'Kanpur', 'Nagpur',
  
  // International - Asia
  'Bali', 'Bangkok', 'Phuket', 'Pattaya', 'Chiang Mai', 'Singapore', 'Kuala Lumpur', 'Langkawi', 'Maldives',
  'Colombo', 'Kandy', 'Kathmandu', 'Pokhara', 'Bhutan', 'Dubai', 'Abu Dhabi', 'Baku', 'Tbilisi', 'Yerevan',
  'Almaty', 'Tashkent', 'Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Seoul', 'Tokyo', 'Kyoto', 'Osaka', 'Taipei',
  
  // International - Europe & Americas
  'Paris', 'London', 'Rome', 'Venice', 'Florence', 'Milan', 'Barcelona', 'Madrid', 'Amsterdam', 'Berlin',
  'Munich', 'Zurich', 'Geneva', 'Interlaken', 'Vienna', 'Prague', 'Budapest', 'Athens', 'Santorini', 'Istanbul',
  'Cappadocia', 'New York', 'Los Angeles', 'San Francisco', 'Miami', 'Las Vegas', 'Toronto', 'Vancouver'
].sort();
