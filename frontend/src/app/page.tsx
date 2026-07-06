import { Header, FloatingIcons, HeroSection, UpcomingTrips, TripsNearbyYou, IndiaOnWheels, Destinations, BudgetFriendly, WeekendEscapes, TopTripsForYou, ExploreOffbeat, Mountains, Hike, Beach, Spiritual, Heritage, VibeWithUs, LiveWeatherForecasts } from "@/components/index";
import { tripService } from "@/services/index";
import dynamic from 'next/dynamic';

const Reviews = dynamic(() => import('@/components/Homepage/Reviews'), { ssr: true });
const Blogs = dynamic(() => import('@/components/Homepage/Blogs'), { ssr: true });
const PartnerWithUs = dynamic(() => import('@/components/Homepage/PartnerWithUs'), { ssr: true });


export const revalidate = 3600; // Cache homepage for 1 hour at the edge

async function getHomepageData() {
  try {
    const res = await tripService.getAllTrips();
    return res?.trips || res?.data?.trips || (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
  } catch (error) {
    console.error("Failed to fetch homepage trips", error);
    return [];
  }
}

import ScrollReveal from '@/components/shared/ScrollReveal';

export default async function Home() {
  const trips = await getHomepageData();
  
  return (
    <div className="bg-[#FFFBF0] relative min-h-screen overflow-hidden">
      {/* Subtle decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-48 w-[800px] h-[800px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
      </div>

     <div className="relative z-10">
       <FloatingIcons />
     <Header/>
     <HeroSection/>
     <ScrollReveal direction="up"><UpcomingTrips trips={trips} /></ScrollReveal>
     <TripsNearbyYou />
     <ScrollReveal direction="up"><LiveWeatherForecasts/></ScrollReveal>
     <ScrollReveal direction="up"><IndiaOnWheels/></ScrollReveal>
     <ScrollReveal direction="up"><Destinations/></ScrollReveal>
     <ScrollReveal direction="up"><BudgetFriendly/></ScrollReveal>
     <ScrollReveal direction="up"><WeekendEscapes/></ScrollReveal>
     <ScrollReveal direction="up"><TopTripsForYou/></ScrollReveal>
     <ScrollReveal direction="up"><ExploreOffbeat/></ScrollReveal>
     <ScrollReveal direction="up"><Mountains/></ScrollReveal>
     <ScrollReveal direction="up"><Hike/></ScrollReveal>
     <ScrollReveal direction="up"><Beach/></ScrollReveal>
     <ScrollReveal direction="up"><Spiritual/></ScrollReveal>
     <ScrollReveal direction="up"><Heritage/></ScrollReveal>
     <ScrollReveal direction="up"><VibeWithUs/></ScrollReveal>
     <ScrollReveal direction="up"><Reviews/></ScrollReveal>
     <ScrollReveal direction="up"><Blogs/></ScrollReveal>
     <ScrollReveal direction="up"><PartnerWithUs/></ScrollReveal>

     </div>
    </div>
  );
}
