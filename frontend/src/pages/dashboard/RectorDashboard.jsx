import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { analytics, faculties as facultyApi } from "../../api";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import FilterBar from "../../components/ui/FilterBar";
import PageHeader from "../../components/ui/PageHeader";
import { GraduationCap, Users, BarChart3, CalendarDays, ArrowUpRight, TrendingUp } from "lucide-react";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e"];

export default function RectorDashboard() {
  const [stats, setStats] = useState(null);
  const [facList, setFacList] = useState([]);
  const [facStats, setFacStats] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    facultyApi.list().then((r) => setFacList(r.data.data ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    analytics.university(filters)
      .then((r) => setStats(r.data.data))
      .catch(() => toast.error("Ma'lumot yuklanmadi"))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    if (facList.length > 0) {
      Promise.all(facList.map((f) => analytics.faculty(f.id, filters)))
        .then((results) =>
          setFacStats(results.map((r, i) => ({
            name: facList[i].short_name,
            avg_score: r.data.data.avg_score,
            attendance_pct: r.data.data.attendance_pct,
          })))
        )
        .catch(() => {});
    }
  }, [facList, filters]);

  if (loading) return <Spinner />;

  const pieData = stats
    ? [
        { name: "A'lo", value: stats.score_distribution.alo },
        { name: "Yaxshi", value: stats.score_distribution.yaxshi },
        { name: "Qoniqarli", value: stats.score_distribution.qoniqarli },
        { name: "Qoniqarsiz", value: stats.score_distribution.qoniqarsiz },
      ]
    : [];

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Rector Analytics" 
        subtitle="Global University Overview & Performance Metrics"
        actions={
          <button className="btn-primary flex items-center gap-2">
            <TrendingUp size={18} /> Export Report
          </button>
        }
      />
      
      <div className="bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-slate-200/60 shadow-sm mb-8">
        <FilterBar onChange={setFilters} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Students" 
          value={stats?.total_students} 
          color="#6366f1" 
          icon={<GraduationCap size={24} />} 
          trend={2.4}
        />
        <StatCard 
          label="Active Teachers" 
          value={stats?.total_teachers} 
          color="#8b5cf6" 
          icon={<Users size={24} />} 
          trend={-0.5}
        />
        <StatCard 
          label="Average Score" 
          value={stats?.avg_score} 
          color="#ec4899" 
          icon={<BarChart3 size={24} />} 
          trend={1.2}
        />
        <StatCard 
          label="Attendance Rate" 
          value={`${stats?.attendance_pct ?? 0}%`} 
          color="#f43f5e" 
          icon={<CalendarDays size={24} />} 
          trend={4.1}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Comparison Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Faculty Performance</h3>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-50 px-3 py-1 rounded-full">Average Scores</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={facStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                domain={[0, 100]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="avg_score" 
                name="Score" 
                fill="url(#barGradient)" 
                radius={[10, 10, 0, 0]} 
                barSize={40}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Grade Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Grade Distribution</h3>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-50 px-3 py-1 rounded-full">All Subjects</div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={pieData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={80}
                  outerRadius={110} 
                  paddingAngle={8}
                  stroke="none"
                >
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="w-full md:w-48 space-y-4">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-sm font-medium text-slate-600">{d.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Attendance Trends */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Attendance by Faculty</h3>
              <p className="text-sm text-slate-500 font-medium">Comparative attendance rates across all divisions</p>
            </div>
            <ArrowUpRight className="text-slate-300" size={32} />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={facStats} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }} 
              />
              <Tooltip 
                formatter={(v) => `${v}%`}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="attendance_pct" 
                name="Attendance" 
                fill="#ec4899" 
                radius={[0, 10, 10, 0]} 
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}