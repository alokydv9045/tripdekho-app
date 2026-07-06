import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Destination } from "@/types/destination";
import { fixImageUrl } from "@/lib/utils/formatters";

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  return (
    <Link href={`/search?q=${destination.name}`}>
      <article
        id={`destination-card-${destination.id}`}
        className="group flex flex-col items-center cursor-pointer"
      >
        {/* Image Container */}
        <div
          className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 transition-all duration-300 group-hover:-translate-y-1"
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
          }}
        >
          <Image
            src={fixImageUrl(destination.image?.trim() ? destination.image : "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=600")}
            alt={destination.name || "Destination"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Bookmark / Star Icon */}
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            }}
            aria-label={`Save ${destination.name}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#191c1d"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        </div>

        {/* Name */}
        <h3
          className="text-[15px] font-bold text-center leading-snug"
          style={{
            color: "#191c1d",
            fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
          }}
        >
          {destination.name}
        </h3>

        {/* Tagline */}
        <p
          className="text-[12px] text-center mt-0.5"
          style={{
            color: "#5e5e5e",
            fontFamily: "var(--font-vietnam), 'Be Vietnam Pro', sans-serif",
          }}
        >
          {destination.tagline}
        </p>
      </article>
    </Link>
  );
};

export default DestinationCard;
