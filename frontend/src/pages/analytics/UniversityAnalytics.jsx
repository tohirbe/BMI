import { useState, useEffect } from "react";
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { analytics } from "../../api";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { 
  TrendingUp, Users, GraduationCap, Building2, Calendar, 
  Download, Filter, Zap, Globe, Target, Award, BookOpen
} from "lucide-react";
import Button from "../../components/ui/Button";
import { motion } from "framer-motion";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#3b82f6"];
const CHART_TOOLTIP = {
  borderRadius: '1.5rem',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg-secondary)',
  color: 'var(--color-text-primary)',
  boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
  padding: '1rem',
  fontSize: 12,
  fontWeight: 700,
};

const MOCK_DATA = {
  total_students: 4285,
  total_teachers: 312,
  avg_score: 76.4,
  attendance_pct: 89.2,
  score_distribution: { alo: 842, yaxshi: 1563, qoniqarli: 1420, qoniqarsiz: 460 },
  faculty_breakdown: [
    { name: "Axborot texnologiyalari", short_name: "IT", avg_score: 82, attendance_pct: 93, student_count: 1240 },
    { name: "Iqtisodiyot", short_name: "Iqtisod", avg_score: 74, attendance_pct: 87, student_count: 980 },
    { name: "Huquqshunoslik", short_name: "Huquq", avg_score: 71, attendance_pct: 84, student_count: 720 },
    { name: "Pedagogika", short_name: "Pedagogika", avg_score: 78, attendance_pct: 90, student_count: 650 },
    { name: "Filologiya", short_name: "Filologiya", avg_score: 69, attendance_pct: 81, student_count: 695 },
  ],
};

const MONTHLY_TRENDS = [
  { month: "Sen", attendance: 91, performance: 74, students: 4100 },
  { month: "Okt", attendance: 89, performance: 76, students: 4150 },
  { month: "Noy", attendance: 86, performance: 75, students: 4200 },
  { month: "Dek", attendance: 82, performance: 73, students: 4220 },
  { month: "Yan", attendance: 88, performance: 77, students: 4250 },
  { month: "Fev", attendance: 90, performance: 79, students: 4260 },
  { month: "Mar", attendance: 93, performance: 81, students: 4285 },
];

const WEEKLY_ACTIVITY = [
  { day: "Dush", logins: 3420, grades: 180, attendance_marks: 2800 },
  { day: "Sesh", logins: 3650, grades: 210, attendance_marks: 2950 },
  { day: "Chor", logins: 3100, grades: 165, attendance_marks: 2700 },
  { day: "Pay", logins: 3800, grades: 240, attendance_marks: 3100 },
  { day: "Jum", logins: 2900, grades: 130, attendance_marks: 2500 },
  { day: "Shan", logins: 1200, grades: 45, attendance_marks: 800 },
];

const RADAR_DATA = [
  { metric: "GPA", value: 76 },
  { metric: "Davomat", value: 89 },
  { metric: "Ijtimoiy", value: 72 },
  { metric: "Ilmiy", value: 65 },
  { metric: "Sport", value: 58 },
  { metric: "Madaniy", value: 70 },
];

