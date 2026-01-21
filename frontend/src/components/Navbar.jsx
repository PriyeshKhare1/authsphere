// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { LogOut } from 'lucide-react';

// export default function Navbar() {
//   const { user, logout } = useAuth();

//   if (!user) return null;

//   return (
//     <nav className="w-full bg-black text-white px-6 py-4 flex justify-between items-center">
//       <h1 className="font-bold text-lg">AuthSphere</h1>

//       <div className="flex items-center gap-4 text-sm">
//         <Link to="/dashboard" className="hover:underline">
//           Dashboard
//         </Link>

//         {user.role === "admin" && (
//           <Link to="/admin" className="hover:underline">
//             Admin
//           </Link>
//         )}

//         <button
//           onClick={logout}
//           className="bg-white text-black px-3 py-1 rounded-md hover:bg-gray-200"
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// }


import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, LayoutDashboard, Shield, Menu, X, User, Bell } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { path: '/admin', label: 'Admin', icon: Shield, show: user.role === 'admin' },
  ].filter(link => link.show);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg transition-all duration-300">
      {/* Gradient Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-blue-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-blue-500/10 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ================= Logo / Branding ================= */}
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Main Logo */}
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-2xl font-bold text-white">A</span>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                AuthSphere
              </div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 -mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {user.role === 'admin' ? 'Admin Control' : user.role === 'manager' ? 'Manager Hub' : 'User Space'}
              </div>
            </div>
          </div>

          {/* ================= Desktop Navigation ================= */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    group/link relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden
                    ${active 
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl shadow-indigo-500/30' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 hover:shadow-lg'
                    }
                  `}
                >
                  {/* Background shimmer on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 ${!active && 'group-hover/link:opacity-100'} transition-opacity shimmer`}></div>
                  
                  <Icon className={`w-4 h-4 relative z-10 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover/link:scale-110'}`} />
                  <span className="relative z-10">{link.label}</span>
                  
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-white/50 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ================= Right Actions ================= */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 rounded-xl transition-all duration-300 hover:shadow-md group/bell"
              >
                <Bell className="w-5 h-5 transition-transform group-hover/bell:rotate-12 group-hover/bell:scale-110" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden animate-fadeInDown">
                  <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Notifications
                    </h3>
                  </div>
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-gray-400" />
                    </div>
                    No new notifications
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-3 ml-3 border-l border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3 group/user cursor-pointer">
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover/user:scale-110 group-hover/user:shadow-xl group-hover/user:shadow-indigo-500/30">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                </div>
                <div className="hidden lg:block">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover/user:text-indigo-600 dark:group-hover/user:text-indigo-400 transition-colors">
                    {user.name || user.email}
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    {user.role}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="group/logout flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl text-sm font-semibold hover:from-red-600 hover:to-rose-700 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <LogOut className="w-4 h-4 transition-transform group-hover/logout:translate-x-0.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* ================= Mobile Menu Button ================= */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 rounded-xl transition-all duration-300 hover:shadow-md"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ================= Mobile Navigation ================= */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50 dark:border-gray-700/50 animate-fadeInDown">
            <div className="space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      group/mobile relative flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden
                      ${active 
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl shadow-indigo-500/30' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 hover:shadow-md'
                      }
                    `}
                  >
                    {!active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/mobile:opacity-100 transition-opacity shimmer"></div>
                    )}
                    <Icon className={`w-5 h-5 relative z-10 transition-transform ${active ? 'scale-110' : 'group-hover/mobile:scale-110'}`} />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
              
              <div className="pt-4 mt-2 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50">
                  <div className="relative">
                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{user.name || user.email}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      {user.role}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 active:scale-95"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
