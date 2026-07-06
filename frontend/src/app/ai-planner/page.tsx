'use client';

import React, { useState } from 'react';
import { axiosPrivate } from '@/lib/axios';

export default function AiPlannerPage() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState('moderate');
  const [interests, setInterests] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        destination,
        days,
        budget,
        interests: interests.split(',').map(i => i.trim()).filter(Boolean)
      };
      const response = await axiosPrivate.post('/ai/generate', payload);
      setItinerary(response.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto flex flex-col gap-8">
      
      <div className="animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">AI Trip Planner</h1>
        <p className="text-gray-400 mt-2">
          Describe your dream trip and let our AI generate a personalized itinerary.
        </p>
      </div>

      <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl p-8 animate-in slide-in-from-bottom-4 duration-500 delay-100">
        <form onSubmit={handleGenerate} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-white">Destination</label>
            <input 
              type="text" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Paris, Tokyo, Bali"
              required
              className="bg-white/5 border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-semibold text-white">Duration (Days)</label>
              <input 
                type="number" min="1" max="14"
                value={days} onChange={(e) => setDays(Number(e.target.value))}
                className="bg-white/5 border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-semibold text-white">Budget</label>
              <select 
                value={budget} onChange={(e) => setBudget(e.target.value)}
                className="bg-white/5 border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="budget">Budget</option>
                <option value="moderate">Moderate</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-white">Interests (comma separated)</label>
            <input 
              type="text" 
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. History, Food, Nightlife"
              className="bg-white/5 border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button type="submit" disabled={loading} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center">
            {loading ? 'Generating Magic...' : 'Generate Itinerary'}
          </button>
        </form>
      </div>

      {itinerary && (
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl p-8 animate-in fade-in duration-500">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-6">Your Custom Plan</h2>
          
          <div className="flex flex-col gap-6">
            {itinerary.itinerary.map((day: any) => (
              <div key={day.day} className="border-l-2 border-blue-500 pl-5">
                <h3 className="text-xl font-bold text-white">Day {day.day}: {day.title}</h3>
                <ul className="mt-3 list-disc pl-5 text-gray-400 space-y-2">
                  {day.activities.map((act: string, idx: number) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
