import { MessageCircle, CreditCard, ShieldCheck, User, Plane, MapPin } from 'lucide-react';

export const supportCategories = [
  {
    id: 'bookings',
    title: 'Booking Issues',
    desc: 'Modify, cancel, or confirm your upcoming travel plans.',
    icon: Plane,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    id: 'payments',
    title: 'Payments & Refunds',
    desc: 'Tracking transactions, invoices, and refund statuses.',
    icon: CreditCard,
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  },
  {
    id: 'safety',
    title: 'Travel Safety',
    desc: 'Emergency assistance and local safety guidelines.',
    icon: ShieldCheck,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    id: 'account',
    title: 'Account & Privacy',
    desc: 'Manage your profile, security, and data preferences.',
    icon: User,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  }
];

export const faqs = [
  {
    question: "How do I cancel my booking?",
    answer: "You can cancel your booking directly from your 'My Trips' dashboard. Depending on the vendor's policy, you may be eligible for a full or partial refund.",
    category: "bookings"
  },
  {
    question: "When will I receive my refund?",
    answer: "Refunds typically take 5-10 business days to reflect in your account once processed by TripDekho and your bank.",
    category: "payments"
  },
  {
    question: "Is it safe to travel alone with TripDekho?",
    answer: "Yes! We vet all our vendors and offer 24/7 SOS support through our mobile app to ensure your safety throughout the journey.",
    category: "safety"
  },
  {
    question: "Can I pay in local currency?",
    answer: "We support over 40+ currencies. You can switch your preferred currency in the account settings page.",
    category: "payments"
  }
];
