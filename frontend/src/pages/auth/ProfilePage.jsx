import { useSelector } from "react-redux";
import { selectUser } from "../../store/authSlice";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";
import { User, Mail, Shield, Phone, Calendar, Camera, Edit3, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useSelector(selectUser);

  const PERMISSIONS = [
    t('nav.dashboard'),
    t('nav.analytics', 'Analytics'),
    t('nav.reports', 'Reports'),
    t('nav.users', 'Users'),
    t('nav.notifications'),
    t('common.settings'),
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <PageHeader 
        title={t('common.profile')} 
        subtitle={t('common.profile_subtitle')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium overflow-hidden shadow-sm"
          >
            <div className="h-32 bg-indigo-600 shadow-inner" />
            <div className="px-8 pb-10 -mt-16 text-center space-y-6">
              <div className="relative inline-block group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-[var(--color-bg-secondary)] p-2 border border-[var(--color-border)] shadow-xl transition-transform group-hover:scale-105 duration-300">
                   <div className="w-full h-full rounded-[2rem] bg-[var(--color-bg-primary)] flex items-center justify-center text-indigo-500 text-4xl font-black border border-[var(--color-border)] uppercase">
                      {user?.full_name?.charAt(0)}
                   </div>
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all active:scale-90">
                   <Camera size={18} />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">{user?.full_name}</h3>
                <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-60">{t(`roles.${user?.role}`, user?.role)}</p>
              </div>

              <div className="pt-6 border-t border-[var(--color-border)] space-y-3">
                 <Button className="w-full rounded-2xl h-12 font-black" variant="primary" icon={<Edit3 size={18}/>}>
                    {t('common.edit')}
                 </Button>
                 <Button className="w-full rounded-2xl h-12 font-black" variant="secondary" icon={<Lock size={18}/>}>
                    {t('common.change_password')}
                 </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="card-premium p-10"
           >
              <h4 className="text-xl font-black text-[var(--color-text-primary)] mb-8 flex items-center gap-3">
                 <User className="text-indigo-600" size={24} />
                 {t('common.personal_info')}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-2">
                    <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest flex items-center gap-2 opacity-60">
                       <Mail size={14} /> {t('common.email')}
                    </span>
                    <p className="text-lg font-black text-[var(--color-text-primary)]">{user?.email}</p>
                 </div>
                 <div className="space-y-2">
                    <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest flex items-center gap-2 opacity-60">
                       <Shield size={14} /> {t('common.system_id')}
                    </span>
                    <p className="text-lg font-black text-[var(--color-text-primary)]">#UID-{user?.id?.toString().padStart(6, '0')}</p>
                 </div>
                 <div className="space-y-2">
                    <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest flex items-center gap-2 opacity-60">
                       <Phone size={14} /> {t('common.phone')}
                    </span>
                    <p className="text-lg font-black text-[var(--color-text-primary)]">{user?.phone || t('common.not_linked')}</p>
                 </div>
                 <div className="space-y-2">
                    <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest flex items-center gap-2 opacity-60">
                       <Calendar size={14} /> {t('common.registration_date')}
                    </span>
                    <p className="text-lg font-black text-[var(--color-text-primary)]">12 Sentabr, 2023</p>
                 </div>
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="card-premium p-10"
           >
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-xl font-black text-[var(--color-text-primary)] flex items-center gap-3">
                    <Shield className="text-indigo-600" size={24} />
                    {t('common.permissions_label')}
                 </h4>
                 <div className="px-4 py-1.5 bg-[var(--color-bg-primary)] rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-[var(--color-border)]">
                    {t('common.role_label')}: {t(`roles.${user?.role}`, user?.role)}
                 </div>
              </div>

              <div className="flex flex-wrap gap-3">
                 {PERMISSIONS.map((p) => (
                   <div key={p} className="px-6 py-2.5 bg-[var(--color-bg-primary)]/50 border border-[var(--color-border)] rounded-2xl text-[11px] font-black uppercase tracking-wider text-[var(--color-text-secondary)] hover:border-indigo-600/30 transition-all cursor-default">
                      {p}
                   </div>
                 ))}
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
