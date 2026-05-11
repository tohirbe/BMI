import { forwardRef } from "react";

const Input = forwardRef(({ label, error, icon: Icon, className = "", ...props }, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-[0.15em] ml-1 opacity-60">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-40 group-focus-within:text-indigo-500 group-focus-within:opacity-100 transition-all">
            {Icon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm rounded-xl h-12
            transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500
            placeholder:text-[var(--color-text-secondary)] placeholder:opacity-40
            ${Icon ? 'pl-12' : 'pl-4'} pr-4
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
