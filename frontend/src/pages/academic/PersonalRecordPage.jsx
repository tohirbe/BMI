import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Award, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

export default function PersonalRecordPage() {
  const { t } = useTranslation();
  const student = {
    fullName: "Karimov Sherzod Alisherovich",
    studentId: "2100456",
    role: "Talaba",
    faculty: "Kompyuter injiniringi",
    department: "Dasturiy injiniring",
    group: "921-21",
    level: "3-kurs",
    email: "sherzod.k@tuit.uz",
    phone: "+998 90 123 45 67",
    address: "Toshkent sh., Yunusobod tumani, 19-kvartal",
    birthDate: "2002-05-15",
    gender: "Erkak",
    citizenship: "O'zbekiston",
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('nav.personal_record')} 
        subtitle="Talabaning shaxsiy va o'quv ma'lumotlari kartochkasi"
      />

      {/* Header Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden shadow-sm"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full -mr-40 -mt-40" />
        
        <div className="relative">
          <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-800 p-1 shadow-2xl shadow-indigo-600/20">
            <div className="w-full h-full rounded-[2.4rem] bg-[var(--color-bg-secondary)] flex items-center justify-center text-indigo-600 overflow-hidden border-2 border-white/10">
              <User size={80} strokeWidth={1} />
            </div>
          </div>
          <div className="absolute bottom-1 right-1 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-[var(--color-bg-secondary)] shadow-lg" title="Active Status" />
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight leading-tight">{student.fullName}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <span className="px-6 py-2 rounded-2xl bg-indigo-600/10 text-indigo-600 text-xs font-black uppercase tracking-[0.2em] border border-indigo-600/10">
              {student.role}
            </span>
            <span className="px-6 py-2 rounded-2xl bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] text-xs font-black uppercase tracking-[0.2em] border border-[var(--color-border)] opacity-60">
              ID: {student.studentId}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Academic Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-10"
        >
          <div className="card-premium p-10 shadow-md">
            <h3 className="text-xl font-black mb-10 flex items-center gap-4 tracking-tight text-[var(--color-text-primary)]">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-inner">
                <GraduationCap size={24} />
              </div>
              O'qish ma'lumotlari
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { label: "Fakultet", value: student.faculty },
                { label: "Yo'nalish", value: student.department },
                { label: "Guruh", value: student.group },
                { label: "Kurs", value: student.level },
                { label: "Ta'lim turi", value: "Kunduzgi" },
                { label: "To'lov shakli", value: "Davlat granti" },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40">{item.label}</p>
                  <p className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-premium p-10 shadow-md">
            <h3 className="text-xl font-black mb-10 flex items-center gap-4 tracking-tight text-[var(--color-text-primary)]">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-inner">
                <Award size={24} />
              </div>
              Yutuqlar va Faoliyat
            </h3>
            <div className="space-y-6">
              <div className="p-6 rounded-[1.5rem] bg-emerald-600/5 border border-emerald-600/10 flex items-center gap-6 group hover:bg-emerald-600/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  <Award size={24} />
                </div>
                <div>
                  <p className="font-black text-emerald-600 tracking-tight text-lg leading-tight">Prezident stipendiyasi sohibi</p>
                  <p className="text-[10px] text-emerald-600/60 font-black uppercase tracking-widest mt-1">2023-2024 o'quv yili</p>
                </div>
              </div>
              <div className="p-6 rounded-[1.5rem] bg-blue-600/5 border border-blue-600/10 flex items-center gap-6 group hover:bg-blue-600/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-black text-blue-600 tracking-tight text-lg leading-tight">IT-Park a'zosi</p>
                  <p className="text-[10px] text-blue-600/60 font-black uppercase tracking-widest mt-1">Dasturiy ta'minot bo'yicha startap asoschisi</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Personal Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-10"
        >
          <div className="card-premium p-10 shadow-md">
            <h3 className="text-xl font-black mb-10 flex items-center gap-4 tracking-tight text-[var(--color-text-primary)]">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-inner">
                <User size={24} />
              </div>
              Shaxsiy ma'lumotlar
            </h3>
            <div className="space-y-8">
              {[
                { icon: <Calendar size={20} className="text-indigo-600" />, label: "Tug'ilgan sana", value: student.birthDate },
                { icon: <Mail size={20} className="text-emerald-600" />, label: "E-pochta", value: student.email },
                { icon: <Phone size={20} className="text-rose-600" />, label: "Telefon", value: student.phone },
                { icon: <MapPin size={20} className="text-amber-600" />, label: "Manzil", value: student.address },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40">{item.label}</p>
                    <p className="text-sm font-black text-[var(--color-text-primary)] tracking-tight leading-tight">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
