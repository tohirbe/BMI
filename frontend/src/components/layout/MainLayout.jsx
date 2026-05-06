import { Outlet } from "react-router-dom";
import Sidebar    from "./Sidebar";
import Navbar     from "./Navbar";

export default function MainLayout() {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}