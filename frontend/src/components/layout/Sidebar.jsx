import { NavLink } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Users, 
  Layers, 
  Book, 
  FileText, 
  Bell, 
  User, 
  ShieldCheck, 
  Key,
  LogOut,
  ChevronRight
} from "lucide-react";

const ICON_MAP = {
  dashboard:     <LayoutDashboard size={20} />,
  grades:        <BookOpen size={20} />,
  attendance:    <Calendar size={20} />,
  analytics:     <BarChart3 size={20} />,
  students:      <Users size={20} />,
  groups:        <Layers size={20} />,
  subjects:      <Book size={20} />,
  reports:       <FileText size={20} />,
  notifications: <Bell size={20} />,
  users:         <User size={20} />,
  roles:         <ShieldCheck size={20} />,
  permissions:   <Key size={20} />,
};

export default function Sidebar() {
  const { menuItems } = usePermissions();
  const topLevel = menuItems.filter((i) => i.can_view);

  return (
    <aside className="w-72 h-screen bg-slate-900 flex flex-col text-white sticky top-0 z-50 shadow-2xl">
      {/* Header */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-xl font-bold">B</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              EduStat
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">University System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {topLevel.map((item) => (
          <NavLink
            key={item.key}
            to={item.url_path}
            className={({ isActive }) => `
              group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}
            `}
          >
            <div className="flex items-center gap-3">
              <span className={`transition-transform duration-300 group-hover:scale-110`}>
                {ICON_MAP[item.key] ?? <Layers size={20} />}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            {/* Active Indicator */}
            <ChevronRight 
              size={14} 
              className={`transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1`} 
            />
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 m-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">John Doe</p>
            <p className="text-[11px] text-slate-500 truncate uppercase tracking-tighter">Administrator</p>
          </div>
          <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}