import React, { useState } from "react";

interface CalendarWidgetProps {
  onDateSelect?: (date: string) => void;
  selectedDate?: string | null;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ onDateSelect, selectedDate }) => {
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const dates: { day: number; type: string; dateStr: string }[] = [];
  // Previous month padding
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    dates.push({ day: d, type: "prev", dateStr: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push({ 
      day: i, 
      type: "current", 
      dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}` 
    });
  }
  
  // Next month padding
  const remainingCells = 42 - dates.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    dates.push({ day: i, type: "next", dateStr: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}` });
  }

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleDateClick = (dateStr: string, type: string) => {
    if (type !== "current") return;
    // Don't allow past dates
    if (dateStr < todayStr) return;
    
    if (onDateSelect) {
      // Toggle: clicking same date again clears it
      if (selectedDate === dateStr) {
        onDateSelect('');
      } else {
        onDateSelect(dateStr);
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      {/* Month Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors" aria-label="Previous Month">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-[14px] font-bold text-[#191c1d]" style={{ fontFamily: "var(--font-jakarta), sans-serif" }}>
          {monthNames[month]} {year}
        </span>
        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors" aria-label="Next Month">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-[12px] font-medium text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {dates.map((date, idx) => {
          const isPast = date.dateStr < todayStr && date.type === "current";
          const isSelected = selectedDate === date.dateStr;
          const isToday = date.dateStr === todayStr;
          
          let extraClasses = "text-gray-300 cursor-default"; // next/prev month days
          if (date.type === "current") {
            if (isPast) {
              extraClasses = "text-gray-300 cursor-not-allowed line-through";
            } else if (isSelected) {
              extraClasses = "bg-amber-500 text-white rounded-full font-bold shadow-lg shadow-amber-200 cursor-pointer";
            } else if (isToday) {
              extraClasses = "text-amber-600 font-bold ring-2 ring-amber-200 rounded-full cursor-pointer hover:bg-amber-50";
            } else {
              extraClasses = "text-[#191c1d] hover:bg-gray-100 rounded-full cursor-pointer";
            }
          }

          return (
            <div
              key={idx}
              onClick={() => handleDateClick(date.dateStr, date.type)}
              className={`flex justify-center items-center h-8 text-[13px] transition-colors ${extraClasses}`}
              style={{ fontFamily: "var(--font-vietnam), sans-serif" }}
            >
              {date.day}
            </div>
          );
        })}
      </div>

      {/* Selected date indicator */}
      {selectedDate && (
        <div className="mt-3 flex items-center justify-between px-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Departing: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <button 
            onClick={() => onDateSelect?.('')}
            className="text-[9px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-700 transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;
