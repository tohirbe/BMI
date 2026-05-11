import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/config";
import PageHeader from "../../components/ui/PageHeader";
import { Settings, Bell, Shield, Globe, Monitor, Zap, Save, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import { useTheme } from "../../context/ThemeContext";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [settings, setSettings] = useState({
    emailNotifs: true,
    pushNotifs: true,
    language: i18n.language || "uz",
    twoFactor: false,
  });

  const handleLanguageChange = (lang) => {
    setSettings({ ...settings, language: lang });
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <PageHeader 
        title={t('common.settings')} 
        subtitle={t('settings.subtitle', 'Platformangizni sozlash va xavfsizlik parametrlari')}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section: General */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium overflow-hidden shadow-sm"
        >
          <div className="p-8 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/50 flex items-center justify-between">
             <h4 className="font-black text-[var(--color-text-primary)] flex items-center gap-3">
                <Monitor className="text-indigo-600" size={22} />
                {t('settings.interface', 'Interfeys sozlamalari')}
             </h4>
             <Zap className="text-[var(--color-text-secondary)] opacity-20" size={20} />
          </div>
          
          <div className="p-10 space-y-8">
             {/* Language */}
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                   <p className="font-black text-[var(--color-text-primary)]">{t('settings.language', 'Til')}</p>
                   <p className="text-xs text-[var(--color-text-secondary)] font-bold opacity-60">{t('settings.language_desc', 'Interfeys tilini tanlang')}</p>
                </div>
                <div className="flex bg-[var(--color-bg-primary)] p-1 rounded-xl border border-[var(--color-border)]">
                   {['uz', 'ru', 'en'].map((l) => (
                      <button 
                         key={l}
                         onClick={() => handleLanguageChange(l)}
                         className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${settings.language === l ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                      >
                         {l}
                      </button>
                   ))}
                </div>
             </div>

             {/* Dark Mode */}
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                   <p className="font-black text-[var(--color-text-primary)]">{t('settings.dark_mode', 'Qorong\'i rejim')}</p>
                   <p className="text-xs text-[var(--color-text-secondary)] font-bold opacity-60">{t('settings.dark_mode_desc', 'Yuqori kontrastli qorong\'i tema')}</p>
                </div>
                <button 
                   onClick={toggleTheme}
                   className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-[var(--color-border)]'}`}
                >
                   <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
          </div>
        </motion.div>

        {/* Section: Notifications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium overflow-hidden shadow-sm"
        >
          <div className="p-8 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/50 flex items-center justify-between">
             <h4 className="font-black text-[var(--color-text-primary)] flex items-center gap-3">
                <Bell className="text-rose-500" size={22} />
                {t('settings.notifications', 'Bildirishnomalar')}
             </h4>
             <ChevronRight className="text-[var(--color-text-secondary)] opacity-20" size={20} />
          </div>
          
          <div className="p-10 space-y-8">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                   <p className="font-black text-[var(--color-text-primary)]">{t('settings.push_notifs', 'Push bildirishnomalar')}</p>
                   <p className="text-xs text-[var(--color-text-secondary)] font-bold opacity-60">{t('settings.push_desc', 'Brauzeringizda real vaqtda bildirishnomalar oling')}</p>
                </div>
                <button 
                   onClick={() => toggle('pushNotifs')}
                   className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${settings.pushNotifs ? 'bg-emerald-500' : 'bg-[var(--color-border)]'}`}
                >
                   <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${settings.pushNotifs ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>

             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                   <p className="font-black text-[var(--color-text-primary)]">{t('settings.email_notifs', 'Email hisobotlar')}</p>
                   <p className="text-xs text-[var(--color-text-secondary)] font-bold opacity-60">{t('settings.email_desc', 'Haftalik universitet analitika xulosasi')}</p>
                </div>
                <button 
                   onClick={() => toggle('emailNotifs')}
                   className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${settings.emailNotifs ? 'bg-emerald-500' : 'bg-[var(--color-border)]'}`}
                >
                   <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${settings.emailNotifs ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
          </div>
        </motion.div>

        {/* Section: Security */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-indigo-600/20 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                 <Shield className="text-indigo-200" size={28} />
              </div>
              <div className="space-y-1">
                 <h4 className="text-xl font-black">{t('settings.two_factor', 'Ikki bosqichli autentifikatsiya')}</h4>
                 <p className="text-indigo-200/70 font-bold text-sm">{t('settings.two_factor_desc', 'Hisobingizga qo\'shimcha xavfsizlik qatlami qo\'shing')}</p>
              </div>
           </div>
           <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/10 h-12 px-8 font-black text-xs uppercase tracking-widest shrink-0">
              {t('settings.enable_2fa', '2FA yoqish')}
           </Button>
        </motion.div>

        <div className="pt-4 flex justify-end">
           <Button icon={<Save size={18}/>} className="h-12 px-10 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20">
              {t('common.save')}
           </Button>
        </div>
      </div>
    </div>
  );
}
