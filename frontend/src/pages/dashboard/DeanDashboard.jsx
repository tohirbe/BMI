import { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { analytics, departments } from "../../api";
import { selectUser } from "../../store/authSlice";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import FilterBar from "../../components/ui/FilterBar";
import PageHeader from "../../components/ui/PageHeader";
import { GraduationCap, BarChart3, PieChart as PieIcon, Building2, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

const PIE_COLORS = ["#6366f1", "#3b82f6", "#f59e0b", "#ef4444"];

export default function DeanDashboard() {
  const user = useSelector(selectUser);
  const [stats, setStats] = useState(null);
  const [depts, setDepts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [facId, setFacId] = useState(null);

  useEffect(() => {
    departments.list()
      .then((r) => {
        const list = r.data.data ?? [];
        setDepts(list);
        if (list.length > 0) setFacId(list[0].faculty);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!facId) { setLoading(false); return; }
    setLoading(true);
    analytics.faculty(facId, filters)
      .then((r) => setStats(r.data.data))
      .catch(() => toast.error("Ma'lumot yuklanmadi"))
      .finally(() => setLoading(false));
  }, [facId, filters]);

  if (loading) return <Spinner />;
  if (!stats) return <p className="text-slate-400 p-10 text-center font-bold">No data available for this faculty</p>;

  const pieData = [
    { name: "A'lo", value: stats.score_distribution.alo },
    { name: "Yaxshi", value: stats.score_distribution.yaxshi },
    { name: "Qoniqarli", value: stats.score_distribution.qoniqarli },
    { name: "Qoniqarsiz", value: stats.score_distribution.qoniqarsiz },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <PageHeader 
        title="Dean Analytics" 
        subtitle={`Faculty of ${stats.faculty_name}`}
        icon={<GraduationCap size={28} className="text-indigo-600" />}
      />
      
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <FilterBar onChange={setFilters} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Average GPA" value={stats.avg_score} color="#6366f1" icon={<BarChart3 size={20} />} />
        <StatCard label="Attendance Rate" value={`${stats.attendance_pct}%`} color="#22c55e" icon={<CalendarDays size={20} />} />
        <StatCard label="Departments" value={stats.department_breakdown?.length} color="#8b5cf6" icon={<Building2 size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40"
        >
          <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
            <BarChart3 className="text-indigo-500" size={20} />
            Average Score by Department
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stats.department_breakdown}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
              />
              <YAxis 
                domain={[0, 100]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="avg_score" name="Avg Score" fill="#6366f1" radius={[12, 12, 12, 12]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40"
        >
          <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
            <PieIcon className="text-indigo-500" size={20} />
            Grade Distribution
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie 
                data={pieData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                innerRadius={70}
                outerRadius={110}
                paddingAngle={8}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}