import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CustomDatePicker({ selected, onChange, label, placeholder = "Select date" }) {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>}
      <div className="relative group">
        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10" size={18} />
        <DatePicker
          selected={selected}
          onChange={onChange}
          placeholderText={placeholder}
          dateFormat="dd.MM.yyyy"
          className="w-full bg-slate-50 border-slate-200 text-slate-900 text-sm rounded-xl h-12 pl-12 pr-4 transition-all focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none cursor-pointer"
          popperClassName="premium-datepicker"
        />
      </div>
      <style jsx global>{`
        .premium-datepicker .react-datepicker {
          border: 1px solid #e2e8f0;
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15);
          font-family: 'Outfit', sans-serif;
          padding: 0.5rem;
        }
        .premium-datepicker .react-datepicker__header {
          background: white;
          border-bottom: 1px solid #f1f5f9;
          border-radius: 1.5rem 1.5rem 0 0;
          padding-top: 1rem;
        }
        .premium-datepicker .react-datepicker__day--selected {
          background-color: #6366f1 !important;
          border-radius: 0.75rem;
          font-weight: bold;
        }
        .premium-datepicker .react-datepicker__day:hover {
          border-radius: 0.75rem;
          background-color: #f1f5f9;
        }
        .premium-datepicker .react-datepicker__current-month {
          font-weight: 800;
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
