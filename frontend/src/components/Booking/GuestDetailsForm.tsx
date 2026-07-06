"use client";

import React, { useState, useCallback } from "react";
import { User, Calendar, Users, ChevronDown, AlertCircle } from "lucide-react";

interface Guest {
  name: string;
  age: string;
  gender: string;
}

interface FieldErrors {
  name?: string;
  age?: string;
  gender?: string;
}

interface GuestDetailsFormProps {
  guests: Guest[];
  onChange: (index: number, field: keyof Guest, value: string) => void;
}

const validateName = (value: string): string | undefined => {
  if (!value.trim()) return "Full name is required";
  if (!/^[a-zA-Z\s]+$/.test(value)) return "Only alphabets are allowed";
  if (value.trim().length < 2) return "Name must be at least 2 characters";
  return undefined;
};

const validateAge = (value: string): string | undefined => {
  if (!value) return "Age is required";
  const num = parseInt(value, 10);
  if (isNaN(num)) return "Enter a valid number";
  if (num <= 0) return "Age can't be zero or negative";
  if (num > 115) return "Age can't be above 115";
  return undefined;
};

const validateGender = (value: string): string | undefined => {
  if (!value) return "Please select a gender";
  return undefined;
};

const GuestDetailsForm: React.FC<GuestDetailsFormProps> = ({ guests, onChange }) => {
  const [errors, setErrors] = useState<Record<number, FieldErrors>>({});
  const [touched, setTouched] = useState<Record<number, Record<string, boolean>>>({});

  const setFieldError = useCallback((index: number, field: string, error: string | undefined) => {
    setErrors(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: error }
    }));
  }, []);

  const markTouched = useCallback((index: number, field: string) => {
    setTouched(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: true }
    }));
  }, []);

  const handleNameChange = (index: number, value: string) => {
    // Allow only alphabets and spaces while typing
    const sanitized = value.replace(/[^a-zA-Z\s]/g, "");
    onChange(index, "name", sanitized);
    if (touched[index]?.name) {
      setFieldError(index, "name", validateName(sanitized));
    }
  };

  const handleAgeChange = (index: number, value: string) => {
    // Allow only digits
    const sanitized = value.replace(/[^0-9]/g, "");
    onChange(index, "age", sanitized);
    if (touched[index]?.age) {
      setFieldError(index, "age", validateAge(sanitized));
    }
  };

  const handleGenderChange = (index: number, value: string) => {
    onChange(index, "gender", value);
    markTouched(index, "gender");
    setFieldError(index, "gender", validateGender(value));
  };

  const handleBlur = (index: number, field: keyof Guest) => {
    markTouched(index, field);
    const value = guests[index][field];
    let error: string | undefined;
    if (field === "name") error = validateName(value);
    else if (field === "age") error = validateAge(value);
    else if (field === "gender") error = validateGender(value);
    setFieldError(index, field, error);
  };

  const getInputClassName = (index: number, field: string) => {
    const hasError = touched[index]?.[field] && errors[index]?.[field as keyof FieldErrors];
    return `w-full h-12 px-4 bg-gray-50 border rounded-xl outline-none transition-all font-medium ${
      hasError
        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-50 bg-red-50/30"
        : "border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-50"
    }`;
  };

  return (
    <div className="space-y-6">
      {guests.map((guest, index) => (
        <div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
              {index + 1}
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {index === 0 ? "Primary Traveler" : `Traveler ${index + 1}`}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" /> Full Name
              </label>
              <input
                type="text"
                placeholder="As per ID proof"
                value={guest.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                onBlur={() => handleBlur(index, "name")}
                className={getInputClassName(index, "name")}
              />
              {touched[index]?.name && errors[index]?.name && (
                <p className="text-xs font-semibold text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-3 h-3" /> {errors[index].name}
                </p>
              )}
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" /> Age
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Age"
                value={guest.age}
                onChange={(e) => handleAgeChange(index, e.target.value)}
                onBlur={() => handleBlur(index, "age")}
                className={getInputClassName(index, "age")}
              />
              {touched[index]?.age && errors[index]?.age && (
                <p className="text-xs font-semibold text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-3 h-3" /> {errors[index].age}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" /> Gender
              </label>
              <div className="relative">
                <select
                  value={guest.gender}
                  onChange={(e) => handleGenderChange(index, e.target.value)}
                  onBlur={() => handleBlur(index, "gender")}
                  className={`${getInputClassName(index, "gender")} appearance-none text-gray-700`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {touched[index]?.gender && errors[index]?.gender && (
                <p className="text-xs font-semibold text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-3 h-3" /> {errors[index].gender}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GuestDetailsForm;
