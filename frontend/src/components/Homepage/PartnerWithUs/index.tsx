"use client";

import React from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import PartnerCard from "./PartnerCard";
import { vendorRoles } from "../data/vendors";

export default function PartnerWithUs() {
  return (
    <section id="vendors" className="py-16 md:py-32 bg-white overflow-hidden selection:bg-amber-400 selection:text-black">
      {/* Partner Roles Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Vendor Network"
          highlightedWord=""
          showViewAll={false}
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendorRoles.map((role) => (
            <PartnerCard key={role.id} role={role} />
          ))}
        </div>
      </div>
    </section>
  );
}
