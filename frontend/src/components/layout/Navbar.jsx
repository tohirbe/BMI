import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import { clearPermissions } from "../../store/permissionsSlice";
import { selectUser } from "../../store/authSlice";
import { useNotifications } from "../../hooks/useNotifications";
import { Search, Bell, Menu, User, LogOut, Settings } from "lucide-react";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearPermissions());
    navigate("/login");
  };

  return (
    <header className="h-20 glass-effect sticky top-0 z-40 px-10 flex items-center justify-between">
      {/* Left: Search Bar */}
      <div className="flex-1 max-w-md relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search analytics, students..." 
          className="w-full bg-slate-100/50 border-transparent focus:bg-white focus:border-indigo-500 pl-12 h-11 rounded-xl transition-all"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications Bell */}
        <button 
          onClick={() => navigate("/notifications")}
          className="relative p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
        >
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Menu */}
        <HeadlessMenu as="div" className="relative">
          <HeadlessMenu.Button className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-slate-800 leading-tight">{user?.full_name}</p>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">{user?.role}</p>
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
            <HeadlessMenu.Items className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 focus:outline-none">
              <div className="px-3 py-2 border-bottom border-slate-100 mb-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account</p>
              </div>
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button 
                    onClick={() => navigate("/profile")}
                    className={`${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'} flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors`}
                  >
                    <User size={18} /> Profile
                  </button>
                )}
              </HeadlessMenu.Item>
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button 
                    onClick={() => navigate("/settings")}
                    className={`${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'} flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors`}
                  >
                    <Settings size={18} /> Settings
                  </button>
                )}
              </HeadlessMenu.Item>
              <div className="my-1 border-t border-slate-100" />
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button 
                    onClick={handleLogout}
                    className={`${active ? 'bg-red-50 text-red-600' : 'text-red-500'} flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-bold transition-colors`}
                  >
                    <LogOut size={18} /> Logout
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