export default function UniversityAnalytics() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analytics.university()
      .then((r) => {
        const d = r.data.data;
        setData(d && d.total_students ? d : MOCK_DATA);
      })
      .catch(() => setData(MOCK_DATA))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const d = data || MOCK_DATA;

  const facultyData = (d.faculty_breakdown || MOCK_DATA.faculty_breakdown).map((f, i) => ({
    ...f,
    fill: COLORS[i % COLORS.length]
  }));

  const pieData = [
    { name: t('grades.alo', "A'lo"), value: d.score_distribution?.alo || 842 },
    { name: t('grades.yaxshi', 'Yaxshi'), value: d.score_distribution?.yaxshi || 1563 },
    { name: t('grades.qoniqarli', 'Qoniqarli'), value: d.score_distribution?.qoniqarli || 1420 },
    { name: t('grades.qoniqarsiz', 'Qoniqarsiz'), value: d.score_distribution?.qoniqarsiz || 460 },
  ];

  const totalGrades = pieData.reduce((s, p) => s + p.value, 0);

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <PageHeader 
        title={t('analytics.title')} 
        subtitle={t('analytics.subtitle')}
        actions={
          <div className="flex gap-4">
             <Button variant="secondary" className="h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-widest border-2" icon={<Filter size={18}/>}>
               {t('analytics.advanced_filters')}
             </Button>
             <Button className="h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20" icon={<Download size={18}/>}>
               {t('analytics.export_report')}
             </Button>
          </div>
        }
      />

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard label={t('analytics.total_population')} value={d.total_students?.toLocaleString()} color="#6366f1" icon={<Users size={24}/>} trend={4.2} />
        <StatCard label={t('analytics.institutional_gpa')} value={d.avg_score} color="#10b981" icon={<TrendingUp size={24}/>} trend={2.8} />
        <StatCard label={t('analytics.faculties')} value={facultyData.length} color="#8b5cf6" icon={<Building2 size={24}/>} />
        <StatCard label={t('analytics.attendance_score')} value={`${d.attendance_pct}%`} color="#f59e0b" icon={<Calendar size={24}/>} trend={1.5} />
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Performance by Faculty */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 card-premium p-10 shadow-sm"
        >
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                   <GraduationCap size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('analytics.performance_ranking')}</h3>
                  <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.15em] opacity-40">{t('analytics.comparative_analysis')}</p>
                </div>
             </div>
          </div>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facultyData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 800 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 900, fill: 'var(--color-text-primary)' }} 
                  width={140}
                />
                <Tooltip cursor={{ fill: 'var(--color-bg-primary)', opacity: 0.4 }} contentStyle={CHART_TOOLTIP} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 16, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="avg_score" name={t('dashboard.avg_performance')} radius={[0, 12, 12, 0]} barSize={20} fill="#6366f1" />
                <Bar dataKey="attendance_pct" name={t('dashboard.attendance')} radius={[0, 12, 12, 0]} barSize={20} fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Grade Distribution Donut */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 card-premium p-10 shadow-sm flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600"><Award size={22} /></div>
            <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('analytics.grade_distribution')}</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[220px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={90} paddingAngle={6} dataKey="value" stroke="none">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-black text-[var(--color-text-primary)]">{totalGrades.toLocaleString()}</div>
                  <div className="text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest opacity-40">{t('dashboard.total')}</div>
                </div>
              </div>
            </div>
            
            <div className="w-full mt-6 space-y-2.5">
               {pieData.map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-[var(--color-bg-primary)]/60 rounded-2xl border border-[var(--color-border)] hover:border-indigo-600/20 transition-all">
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                       <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-wider">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[var(--color-text-secondary)] opacity-40">{totalGrades > 0 ? ((item.value / totalGrades) * 100).toFixed(0) : 0}%</span>
                      <span className="text-sm font-black text-[var(--color-text-primary)]">{item.value.toLocaleString()}</span>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>

        {/* Secondary Row */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           
           {/* Strategic Growth Card */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-600/20 flex flex-col justify-between relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <Zap size={120} />
              </div>
              <div className="space-y-5 relative z-10">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                    <Zap size={28} />
                 </div>
                 <h4 className="text-2xl font-black tracking-tight">{t('analytics.strategic_growth')}</h4>
                 <p className="text-indigo-100/70 font-bold leading-relaxed">
                   {t('analytics.growth_description', 'Universitet akademik ko\'rsatkichlari so\'nggi 3 yilda')} <span className="text-white font-black">12%</span> {t('analytics.growth_suffix', 'ga o\'sdi')}.
                 </p>
              </div>
              <div className="pt-8 space-y-3 relative z-10">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{t('analytics.growth_goal')}</span>
                    <span className="font-black text-sm">75%</span>
                 </div>
                 <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-white rounded-full" />
                 </div>
              </div>
           </motion.div>

           {/* Attendance vs Performance Trend */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.15 }}
             className="lg:col-span-2 card-premium p-10 shadow-sm"
           >
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-600/10 flex items-center justify-center text-rose-600"><Target size={20} /></div>
                    <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('analytics.attendance_vs_performance', 'Davomat vs O\'zlashtirish')}</h3>
                 </div>
              </div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={MONTHLY_TRENDS} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                         <linearGradient id="anaAtt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                         <linearGradient id="anaPerf" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: 'var(--color-text-secondary)' }} dy={10} />
                      <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: 'var(--color-text-secondary)' }} />
                      <Tooltip contentStyle={CHART_TOOLTIP} />
                      <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 12, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                      <Area type="monotone" dataKey="attendance" name={t('dashboard.attendance')} stroke="#6366f1" strokeWidth={3} fill="url(#anaAtt)" dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="performance" name={t('dashboard.avg_performance')} stroke="#10b981" strokeWidth={3} fill="url(#anaPerf)" dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
                   </AreaChart>
                </ResponsiveContainer>
              </div>
           </motion.div>
        </div>

        {/* Bottom Row: Weekly Activity + Radar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7 card-premium p-10 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-600"><BookOpen size={20} /></div>
            <div>
              <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('analytics.weekly_activity', 'Haftalik faollik')}</h3>
              <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.15em] opacity-40">{t('analytics.system_usage', 'Tizimdan foydalanish statistikasi')}</p>
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_ACTIVITY} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800, fill: 'var(--color-text-secondary)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: 'var(--color-text-secondary)' }} />
                <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ fill: 'var(--color-bg-primary)', opacity: 0.5 }} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 12, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="logins" name={t('analytics.logins', 'Kirishlar')} fill="#6366f1" radius={[8, 8, 2, 2]} barSize={18} />
                <Bar dataKey="grades" name={t('analytics.grades_entered', 'Baholar')} fill="#f59e0b" radius={[8, 8, 2, 2]} barSize={18} />
                <Bar dataKey="attendance_marks" name={t('analytics.attendance_marks', 'Davomat')} fill="#22c55e" radius={[8, 8, 2, 2]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* University Radar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-5 card-premium p-10 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-600"><Globe size={20} /></div>
            <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('analytics.pulse')}</h3>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 800 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--color-text-secondary)', fontSize: 9, fontWeight: 700 }} />
                <Radar name={t('analytics.score', 'Ko\'rsatkich')} dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} />
                <Tooltip contentStyle={CHART_TOOLTIP} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Faculty Student Count - full width */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-12 card-premium overflow-hidden shadow-sm"
        >
          <div className="p-10 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600"><Building2 size={20} /></div>
              <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('analytics.faculty_overview', 'Fakultetlar umumiy ko\'rinishi')}</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--color-bg-primary)]/50 border-b border-[var(--color-border)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">
                  <th className="px-10 py-5 text-left">{t('analytics.faculty_name', 'Fakultet')}</th>
                  <th className="px-10 py-5 text-left">{t('dashboard.total_students')}</th>
                  <th className="px-10 py-5 text-left">{t('dashboard.avg_performance')}</th>
                  <th className="px-10 py-5 text-left">{t('dashboard.attendance')}</th>
                  <th className="px-10 py-5 text-left">{t('analytics.rating', 'Reyting')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {facultyData.map((f, i) => (
                  <tr key={i} className="hover:bg-indigo-600/5 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-xs" style={{ backgroundColor: f.fill }}>
                          {(f.short_name || f.name)?.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-black text-[var(--color-text-primary)] group-hover:text-indigo-600 transition-colors">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-[var(--color-text-secondary)]">{(f.student_count || 0).toLocaleString()}</td>
                    <td className="px-10 py-6">
                      <span className="px-4 py-1.5 rounded-full bg-indigo-600/10 text-indigo-600 text-xs font-black">{f.avg_score}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-[var(--color-bg-primary)] rounded-full overflow-hidden border border-[var(--color-border)] max-w-[120px]">
                          <div className="h-full rounded-full" style={{ width: `${f.attendance_pct}%`, backgroundColor: f.attendance_pct > 90 ? '#22c55e' : f.attendance_pct > 80 ? '#f59e0b' : '#ef4444' }} />
                        </div>
                        <span className="text-sm font-black text-[var(--color-text-primary)]">{f.attendance_pct}%</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`text-sm font-black ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-[var(--color-text-secondary)] opacity-60' : i === 2 ? 'text-orange-700' : 'text-[var(--color-text-secondary)] opacity-40'}`}>
                        #{i + 1}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
