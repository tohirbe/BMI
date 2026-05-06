import { useState, useEffect } from "react";
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, ScatterChart, Scatter, ZAxis
} from "recharts";
import toast from "react-hot-toast";
import { analytics } from "../../api";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { 
  TrendingUp, Users, GraduationCap, Building2, Calendar, 
  Download, Filter, ArrowUpRight, Search, Zap, Globe, Target
} from "lucide-react";
import Button from "../../components/ui/Button";
import { motion } from "framer-motion";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#3b82f6"];

export default function UniversityAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analytics.university()
      .then((r) => setData(r.data.data))
      .catch(() => toast.error("Analitika yuklanmadi"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <div className="p-20 text-center font-bold text-slate-400 text-xl tracking-tight">No analytical data available</div>;

  const facultyData = (data?.faculty_breakdown || []).map((f, i) => ({
    ...f,
    fill: COLORS[i % COLORS.length]
  }));

  const pieData = [
    { name: "A'lo (Excellent)", value: data?.score_distribution?.alo || 0 },
    { name: "Yaxshi (Good)", value: data?.score_distribution?.yaxshi || 0 },
    { name: "Qoniqarli (Satisfactory)", value: data?.score_distribution?.qoniqarli || 0 },
    { name: "Qoniqarsiz (Fail)", value: data?.score_distribution?.qoniqarsiz || 0 },
  ];

  // Mock data for "extensive" feel
  const monthlyTrends = [
    { month: "Sep", attendance: 92, performance: 78 },
    { month: "Oct", attendance: 88, performance: 82 },
    { month: "Nov", attendance: 85, performance: 80 },
    { month: "Dec", attendance: 78, performance: 85 },
    { month: "Jan", attendance: 94, performance: 88 },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <PageHeader 
        title="University Analytical Intelligence" 
        subtitle="Comprehensive data-driven insights across all departments and academic levels"
        actions={
          <div className="flex gap-3">
             <Button variant="secondary" icon={<Filter size={18}/>}>Advanced Filters</Button>
             <Button icon={<Download size={18}/>}>Generate PDF Report</Button>
          </div>
        }
      />

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Student Population" value={data.total_students} color="#6366f1" icon={<Users size={24}/>} trend="+4.2% from last year" />
        <StatCard label="Institutional GPA" value={data.avg_score} color="#10b981" icon={<TrendingUp size={24}/>} trend="Improving" />
        <StatCard label="Academic Faculties" value={(data?.faculty_breakdown || []).length} color="#8b5cf6" icon={<Building2 size={24}/>} />
        <StatCard label="Attendance Score" value={`${data.attendance_pct}%`} color="#f59e0b" icon={<Calendar size={24}/>} trend="-1.5% this week" />
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Performance by Faculty - Column Span 8 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40"
        >
          <div className="flex items-center justify-between mb-10">
             <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                    <GraduationCap className="text-indigo-500" size={26} />
                    Faculty Performance Ranking
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-9">Comparative analysis of average GPA</p>
             </div>
             <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 font-black text-xs cursor-pointer hover:bg-indigo-100 transition-colors">
                View All Details
             </div>
          </div>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={facultyData} layout="vertical" margin={{ left: 40, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fontWeight: 800, fill: '#1e293b' }} 
                width={140}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', padding: '1rem' }}
              />
              <Bar dataKey="avg_score" radius={[0, 20, 20, 0]} barSize={32}>
                 {facultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                 ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Global Distribution - Column Span 4 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 flex flex-col"
        >
          <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3">
             <TrendingUp className="text-emerald-500" size={26} />
             Grade Distribution
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius={70} 
                  outerRadius={110} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="w-full mt-8 space-y-3">
               {pieData.map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                       <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>

        {/* Secondary Analysis Row - Column Span 12 */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           
           {/* Growth Trends */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-200 flex flex-col justify-between"
           >
              <div className="space-y-4">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                    <Zap size={28} />
                 </div>
                 <h4 className="text-2xl font-black">Strategic Growth</h4>
                 <p className="text-white/60 font-medium text-sm">University academic performance has increased by <span className="text-white font-bold">12%</span> over the last 3 academic years.</p>
              </div>
              <div className="pt-8 flex items-center gap-4">
                 <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }} 
                       animate={{ width: '75%' }} 
                       transition={{ duration: 1, delay: 0.5 }}
                       className="h-full bg-white" 
                    />
                 </div>
                 <span className="font-black text-xs">75% Goal</span>
              </div>
           </motion.div>

           {/* Monthly Attendance vs Performance */}
           <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                    <Target className="text-rose-500" size={22} />
                    Attendance vs. Performance Matrix
                 </h3>
                 <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Attendance</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Performance</div>
                 </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                 <AreaChart data={monthlyTrends}>
                    <defs>
                       <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                       <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                    <Area type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Global Heatmap - Column Span 12 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-12 bg-slate-900 p-12 rounded-[4rem] text-white shadow-3xl shadow-indigo-200"
        >
          <div className="flex items-center justify-between mb-12">
             <div className="space-y-1">
               <h3 className="text-3xl font-black tracking-tight flex items-center gap-4">
                  <Globe className="text-indigo-400" size={32} />
                  Institutional Pulse
               </h3>
               <p className="text-indigo-200/60 font-medium">Monitoring attendance and academic activity across time and departments</p>
             </div>
             <div className="flex gap-3">
                <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-2xl">Daily</Button>
                <Button variant="ghost" className="bg-white/5 hover:bg-white/10 text-white/50 rounded-2xl">Monthly</Button>
             </div>
          </div>
          
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={facultyData}>
              <defs>
                <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700 }} />
              <YAxis hide />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '1rem', color: '#fff' }}
                 itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="attendance_pct" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorMain)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
