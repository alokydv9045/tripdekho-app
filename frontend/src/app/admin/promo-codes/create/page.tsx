"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Ticket } from "lucide-react";
import Link from "next/link";
import InputField from "@/components/shared/InputField";
import { Textarea } from "@/components/ui/textarea";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/useToast";

export default function CreatePromoCodePage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minPurchaseAmount: 0,
    maxDiscount: 0,
    validFrom: "",
    validUntil: "",
    usageLimit: 0,
    description: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Value') || name.includes('Amount') || name.includes('Limit') || name === 'maxDiscount'
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.createPromoCode(formData);
      toast.success("Promo code created successfully");
      router.push("/admin/promo-codes");
    } catch (error) {
      toast.error("Failed to create promo code");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/admin/promo-codes" 
          className="text-gray-500 hover:text-primary flex items-center gap-2 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Promo Codes
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Ticket className="text-primary" />
          Create Promo Code
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Promo Code"
            name="code"
            placeholder="e.g. SUMMER2024"
            value={formData.code}
            onChange={handleChange}
            required
          />
          
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
            <select
              name="discountType"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={formData.discountType}
              onChange={handleChange}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          <InputField
            label="Discount Value"
            name="discountValue"
            type="number"
            value={formData.discountValue}
            onChange={handleChange}
            required
          />

          <InputField
            label="Usage Limit"
            name="usageLimit"
            type="number"
            placeholder="0 for unlimited"
            value={formData.usageLimit}
            onChange={handleChange}
          />

          <InputField
            label="Start Date"
            name="validFrom"
            type="date"
            value={formData.validFrom}
            onChange={handleChange}
            required
          />

          <InputField
            label="Expiry Date"
            name="validUntil"
            type="date"
            value={formData.validUntil}
            onChange={handleChange}
            required
          />

          <InputField
            label="Min Purchase Amount (₹)"
            name="minPurchaseAmount"
            type="number"
            value={formData.minPurchaseAmount}
            onChange={handleChange}
          />

          <InputField
            label="Max Discount (₹)"
            name="maxDiscount"
            type="number"
            placeholder="For percentage type"
            value={formData.maxDiscount}
            onChange={handleChange}
          />
        </div>

        <Textarea
          label="Description"
          name="description"
          placeholder="Describe the offer..."
          value={formData.description}
          onChange={handleChange}
        />

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`
              inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold
              transition-all duration-200 
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90 hover:shadow-lg active:scale-95"}
            `}
          >
            {loading ? "Creating..." : (
              <>
                <Save size={20} />
                Create Promo Code
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
