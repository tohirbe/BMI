import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { Settings, Bell, Shield, Globe, Monitor, Zap, Save, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifs: true,
    pushNotifs: true,
    darkMode: false,
    language: "uz",
    twoFactor: false,
  });

  const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <PageHeader 
        title="System Settings" 
        subtitle="Customize your platform experience and security preferences"
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section: General */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
             <h4 className="font-black text-slate-800 flex items-center gap-3">
                <Monitor className="text-indigo-500" size={22} />
                Interface Preferences
             </h4>
             <Zap className="text-slate-300" size={20} />
          </div>
          
          <div className="p-10 space-y-8">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <p className="font-bold text-slate-800">Language (Til)</p>
                   <p className="text-xs text-slate-400 font-medium">Select your preferred interface language</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                   {['uz', 'ru', 'en'].map((l) => (
                      <button 
                         key={l}
                         onClick={() => setSettings({ ...settings, language: l })}
                         className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${settings.language === l ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                      >
                         {l}
                      </button>
                   ))}
                </div>
             </div>

             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <p className="font-bold text-slate-800">Dark Appearance</p>
                   <p className="text-xs text-slate-400 font-medium">Toggle high-contrast dark theme mode</p>
                </div>
                <button 
                   onClick={() => toggle('darkMode')}
                   className={`w-14 h-8 rounded-full transition-all relative ${settings.darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                   <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
                </button>
             </div>
          </div>
        </motion.div>

        {/* Section: Notifications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
             <h4 className="font-black text-slate-800 flex items-center gap-3">
                <Bell className="text-rose-500" size={22} />
                Global Notifications
             </h4>
             <ChevronRight className="text-slate-300" size={20} />
          </div>
          
          <div className="p-10 space-y-8">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <p className="font-bold text-slate-800">Push Notifications</p>
                   <p className="text-xs text-slate-400 font-medium">Receive real-time alerts in your browser</p>
                </div>
                <button 
                   onClick={() => toggle('pushNotifs')}
                   className={`w-14 h-8 rounded-full transition-all relative ${settings.pushNotifs ? 'bg-emerald-500' : 'bg-slate-200'}`}
                >
                   <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all ${settings.pushNotifs ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
                </button>
             </div>

             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <p className="font-bold text-slate-800">Email Summaries</p>
                   <p className="text-xs text-slate-400 font-medium">Weekly digest of university analytics</p>
                </div>
                <button 
                   onClick={() => toggle('emailNotifs')}
                   className={`w-14 h-8 rounded-full transition-all relative ${settings.emailNotifs ? 'bg-emerald-500' : 'bg-slate-200'}`}
                >
                   <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all ${settings.emailNotifs ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
                </button>
             </div>
          </div>
        </motion.div>

        {/* Section: Security */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl flex items-center justify-between"
        >
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                 <Shield className="text-indigo-400" size={32} />
              </div>
              <div className="space-y-1">
                 <h4 className="text-xl font-black">Two-Factor Authentication</h4>
                 <p className="text-indigo-200/60 font-medium text-sm">Add an extra layer of security to your account.</p>
              </div>
           </div>
           <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/10 h-14 px-8">
              Enable 2FA
           </Button>
        </motion.div>

        <div className="pt-6 flex justify-end">
           <Button icon={<Save size={18}/>} className="h-14 px-12 rounded-2xl">
              Save Global Settings
           </Button>
        </div>
      </div>
    </div>
  );
}
