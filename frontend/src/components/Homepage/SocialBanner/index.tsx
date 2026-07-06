import React from "react";
import Image from "next/image";

const SocialBanner: React.FC = () => {
  return (
    <section className="w-full bg-[#fdfdfd] border-y border-gray-50 flex justify-center items-center overflow-hidden">
      <div className="relative w-full max-w-8xl mx-auto px-6 h-[180px] sm:h-[280px] md:h-[350px] lg:h-[450px] transition-transform duration-500 hover:scale-[1.02]">
        <Image
          src="/social banner.png"
          alt="Follow your Traveller Life"
          fill
          className="object-contain"
          priority={false}
        />
      </div>
    </section>
  );
};

export default SocialBanner;
