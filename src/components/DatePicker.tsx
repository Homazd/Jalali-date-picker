import { useState } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useDateContext } from "../context/DateContext";
import { DateObject } from "../context/types";
import moment from "moment-jalaali";
import ConvertToJalali from "../utils/Convert";

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
  range?: number;
}

function DatePicker({
  disabledBeforeDate,
  range,
}: DatePickerProps): JSX.Element {
  const [currentMonth, setCurrentMonth] = useState<number>(8);
  const [currentYear, setCurrentYear] = useState<number>(1403);
  const { startDate, setStartDate, endDate, setEndDate } = useDateContext();
  const [monthDropdownOpen, setMonthDropdownOpen] = useState<boolean>(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState<boolean>(false);

  const getDaysInMonth = (year: number, month: number): number => {
    return moment.jDaysInMonth(year, month);
  };

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

    // Create a Jalali moment for the current date in the calendar
    const currentDate = moment()
      .jYear(currentYear)
      .jMonth(currentMonth)
      .jDate(day);

    const disabledJalaliDate = ConvertToJalali(disabledBeforeDate);

    // Compare the dates correctly in the Jalali calendar
    return currentDate.isBefore(disabledJalaliDate, "day");
  };

  const handleDateClick = (day: number): void => {
    const selectedDate: DateObject = {
      year: currentYear,
      month: currentMonth,
      day,
    };
    if (!isDisabled(day)) {
      if (!startDate || (startDate && endDate)) {
        setStartDate(selectedDate);
        setEndDate(null);
      } else {
        const startMoment = moment()
          .jYear(startDate.year)
          .jMonth(startDate.month)
          .jDate(startDate.day);
        const selectedMoment = moment()
          .jYear(currentYear)
          .jMonth(currentMonth)
          .jDate(day);

        const diffDays = selectedMoment.diff(startMoment, "days");
        if (range && diffDays > range) {
          // If range is exceeded, ignore setting endDate
          return;
        }

        if (selectedMoment.isAfter(startMoment)) {
          setEndDate(selectedDate);
        } else {
          setEndDate(null);
          setStartDate(selectedDate); // Reset if selected date is earlier
        }
      }
    } else {
      setStartDate(null);
      setEndDate(null);
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
        cursor-pointer hover:bg-gray-100 transition-colors
        ${isSelected(day) ? "bg-purple-100" : ""}
        ${
          startDate?.day === day || endDate?.day === day
            ? "bg-slate-950 text-white rounded-full"
            : ""
        }
        ${isDisabled(day) ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {day}
    </div>
  );

  const handleMonthSelect = (month: number) => {
    setCurrentMonth(month);
    setMonthDropdownOpen(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setYearDropdownOpen(false);
  };

  const handleClose = () => {
    setStartDate(null);
    setEndDate(null);
  };
  const renderDropdown = (
    items: any[],
    onSelect: (item: any, index: number) => void
  ) => (
    <div className="absolute top-8 left-[-100px] grid grid-cols-3 w-[280px] inset-x-0 bg-white border border-gray-200 rounded-lg shadow-md">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => onSelect(item, index)}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm z-100"
        >
          {item}
        </div>
      ))}
    </div>
  );

  const renderDropdownTriggers = () => (
    <div className="relative flex items-center gap-2">
      <div
        className="cursor-pointer"
        onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
      >
        {currentYear}
      </div>
      {yearDropdownOpen &&
        renderDropdown(
          Array.from({ length: 11 }, (_, i) => 1400 + i),
          handleYearSelect
        )}

      <div
        className="cursor-pointer"
        onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
      >
        {MONTHS[currentMonth]}
      </div>
      {monthDropdownOpen &&
        renderDropdown([...MONTHS], (_, index) => handleMonthSelect(index))}
    </div>
  );

  return (
    <div className="w-80 bg-white rounded-xl border border-2 border-black p-4 shadow-lg font-sans rtl">
      {/* Overlay */}
      {(monthDropdownOpen || yearDropdownOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setMonthDropdownOpen(false);
            setYearDropdownOpen(false);
          }}
        ></div>
      )}

      <div className="flex justify-between items-center mb-4  relative z-50">
        {renderDropdownTriggers()}
        <div>
          <button
            onClick={() => handleMonthChange(false)}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Next month"
          >
            <ChevronLeftIcon className="h-3 w-3" />
          </button>

          <button
            onClick={() => handleMonthChange(true)}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Previous month"
          >
            <ChevronRightIcon className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-sm text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 z-50">
        {generateCalendarDays().map(renderDay)}
      </div>

      <div className="flex gap-4 mt-4">
        <button className="flex-1 bg-black text-white py-2 px-4 rounded-lg text-sm transition-colors hover:bg-gray-900">
          تایید
        </button>
        <button
          className="flex-1 border border-gray-200 py-2 px-4 rounded-lg text-sm transition-colors hover:bg-gray-50"
          onClick={() => handleClose()}
        >
          انصراف
        </button>
      </div>
    </div>
  );
}

export default DatePicker;
