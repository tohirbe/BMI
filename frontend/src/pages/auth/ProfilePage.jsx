import { useSelector } from "react-redux";
import { selectUser } from "../../store/authSlice";
import PageHeader from "../../components/ui/PageHeader";
import { User, Mail, Shield, Phone, Calendar, MapPin, Camera, Edit3, Lock, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";

export default function ProfilePage() {
  const user = useSelector(selectUser);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <PageHeader 
        title="Account Profile" 
        subtitle="Manage your personal information and account security"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden"
          >
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />
            <div className="px-8 pb-10 -mt-16 text-center space-y-6">
              <div className="relative inline-block group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl">
                   <div className="w-full h-full rounded-[2rem] bg-slate-100 flex items-center justify-center text-indigo-500 text-4xl font-black border-4 border-white shadow-inner">
                      {user?.full_name?.charAt(0)}
                   </div>
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-indigo-500 transition-all">
                   <Camera size={18} />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{user?.full_name}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">{user?.role}</p>
              </div>

              <div className="pt-6 border-t border-slate-50 space-y-3">
                 <Button className="w-full rounded-2xl h-12" variant="primary" icon={<Edit3 size={18}/>}>
                    Edit Profile
                 </Button>
                 <Button className="w-full rounded-2xl h-12 text-slate-500" variant="secondary" icon={<Lock size={18}/>}>
                    Change Password
                 </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 p-10"
           >
              <h4 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                 <User className="text-indigo-500" size={24} />
                 Personal Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Mail size={14} /> Email Address
                    </span>
                    <p className="text-lg font-bold text-slate-700">{user?.email}</p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Shield size={14} /> System ID
                    </span>
                    <p className="text-lg font-bold text-slate-700">#UID-{user?.id?.toString().padStart(6, '0')}</p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Phone size={14} /> Phone Number
                    </span>
                    <p className="text-lg font-bold text-slate-700">{user?.phone || 'Not specified'}</p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Calendar size={14} /> Joined Date
                    </span>
                    <p className="text-lg font-bold text-slate-700">September 12, 2023</p>
                 </div>
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl"
           >
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-xl font-black flex items-center gap-3">
                    <Shield className="text-indigo-400" size={24} />
                    Active Permissions
                 </h4>
                 <div className="px-4 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                    Role: {user?.role}
                 </div>
              </div>

              <div className="flex flex-wrap gap-3">
                 {['Dashboard', 'Analytics', 'Reports', 'User Management', 'Notifications', 'Settings'].map((p) => (
                   <div key={p} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-xs font-bold transition-all cursor-default">
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
