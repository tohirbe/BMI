import React from "react";
import { motion } from "framer-motion";
import { FileText, Download, ChevronRight, Filter, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

const ORDERS = [
  { id: 1, title: "Talabalar safiga qabul qilish haqida", number: "№ 12-45/2021", date: "2021-08-25", type: "Qabul" },
  { id: 2, title: "Kursdan kursga o'tkazish haqida", number: "№ 08-12/2023", date: "2023-09-05", type: "O'qish" },
  { id: 3, title: "Grant stipendiyasi tayinlash haqida", number: "№ 04-99/2024", date: "2024-02-15", type: "Moliya" },
];

export default function StudentOrdersPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('student.orders_title')} 
        subtitle="Universitet tomonidan chiqarilgan rasmiy buyruqlar va qarorlar ro'yxati"
      />

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="flex-1 w-full max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-40" size={18} />
            <input type="text" placeholder="Buyruqni qidirish..." className="input-premium pl-12 h-14 font-bold text-sm w-full" />
         </div>
         <button className="h-14 px-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-[var(--color-bg-primary)] transition-all shadow-sm">
            <Filter size={18} /> Filterlash
         </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {ORDERS.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group card-premium p-8 flex flex-col md:flex-row md:items-center justify-between hover:border-indigo-600/30 shadow-sm cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-8 mb-6 md:mb-0">
              <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-inner group-hover:shadow-lg group-hover:shadow-indigo-600/20">
                <FileText size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[var(--color-text-primary)] group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">{order.title}</h3>
                <p className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-[0.2em] opacity-40 mt-2">
                  {order.number} • {order.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <span className="hidden sm:inline-block px-5 py-2 rounded-xl bg-indigo-600/5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 border border-indigo-600/10">
                {order.type}
              </span>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] opacity-40 group-hover:text-indigo-600 group-hover:opacity-100 group-hover:bg-indigo-600/10 transition-all flex items-center justify-center shadow-inner">
                    <Download size={22} />
                 </div>
                 <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] opacity-20 group-hover:opacity-100 group-hover:text-indigo-600 transition-all flex items-center justify-center">
                    <ChevronRight size={24} />
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
