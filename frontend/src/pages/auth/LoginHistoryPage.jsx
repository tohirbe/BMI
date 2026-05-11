import React from "react";
import { motion } from "framer-motion";
import { Monitor, Smartphone, Shield, MapPin, Clock } from "lucide-react";

const LOGINS = [
  { id: 1, device: "Chrome / Windows", ip: "195.158.15.22", location: "Tashkent, Uzbekistan", date: "Bugun, 14:20", current: true },
  { id: 2, device: "Safari / iPhone 13", ip: "178.218.200.12", location: "Tashkent, Uzbekistan", date: "Kecha, 09:15", current: false },
  { id: 3, device: "Firefox / MacOS", ip: "213.230.120.45", location: "Samarkand, Uzbekistan", date: "10-may, 18:45", current: false },
];

export default function LoginHistoryPage() {
  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Kirish tarixi</h1>
          <p className="text-[var(--color-text-secondary)] font-medium">Akkauntingizga kirilgan qurilmalar va sessiyalar nazorati</p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
          <Shield size={28} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {LOGINS.map((login, i) => (
          <motion.div
            key={login.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`
              p-8 rounded-3xl border transition-all flex items-center justify-between shadow-sm
              ${login.current 
                ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-200 dark:border-indigo-500/30' 
                : 'card-premium'}
            `}
          >
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                login.device.includes('Windows') || login.device.includes('MacOS') ? 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]' : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
              }`}>
                {login.device.includes('Windows') || login.device.includes('MacOS') ? <Monitor size={32} /> : <Smartphone size={32} />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-[var(--color-text-primary)]">{login.device}</h3>
                  {login.current && (
                    <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm">Joriy</span>
                  )}
                </div>
                <p className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest mt-1 opacity-60">IP: {login.ip}</p>
              </div>
            </div>

            <div className="flex items-center gap-10 text-right hidden sm:flex">
              <div>
                <div className="flex items-center gap-2 text-[var(--color-text-primary)] text-sm font-bold mb-1 justify-end">
                  <MapPin size={14} className="text-indigo-500" />
                  <span>{login.location}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-xs font-bold justify-end opacity-60">
                  <Clock size={14} />
                  <span>{login.date}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-10 pt-4">
        <button className="text-xs font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500 hover:text-white px-8 py-4 rounded-2xl transition-all border-2 border-rose-500/20 active:scale-95">
          Barcha boshqa sessiyalardan chiqish
        </button>
      </div>
    </div>
  );
}
