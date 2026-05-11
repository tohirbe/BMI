import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../../store/authSlice";
import { usePermissions } from "../../hooks/usePermissions";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  Layers, 
  Bell, 
  User, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  RefreshCw,
  DollarSign,
  Mail,
  GraduationCap,
  Settings,
  X
} from "lucide-react";

const ICON_MAP = {
  dashboard:     <LayoutDashboard size={20} />,
  curriculum_parent: <BookOpen size={20} />,
  retake_parent: <RefreshCw size={20} />,
  student_info_parent: <User size={20} />,
  finance_parent: <DollarSign size={20} />,
  messages_parent: <Mail size={20} />,
  system_parent: <Settings size={20} />,
  analytics:     <BarChart3 size={20} />,
  notifications: <Bell size={20} />,
  admin:         <ShieldCheck size={20} />,
};

function NavItem({ item, onClose }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  
  const isChildActive = hasChildren && item.children.some(child => location.pathname === child.url_path);
  const isActive = location.pathname === item.url_path || isChildActive;

  const handleToggle = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      if (onClose) onClose();
    }
  };

  return (
    <div className="mb-1.5">
      <NavLink
        to={hasChildren ? "#" : item.url_path}
        onClick={handleToggle}
        className={({ isActive: navActive }) => `
          group flex items-center justify-between px-4 py-3.5 rounded-[1.25rem] transition-all duration-300
          ${(navActive || isActive || isOpen) && !hasChildren
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
            : (isActive || isOpen) && hasChildren
              ? 'bg-indigo-600/10 text-indigo-600'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)]'}
        `}
      >
        <div className="flex items-center gap-4">
          <span className="transition-transform duration-300 group-hover:scale-110">
            {ICON_MAP[item.key] ?? <Layers size={20} />}
          </span>
          <span className="font-black text-sm tracking-tight">{t(`nav.${item.key}`, item.label)}</span>
        </div>
        {hasChildren && (
          <ChevronRight 
            size={16} 
            className={`transition-transform duration-400 ${isOpen || isActive ? 'rotate-90' : ''} opacity-40`} 
          />
        )}
      </NavLink>
      
      <AnimatePresence>
        {(isOpen || isActive) && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden ml-6 mt-1.5 border-l-2 border-[var(--color-border)] space-y-1.5"
          >
            {item.children.map(child => (
              <NavLink
                key={child.key}
                to={child.url_path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-6 py-3 rounded-xl text-xs transition-all duration-300
                  ${isActive 
                    ? 'text-indigo-600 font-black bg-indigo-600/5' 
                    : 'text-[var(--color-text-secondary)] font-bold hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]'}
                `}
              >
                <div className={`w-1.5 h-1.5 rounded-full transition-all ${location.pathname === child.url_path ? 'bg-indigo-600 scale-125' : 'bg-[var(--color-text-secondary)] opacity-20'}`} />
                {t(`nav.${child.key}`, child.label)}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({ onClose }) {
  const { menuItems } = usePermissions();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const topLevel = menuItems.filter((i) => i.can_view);

  const handleLogout = () => {
    dispatch(logout());
    toast.success(t('common.logout_success', 'Tizimdan chiqdingiz'));
    navigate("/login");
  };

  return (
    <div className="w-full h-full bg-[var(--color-bg-secondary)] flex flex-col border-r border-[var(--color-border)] overflow-hidden">
      {/* Header */}
      <div className="h-24 px-8 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
            <GraduationCap size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-[var(--color-text-primary)] leading-none mb-1">
              HEMIS
            </h1>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.2em] font-black opacity-40">Tatu BMI System</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] rounded-2xl lg:hidden active:scale-90 transition-all"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {topLevel.map((item) => (
          <NavItem key={item.key} item={item} onClose={onClose} />
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]/20 shrink-0">
        <div className="flex items-center gap-4 p-3 rounded-[1.5rem] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md uppercase">
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-[var(--color-text-primary)] truncate leading-none mb-1">
              {user?.full_name}
            </p>
            <p className="text-[9px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest opacity-40 truncate">
              {t(`roles.${user?.role}`, user?.role)}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2.5 text-[var(--color-text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all active:scale-90"
            title={t('common.logout')}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}