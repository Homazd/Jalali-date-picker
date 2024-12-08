import { useState } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useDateContext } from "../context/DateContext";
import { DateObject } from "../context/types";
import moment from "moment-jalaali";

const WEEKDAYS: readonly string[] = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const MONTHS: readonly string[] = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

interface DatePickerProps {
  disabledBeforeDate?: Date;
}

function DatePicker({ disabledBeforeDate }: DatePickerProps): JSX.Element {
  const [currentMonth, setCurrentMonth] = useState<number>(1);
  const [currentYear, setCurrentYear] = useState<number>(1403);
  const { startDate, setStartDate, endDate, setEndDate } = useDateContext();

  const getDaysInMonth = (year: number, month: number): number => {
    return moment.jDaysInMonth(year, month);
  };

  console.log("disabledBeforeDate", disabledBeforeDate);

  const generateCalendarDays = (): number[] => {
    const days: number[] = [];
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const isDisabled = (day: number): boolean => {
    if (!disabledBeforeDate) return false;

    // Convert current date to Jalali
    const currentDate = moment(
      `${currentYear}-${currentMonth}-${day}`,
      "YYYY-MM-DD"
    );

    console.log("currentDate", currentDate);
    // Convert disabled date to Jalali if it's Gregorian
    let disabledJalaliDate = moment(disabledBeforeDate).jDate();
    console.log("disabledJalaliDate", disabledJalaliDate);
    console.log(
      "currentDate.isBefore(disabledJalaliDate): ",
      currentDate.isBefore(disabledJalaliDate)
    );

    // Compare Jalali dates
    return currentDate.isBefore(disabledJalaliDate);
  };

  const handleDateClick = (day: number): void => {
    const selectedDate: DateObject = {
      year: currentYear,
      month: currentMonth,
      day,
    };

    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate);
      setEndDate(null);
    } else {
      if (day < startDate.day) {
        setEndDate(startDate);
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const isSelected = (day: number): boolean => {
    if (!startDate) return false;
    if (startDate.day === day) return true;
    if (endDate && endDate.day === day) return true;
    if (endDate) {
      return day > startDate.day && day < endDate.day;
    }
    return false;
  };

  const handleMonthChange = (increment: boolean): void => {
    setCurrentMonth((prev) => {
      const newMonth = increment ? prev + 1 : prev - 1;
      if (newMonth > 11) {
        setCurrentYear((prev) => prev + 1);
        return 0;
      }
      if (newMonth < 0) {
        setCurrentYear((prev) => prev - 1);
        return 11;
      }
      return newMonth;
    });
  };

  const renderDay = (day: number) => (
    <div
      key={day}
      onClick={() => handleDateClick(day)}
      className={`
        aspect-square flex items-center justify-center text-sm
        cursor-pointer rounded-full hover:bg-gray-100 transition-colors
        ${isSelected(day) ? "bg-purple-100" : ""}
        ${
          startDate?.day === day || endDate?.day === day
            ? "bg-[#242424] text-white"
            : ""
        }
        ${isDisabled(day) ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {day}
    </div>
  );
  return (
    <div className="w-80 bg-white rounded-xl border border-2 border-black p-4 shadow-lg font-sans rtl">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => handleMonthChange(false)}
          className="p-1 hover:bg-gray-100 rounded-full"
          aria-label="Next month"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <span className="text-sm">
          {MONTHS[currentMonth]} {currentYear}
        </span>

        <button
          onClick={() => handleMonthChange(true)}
          className="p-1 hover:bg-gray-100 rounded-full"
          aria-label="Previous month"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-sm text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays().map(renderDay)}
      </div>

      <div className="flex gap-4 mt-4">
        <button className="flex-1 bg-black text-white py-2 px-4 rounded-lg text-sm transition-colors hover:bg-gray-900">
          تایید
        </button>
        <button className="flex-1 border border-gray-200 py-2 px-4 rounded-lg text-sm transition-colors hover:bg-gray-50">
          انصراف
        </button>
      </div>
    </div>
  );
}

export default DatePicker;
