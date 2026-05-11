import { motion } from "framer-motion";

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-left"
      >
        <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-primary)] tracking-tight mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[var(--color-text-secondary)] font-bold text-lg opacity-60">
            {subtitle}
          </p>
        )}
      </motion.div>
      
      {actions && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4"
        >
          {actions}
        </motion.div>
      )}
    </div>
  );
}