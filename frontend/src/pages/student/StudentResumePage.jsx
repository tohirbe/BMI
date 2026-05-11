import React from "react";
import { motion } from "framer-motion";
import { User, Briefcase, GraduationCap, Code, Globe, Download, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

export default function StudentResumePage() {
  const { t } = useTranslation();
  const resume = {
    summary: "Dasturiy injiniring yo'nalishi 3-kurs talabasi. Full-stack developer (React, Node.js, Python).",
    experience: [
      { role: "Junior Developer", company: "Unired IT Solutions", period: "2023 - hozir" },
      { role: "Intern", company: "IT Park Tashkent", period: "2022 - 2023" },
    ],
    education: [
      { degree: "Bakalavr", school: "TATU", period: "2021 - hozir" },
    ],
    skills: ["JavaScript", "React", "Python", "Django", "SQL", "Git"],
    languages: ["O'zbek", "Ingliz (IELTS 7.0)", "Rus"],
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12 max-w-5xl mx-auto">
      <PageHeader 
        title={t('student.resume_title')} 
        subtitle="Akademik va professional ko'nikmalar haqida ma'lumotlar"
        actions={
          <Button variant="primary" className="h-14 px-10 rounded-[1.5rem] font-black shadow-xl shadow-indigo-600/20" icon={<Download size={22} />}>
            PDF Yuklash
          </Button>
        }
      />

      {/* Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-12 relative overflow-hidden group shadow-md"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
           <Zap size={200} className="text-indigo-600" />
        </div>
        <h3 className="text-2xl font-black mb-8 flex items-center gap-4 tracking-tight text-[var(--color-text-primary)]">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-inner">
            <User size={24} />
          </div>
          Men haqimda
        </h3>
        <p className="text-lg text-[var(--color-text-secondary)] font-bold leading-relaxed max-w-3xl opacity-80">{resume.summary}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Experience */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-premium p-10 shadow-md"
        >
          <h3 className="text-xl font-black mb-10 flex items-center gap-4 tracking-tight text-[var(--color-text-primary)]">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-inner">
              <Briefcase size={24} />
            </div>
            Tajriba
          </h3>
          <div className="space-y-8 relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-[var(--color-border)] opacity-50" />
            {resume.experience.map((exp, i) => (
              <div key={i} className="relative pl-14 group">
                <div className="absolute left-4.5 top-1.5 w-3 h-3 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)] z-10 group-hover:scale-150 transition-transform" />
                <h4 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight leading-tight">{exp.role}</h4>
                <p className="text-sm font-bold text-[var(--color-text-secondary)] opacity-60 mt-1">{exp.company}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mt-2">{exp.period}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills & Languages */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div className="card-premium p-10 shadow-md">
            <h3 className="text-xl font-black mb-8 flex items-center gap-4 tracking-tight text-[var(--color-text-primary)]">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-inner">
                <Code size={24} />
              </div>
              Ko'nikmalar
            </h3>
            <div className="flex flex-wrap gap-3">
              {resume.skills.map((skill, i) => (
                <span key={i} className="px-5 py-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] hover:border-indigo-600/30 hover:text-indigo-600 transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="card-premium p-10 shadow-md">
            <h3 className="text-xl font-black mb-8 flex items-center gap-4 tracking-tight text-[var(--color-text-primary)]">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-inner">
                <Globe size={24} />
              </div>
              Tillar
            </h3>
            <div className="space-y-4">
              {resume.languages.map((lang, i) => (
                <div key={i} className="flex items-center gap-4 group">
                   <div className="w-2 h-2 rounded-full bg-indigo-600 opacity-40 group-hover:opacity-100 transition-opacity" />
                   <p className="text-sm font-black text-[var(--color-text-primary)] tracking-tight opacity-80 group-hover:opacity-100">{lang}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
