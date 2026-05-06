import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { login } from "../../api/auth";
import { setCredentials } from "../../store/authSlice";
import { getDashboardPath } from "../../utils/helpers";
import { Mail, Lock, LogIn, GraduationCap, ChevronRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      const { access, refresh, user } = res.data.data;
      dispatch(setCredentials({ access, refresh, user }));
      toast.success(`Welcome back, ${user.full_name}!`);
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error ?? "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 relative overflow-hidden font-outfit">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Left Side: Illustration & Marketing (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative z-10 flex-col justify-center px-20">
         <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-12"
         >
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40">
                  <GraduationCap size={32} />
               </div>
               <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">EduStat <span className="text-indigo-500">BMI</span></h1>
            </div>

            <div className="space-y-6">
               <h2 className="text-7xl font-black text-white leading-[1.1] tracking-tighter">
                  Predictive <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">University</span> <br />
                  Intelligence.
               </h2>
               <p className="text-slate-400 text-xl font-medium max-w-lg leading-relaxed">
                  Empowering higher education with real-time analytics, student tracking, and automated reporting systems.
               </p>
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-md">
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400">
                     <Zap size={20} />
                     <span className="text-sm font-black uppercase tracking-widest">Real-time</span>
                  </div>
                  <p className="text-slate-500 text-sm font-bold">Instant data synchronization across all departments.</p>
               </div>
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-400">
                     <BarChart3 size={20} />
                     <span className="text-sm font-black uppercase tracking-widest">Analytics</span>
                  </div>
                  <p className="text-slate-500 text-sm font-bold">Deep insights into student performance & attendance.</p>
               </div>
            </div>
         </motion.div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-[500px] xl:w-[600px] flex items-center justify-center p-8 relative z-10">
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="w-full max-w-md space-y-10"
         >
            <div className="space-y-2 text-center lg:text-left">
               <h3 className="text-4xl font-black text-white tracking-tight">Access Portal</h3>
               <p className="text-slate-500 font-bold">Please enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity (Email)</label>
                     <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input
                           type="email"
                           required
                           value={form.email}
                           onChange={(e) => setForm({ ...form, email: e.target.value })}
                           className="w-full bg-white/5 border-none focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/50 text-white pl-14 h-16 rounded-2xl transition-all font-medium"
                           placeholder="name@university.edu"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Security (Password)</label>
                        <a href="#" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Reset?</a>
                     </div>
                     <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input
                           type="password"
                           required
                           value={form.password}
                           onChange={(e) => setForm({ ...form, password: e.target.value })}
                           className="w-full bg-white/5 border-none focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/50 text-white pl-14 h-16 rounded-2xl transition-all font-medium"
                           placeholder="••••••••"
                        />
                     </div>
                  </div>
               </div>

               <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white h-16 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3"
               >
                  {loading ? (
                    <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Authorize Session <ChevronRight size={18} /></>
                  )}
               </motion.button>
            </form>

            <div className="flex flex-col items-center gap-6">
               <div className="flex items-center gap-4 w-full">
                  <div className="h-px bg-white/5 flex-1" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Support Access</span>
                  <div className="h-px bg-white/5 flex-1" />
               </div>
               
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-wider group cursor-pointer hover:text-white transition-colors">
                     <ShieldCheck size={14} className="text-indigo-500" /> Security Protocol
                  </div>
                  <div className="w-px h-4 bg-white/5" />
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-wider group cursor-pointer hover:text-white transition-colors">
                     IT Helpdesk
                  </div>
               </div>
            </div>
         </motion.div>
      </div>

      <div className="absolute bottom-10 left-10 hidden lg:block">
         <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.3em]">
            System v4.2.0 • Encryption Enabled
         </p>
      </div>
    </div>
  );
}