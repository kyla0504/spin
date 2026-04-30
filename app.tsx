import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { CustomerAuth } from "./pages/CustomerAuth";
import { AdminLogin } from "./pages/AdminLogin";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { BookingPage } from "./pages/BookingPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Loader2, LogOut, WashingMachine as Machine } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.isAdmin || false);
    }
    setLoading(false);
  }, []);

  const handleAuth = (userData: any, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAdmin(userData.isAdmin || false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsAdmin(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-brand" />
        </motion.div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        {user && <Header isAdmin={isAdmin} onLogout={handleLogout} />}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <LandingPage />} />
              <Route path="/login" element={<CustomerAuth type="login" onAuth={handleAuth} />} />
              <Route path="/register" element={<CustomerAuth type="register" onAuth={handleAuth} />} />
              <Route path="/admin/login" element={<AdminLogin onAuth={handleAuth} />} />
              
              <Route path="/dashboard" element={user && !isAdmin ? <CustomerDashboard /> : <Navigate to="/login" />} />
              <Route path="/book" element={user && !isAdmin ? <BookingPage /> : <Navigate to="/login" />} />
              
              <Route path="/admin" element={user && isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </BrowserRouter>
  );
}

function Header({ isAdmin, onLogout }: { isAdmin: boolean; onLogout: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-blue-50 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="bg-brand rounded-xl p-1.5 sm:p-2.5 text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
            <Machine size={18} className="sm:w-[22px] sm:h-[22px]" />
          </div>
          <span className="font-black text-xl sm:text-2xl tracking-tighter text-slate-900">S.P.I.N</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="sm:hidden p-2 hover:bg-slate-100 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 bg-slate-600 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-slate-600 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-slate-600 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
        
        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          {isAdmin ? (
            <span className="text-[10px] font-black bg-brand-light text-brand px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">Control Panel</span>
          ) : (
            <Link to="/book" className="text-xs font-black text-brand hover:text-brand-dark transition-colors uppercase tracking-widest bg-brand-light px-4 py-2 rounded-xl border border-blue-100">Quick Book</Link>
          )}
          <button
            onClick={onLogout}
            className="p-2.5 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100 group"
            title="Secure Logout"
          >
            <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-blue-50 shadow-lg py-4 px-4 flex flex-col gap-4">
          {isAdmin ? (
            <span className="text-[10px] font-black bg-brand-light text-brand px-3 py-2 rounded-full uppercase tracking-widest border border-blue-100 text-center">Control Panel</span>
          ) : (
            <Link 
              to="/book" 
              className="text-xs font-black text-brand hover:text-brand-dark transition-colors uppercase tracking-widest bg-brand-light px-4 py-3 rounded-xl border border-blue-100 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Quick Book
            </Link>
          )}
          <button
            onClick={() => { onLogout(); setMenuOpen(false); }}
            className="p-3 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F0F9FF]">
      <section className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 relative overflow-hidden">
        {/* Decorative background bubbles from theme */}
        <div className="absolute top-16 sm:top-20 right-[5%] sm:right-[10%] w-40 sm:w-64 h-40 sm:h-64 bg-blue-100 rounded-full blur-[80px] sm:blur-[100px] opacity-40 animate-pulse" />
        <div className="absolute bottom-16 sm:bottom-20 left-[5%] sm:left-[10%] w-48 sm:w-96 h-48 sm:h-96 bg-brand-light rounded-full blur-[80px] sm:blur-[100px] opacity-30 animate-pulse delay-1000" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl relative z-10"
        >
          <div className="inline-block p-4 sm:p-5 bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl mb-8 sm:mb-10 border border-blue-50">
            <Machine size={48} className="sm:size-[64px] lg:size-[80px] text-brand" />
          </div>
          
          <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]">
              Freshness, <span className="text-brand">Simplified.</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-500 font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] max-w-xl mx-auto">
              Service Processing & Instant Notification
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center">
            <Link
              to="/register"
              className="bg-brand text-white px-8 sm:px-10 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] font-black text-base sm:text-lg hover:bg-brand-dark transition-all transform hover:-translate-y-1 shadow-2xl shadow-blue-200 uppercase tracking-widest"
            >
              Start Experience
            </Link>
            <Link
              to="/login"
              className="bg-white text-slate-700 border-2 border-blue-50 px-8 sm:px-10 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] font-black text-base sm:text-lg hover:bg-slate-50 transition-all shadow-sm uppercase tracking-widest"
            >
              Member Login
            </Link>
          </div>
          
          <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-left">
            <FeatureCard icon="⚡" title="Instant" desc="Real-time SMS updates on your laundry status" />
            <FeatureCard icon="🧼" title="Premium" desc="Eco-friendly detergents and expert care" />
            <FeatureCard icon="🚚" title="Doorstep" desc="Hassle-free pick-up and delivery options" />
          </div>
        </motion.div>
      </section>
      
      <footer className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full border-t border-blue-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <span>© 2024 S.P.I.N SYSTEMS</span>
        <Link to="/admin/login" className="hover:text-brand transition-colors">Operational Terminal</Link>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-white/50 backdrop-blur-sm p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-blue-50 shadow-sm group hover:bg-white transition-all">
      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-125 transition-transform origin-left">{icon}</div>
      <h3 className="font-black text-slate-900 mb-1 text-base sm:text-lg">{title}</h3>
      <p className="text-slate-500 text-[11px] font-bold leading-relaxed">{desc}</p>
    </div>
  );
}
