import React, { useState } from "react";
import { api } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { WashingMachine as Machine, User, Phone, Lock, Mail, ArrowRight } from "lucide-react";

export function CustomerAuth({ type, onAuth }: { type: "login" | "register", onAuth: (user: any, token: string) => void }) {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result;
      if (type === "register") {
        result = await api.auth.register({ password, name, phone });
      } else {
        result = await api.auth.login({ phone, password });
      }
      onAuth(result.user, result.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 bg-[#F0F9FF]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl p-6 sm:p-10 border border-blue-50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-blue-50 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 opacity-50" />
        
        <div className="text-center mb-8 sm:mb-10 relative z-10">
          <div className="inline-flex p-3 sm:p-4 bg-blue-100 rounded-[1rem] sm:rounded-[1.25rem] mb-4 sm:mb-6 text-brand shadow-sm">
            <Machine size={32} className="sm:size-[40px]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
            {type === "register" ? "Join SPIN" : "Welcome Back"}
          </h2>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-[10px]">
            {type === "register" ? "Fast & Fresh Laundry Service" : "Track your orders in real-time"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 sm:space-y-5 relative z-10">
          {type === "register" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="text"
                  placeholder="Enter your name"
                  className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-brand transition-all font-bold text-slate-800 text-base sm:text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="tel"
                placeholder="0912 345 6789"
                className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-brand transition-all font-bold text-slate-800 text-base sm:text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-brand transition-all font-bold text-slate-800 text-base sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-500 text-[11px] font-black text-center bg-red-50 py-3 rounded-xl border border-red-100 uppercase tracking-tight"
            >
              {error}
            </motion.div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-brand text-white py-4 sm:py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-brand-dark transition-all disabled:opacity-50 shadow-xl shadow-blue-100 group mt-6 sm:mt-8 active:scale-95 uppercase tracking-widest text-sm sm:text-base"
          >
            {loading ? "PROCESSING..." : type === "register" ? "CREATE ACCOUNT" : "SIGN IN"}
            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 sm:mt-10 text-center relative z-10">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            {type === "register" ? "ALREADY PART OF US?" : "FIRST TIME HERE?"}{" "}
            <Link
              to={type === "register" ? "/login" : "/register"}
              className="text-brand font-black hover:underline ml-1"
            >
              {type === "register" ? "LOGIN" : "REGISTER"}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
