import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CustomDatePicker({ selected, onChange, label, placeholder = "Tanlang..." }) {
  return (
    <div className="space-y-2 w-full group">
      {label && <label className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest ml-1 opacity-60">{label}</label>}
      <div className="relative">
        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-40 group-focus-within:text-indigo-600 group-focus-within:opacity-100 transition-all z-10" size={18} />
        <DatePicker
          selected={selected}
          onChange={onChange}
          placeholderText={placeholder}
          dateFormat="dd.MM.yyyy"
          className="w-full input-premium pl-12 h-12 text-sm font-bold cursor-pointer"
          popperClassName="premium-datepicker"
        />
      </div>
      <style>{`
        .premium-datepicker .react-datepicker {
          border: 1px solid var(--color-border);
          background-color: var(--color-bg-secondary);
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
          font-family: 'Outfit', sans-serif;
          padding: 0.5rem;
          color: var(--color-text-primary);
        }
        .premium-datepicker .react-datepicker__header {
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border);
          border-radius: 1.5rem 1.5rem 0 0;
          padding-top: 1rem;
        }
        .premium-datepicker .react-datepicker__current-month,
        .premium-datepicker .react-datepicker__day-name,
        .premium-datepicker .react-datepicker__day {
          color: var(--color-text-primary);
        }
        .premium-datepicker .react-datepicker__day--selected {
          background-color: #6366f1 !important;
          color: white !important;
          border-radius: 0.75rem;
          font-weight: 900;
        }
        .premium-datepicker .react-datepicker__day:hover {
          border-radius: 0.75rem;
          background-color: var(--color-bg-primary);
        }
        .premium-datepicker .react-datepicker__current-month {
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .premium-datepicker .react-datepicker__navigation--next {
          border-left-color: var(--color-text-secondary);
        }
        .premium-datepicker .react-datepicker__navigation--previous {
          border-right-color: var(--color-text-secondary);
        }
      `}</style>
    </div>
  );
}
