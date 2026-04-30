import React, { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldAlert, Lock, Mail, ArrowRight } from "lucide-react";

export function AdminLogin({ onAuth }: { onAuth: (user: any, token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await api.auth.adminLogin({ username, password });
      onAuth(result.user, result.token);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 bg-slate-900 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand rounded-full blur-[100px] sm:blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[100px] sm:blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-3xl rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 border border-white/10 relative z-10"
      >
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex p-3 sm:p-4 bg-red-500/20 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 text-red-500 shadow-inner">
            <ShieldAlert size={32} className="sm:size-[40px]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase italic">Secure Login</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] mt-2">Internal Administration Area</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 sm:ml-5">Operational ID (Username)</label>
            <div className="relative group">
              <Mail className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand transition-colors" size={20} />
              <input
                required
                type="text"
                placeholder="admin_root"
                className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand/20 focus:bg-white/10 transition-all placeholder:text-slate-700 font-bold text-base sm:text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 sm:ml-5">Access PIN (Password)</label>
            <div className="relative group">
              <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand transition-colors" size={20} />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand/20 focus:bg-white/10 transition-all placeholder:text-slate-700 font-bold text-base sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-red-400 text-[10px] font-black text-center bg-red-400/10 py-3 rounded-2xl border border-red-400/20 uppercase tracking-widest"
            >
              ACCESS DENIED: {error}
            </motion.div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-brand text-white py-4 sm:py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-brand-dark transition-all disabled:opacity-50 shadow-xl shadow-brand/10 group mt-6 sm:mt-8 active:scale-95 uppercase tracking-[0.15em] sm:tracking-[0.2em] text-sm sm:text-base"
          >
            {loading ? "VERIFYING..." : "GRANT ACCESS"}
            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center">
           <button 
             onClick={() => navigate('/')}
             className="text-[10px] font-black text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-[0.2em]"
           >
             Return to Public Terminal
           </button>
        </div>
      </motion.div>
    </div>
  );
}
