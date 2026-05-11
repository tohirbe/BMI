import { motion } from "framer-motion";

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  icon: Icon,
  loading = false,
  ...props 
}) {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md",
    secondary: "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-primary)] shadow-sm",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-md",
    ghost: "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-2xl",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 
        focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
      ) : Icon && (
        <span className="shrink-0">{Icon}</span>
      )}
      {children}
    </motion.button>
  );
}
