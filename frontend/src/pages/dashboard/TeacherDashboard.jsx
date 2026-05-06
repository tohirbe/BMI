import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";
import { subjects, grades, analytics } from "../../api";
import { gradeTypeLabel } from "../../utils/helpers";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, FileUp, UserCheck, BarChart3, TrendingUp, Trophy, AlertCircle, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [subList, setSubList] = useState([]);
  const [selSub, setSelSub] = useState(null);
  const [subStats, setSubStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    subjects.list()
      .then((r) => {
        const list = r.data.data ?? [];
        setSubList(list);
        if (list.length > 0) setSelSub(list[0]);
      })
      .catch(() => toast.error("Fanlar yuklanmadi"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selSub) return;
    setStatsLoading(true);
    analytics.subject(selSub.id)
      .then((r) => setSubStats(r.data.data))
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, [selSub]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <PageHeader
        title="Teacher Dashboard"
        subtitle="Track your students performance and attendance"
        actions={
          <div className="flex gap-3">
             <Button variant="secondary" icon={<FileUp size={18} />} onClick={() => navigate("/grades/bulk")}>CSV</Button>
             <Button variant="secondary" icon={<UserCheck size={18} />} onClick={() => navigate("/attendance/daily")}>Attendance</Button>
             <Button icon={<Plus size={18} />} onClick={() => navigate("/grades/new")}>Grade</Button>
          </div>
        }
      />

      {/* Subject Selection Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {subList.map((sub) => (
          <motion.div
            key={sub.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelSub(sub)}
            className={`
              cursor-pointer px-6 py-4 rounded-[1.5rem] border-2 transition-all min-w-[200px] flex flex-col gap-1
              ${selSub?.id === sub.id 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' 
                : 'bg-white border-slate-100 text-slate-800 hover:border-indigo-200 shadow-sm'}
            `}
          >
            <div className="font-black text-sm flex items-center gap-2">
              <BookOpen size={16} className={selSub?.id === sub.id ? 'text-white' : 'text-indigo-500'} />
              {sub.name}
            </div>
            <div className={`text-[11px] font-bold uppercase tracking-wider ${selSub?.id === sub.id ? 'text-indigo-100' : 'text-slate-400'}`}>
              {sub.group_name} • {sub.credit_hours} Credits
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selSub && (
          <motion.div 
            key={selSub.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden"
          >
            <div className="p-10 space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                  <TrendingUp className="text-indigo-500" size={24} />
                  Performance Analysis: {selSub.name}
                </h3>
                {statsLoading && <div className="w-5 h-5 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />}
              </div>

              {!statsLoading && subStats && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Avg. Score" value={subStats.avg_score} color="#6366f1" icon={<BarChart3 size={20} />} />
                    <StatCard label="Attendance" value={`${subStats.attendance_pct}%`} color="#22c55e" icon={<Calendar size={20} />} />
                    <StatCard label="Excellent (A)" value={subStats.score_distribution.alo} color="#10b981" icon={<Trophy size={20} />} />
                    <StatCard label="Failures (F)" value={subStats.score_distribution.qoniqarsiz} color="#f43f5e" icon={<AlertCircle size={20} />} />
                  </div>

                  {subStats.dynamics?.length > 0 && (
                    <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Score Dynamics</h4>
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={subStats.dynamics}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} 
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                          />
                          <Bar dataKey="avg_score" name="Avg Score" fill="#6366f1" radius={[10, 10, 10, 10]} barSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}