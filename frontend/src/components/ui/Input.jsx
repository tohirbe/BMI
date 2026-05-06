import { forwardRef } from "react";

const Input = forwardRef(({ label, error, icon: Icon, className = "", ...props }, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-bold text-slate-700 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            {Icon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-slate-50 border-slate-200 text-slate-900 text-sm rounded-xl h-12
            transition-all focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500
            placeholder:text-slate-400
            ${Icon ? 'pl-12' : 'pl-4'}
            ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-bold text-rose-500 ml-1 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
