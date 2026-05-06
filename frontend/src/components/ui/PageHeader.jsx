import { motion } from "framer-motion";

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 font-medium text-lg">
            {subtitle}
          </p>
        )}
      </motion.div>
      
      {actions && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3"
        >
          {actions}
        </motion.div>
      )}
    </div>
  );
}