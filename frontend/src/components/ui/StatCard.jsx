import { motion } from "framer-motion";

export default function StatCard({ label, value, color, icon: Icon, trend }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          {Icon}
        </div>
        {trend && (
          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tight ${trend > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      
      <div>
        <p className="text-[var(--color-text-secondary)] text-xs font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
        <h3 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
}