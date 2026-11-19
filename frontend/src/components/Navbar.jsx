import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, Users, UserPlus, Info, Menu, X, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { studentService } from '../services/api';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  const checkStatus = async () => {
    setBackendStatus('checking');
    try {
      await studentService.checkHealth();
      setBackendStatus('online');
    } catch (err) {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkStatus();
    // Poll backend health every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-sky-600 text-white shadow-sm'
        : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
      isActive
        ? 'bg-sky-600 text-white shadow-sm'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 group-hover:text-sky-600 transition-colors">
                  EduManage
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-sky-100 text-sky-800 rounded-full border border-sky-200">
                  Exp 8: MERN Stack
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" end className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/students" className={navLinkClass}>
              <Users className="w-4 h-4" />
              <span>Student Records</span>
            </NavLink>
            <NavLink to="/add-student" className={navLinkClass}>
              <UserPlus className="w-4 h-4" />
              <span>Add Student</span>
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              <Info className="w-4 h-4" />
              <span>About Lab</span>
            </NavLink>
          </nav>

          {/* Backend Connection Indicator & Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={checkStatus}
              title="Click to recheck backend connection"
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border transition-all ${
                backendStatus === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : backendStatus === 'offline'
                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {backendStatus === 'online' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Backend Online</span>
                </>
              ) : backendStatus === 'offline' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Backend Offline</span>
                  <RefreshCw className="w-3 h-3 ml-0.5 animate-spin-reverse" />
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Checking...</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Server Status:</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                backendStatus === 'online'
                  ? 'bg-emerald-100 text-emerald-700'
                  : backendStatus === 'offline'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {backendStatus === 'online'
                ? 'Connected (Port 5000)'
                : backendStatus === 'offline'
                ? 'Disconnected'
                : 'Connecting...'}
            </span>
          </div>

          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            <LayoutDashboard className="w-5 h-5 text-sky-600" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/students"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            <Users className="w-5 h-5 text-sky-600" />
            <span>Student Records</span>
          </NavLink>
          <NavLink
            to="/add-student"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            <UserPlus className="w-5 h-5 text-sky-600" />
            <span>Add Student</span>
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            <Info className="w-5 h-5 text-sky-600" />
            <span>About Lab</span>
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
