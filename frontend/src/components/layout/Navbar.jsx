import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import { clearPermissions } from "../../store/permissionsSlice";
import { selectUser } from "../../store/authSlice";
import { useNotifications } from "../../hooks/useNotifications";
import { Search, Bell, Menu, User, LogOut, Settings, Sun, Moon, Globe } from "lucide-react";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/config";
import { Fragment } from "react";

export default function Navbar({ onMenuClick }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { unreadCount } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearPermissions());
    navigate("/login");
  };

  return (
    <header className="h-24 glass-header px-4 md:px-10 flex items-center justify-between gap-6 shrink-0">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={onMenuClick}
        className="p-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] rounded-2xl transition-all lg:hidden active:scale-90"
      >
        <Menu size={24} />
      </button>

      {/* Left: Search Bar */}
      <div className="flex-1 max-w-md relative group hidden sm:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-40 group-focus-within:text-indigo-600 group-focus-within:opacity-100 transition-all" size={18} />
        <input 
          type="text" 
          placeholder={t('common.search', 'Qidiruv...')} 
          className="w-full input-premium pl-12 h-12 font-bold"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] rounded-2xl transition-all active:scale-90"
        >
          {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
        </button>

        {/* Notifications Bell */}
        <button 
          onClick={() => navigate("/notifications")}
          className="relative p-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] rounded-2xl transition-all active:scale-90"
        >
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-4.5 h-4.5 bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-[var(--color-bg-secondary)] shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Language Switcher */}
        <HeadlessMenu as="div" className="relative">
          <HeadlessMenu.Button className="p-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] rounded-2xl transition-all active:scale-90">
            <Globe size={22} />
          </HeadlessMenu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <HeadlessMenu.Items className="absolute right-0 mt-3 w-36 bg-[var(--color-bg-secondary)] rounded-2xl shadow-2xl border border-[var(--color-border)] p-2 focus:outline-none z-[200]">
              {['uz', 'ru', 'en'].map((lang) => (
                <HeadlessMenu.Item key={lang}>
                  {({ active }) => (
                    <button
                      onClick={() => changeLanguage(lang)}
                      className={`${active || i18n.language === lang ? 'bg-indigo-600 text-white shadow-lg' : 'text-[var(--color-text-primary)]'} flex items-center justify-center w-full px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all mb-1 last:mb-0`}
                    >
                      {lang === 'uz' ? "O'zbek" : lang === 'ru' ? "Русский" : "English"}
                    </button>
                  )}
                </HeadlessMenu.Item>
              ))}
            </HeadlessMenu.Items>
          </Transition>
        </HeadlessMenu>

        <div className="w-px h-8 bg-[var(--color-border)] mx-1" />

        {/* User Profile Menu */}
        <HeadlessMenu as="div" className="relative">
          <HeadlessMenu.Button className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-[var(--color-bg-primary)] transition-all border border-transparent active:scale-95 group">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md uppercase group-hover:scale-105 transition-transform">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="hidden lg:flex flex-col justify-center text-left">
              <p className="text-sm font-black text-[var(--color-text-primary)] leading-none mb-1">{user?.full_name}</p>
              <p className="text-[9px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest opacity-40 leading-none">
                {t(`roles.${user?.role}`, user?.role)}
              </p>
            </div>
          </HeadlessMenu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <HeadlessMenu.Items className="absolute right-0 mt-3 w-64 bg-[var(--color-bg-secondary)] rounded-3xl shadow-2xl border border-[var(--color-border)] p-3 focus:outline-none z-[200]">
              <div className="px-4 py-2 mb-2">
                <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40">{t('common.account', 'Account')}</p>
              </div>
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button 
                    onClick={() => navigate("/profile")}
                    className={`${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-[var(--color-text-primary)]'} flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-sm font-black transition-all mb-1`}
                  >
                    <User size={20} /> {t('common.profile', 'Profil')}
                  </button>
                )}
              </HeadlessMenu.Item>
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button 
                    onClick={() => navigate("/settings")}
                    className={`${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-[var(--color-text-primary)]'} flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-sm font-black transition-all mb-1`}
                  >
                    <Settings size={20} /> {t('common.settings', 'Sozlamalar')}
                  </button>
                )}
              </HeadlessMenu.Item>
              <div className="my-2 border-t border-[var(--color-border)] opacity-50" />
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button 
                    onClick={handleLogout}
                    className={`${active ? 'bg-rose-600 text-white shadow-lg' : 'text-rose-600'} flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-sm font-black transition-all`}
                  >
                    <LogOut size={20} /> {t('common.logout', 'Chiqish')}
                  </button>
                )}
              </HeadlessMenu.Item>
            </HeadlessMenu.Items>
          </Transition>
        </HeadlessMenu>
      </div>
    </header>
  );
}