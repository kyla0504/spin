import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Booking } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Clock, 
  Package, 
  CheckCircle2, 
  Truck, 
  Store,
  ChevronRight,
  TrendingDown,
  Timer,
  WashingMachine as Machine
} from "lucide-react";

export function CustomerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await api.bookings.getAll();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    
    // Simple polling for "real-time" updates without Firebase
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeBookings = bookings.filter(b => b.status !== "Completed");
  const completedBookings = bookings.filter(b => b.status === "Completed");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Timer className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8 lg:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">Your Dashboard</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
            Track and manage your laundry in real-time
          </p>
        </div>
        <Link
          to="/book"
          className="bg-brand text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-lg shadow-blue-200 group transform hover:-translate-y-1 text-sm sm:text-base"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          NEW BOOKING
        </Link>
      </div>

      {/* Stats Grid from Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-blue-50 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 sm:w-20 h-16 sm:h-20 bg-blue-50 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">Active Orders</p>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900">{activeBookings.length.toString().padStart(2, '0')}</h3>
        </div>
        <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-blue-50 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 sm:w-20 h-16 sm:h-20 bg-green-50 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">Completed</p>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900">{completedBookings.length.toString().padStart(2, '0')}</h3>
        </div>
        <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-blue-50 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 sm:w-20 h-16 sm:h-20 bg-orange-50 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">Points Earned</p>
          <h3 className="text-3xl sm:text-4xl font-black text-brand tracking-tighter">{(completedBookings.length * 10).toString().padStart(2, '0')}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2 space-y-8 lg:space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-xl text-brand">
                <Clock size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Current Order Status</h2>
            </div>
            
            {activeBookings.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-blue-100 rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-16 text-center shadow-sm">
                <div className="bg-brand-light w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Package className="text-brand opacity-40" size={32} />
                </div>
                <h3 className="text-slate-800 font-black text-lg sm:text-xl mb-2">Ready to clean?</h3>
                <p className="text-slate-500 mb-6 sm:mb-8 max-w-xs mx-auto font-medium leading-relaxed text-sm sm:text-base">No orders at the moment. Experience fresh laundry today!</p>
                <Link to="/book" className="bg-brand-light text-brand px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-sm hover:bg-brand hover:text-white transition-all inline-flex items-center gap-2 group">
                  Book a Service <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <AnimatePresence initial={false}>
                  {activeBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          {completedBookings.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6 opacity-60">
                <CheckCircle2 className="text-slate-400" size={20} />
                <h2 className="text-lg sm:text-xl font-black text-slate-600 tracking-tight">Order History</h2>
              </div>
              <div className="space-y-3 sm:space-y-4 opacity-70 hover:opacity-100 transition-opacity">
                {completedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} small />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-blue-50 p-6 sm:p-8">
            <h3 className="font-black text-slate-800 mb-6 sm:mb-8 flex items-center gap-3 text-lg sm:text-xl">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <TrendingDown size={18} />
              </div>
              Process Guide
            </h3>
            <div className="space-y-6 sm:space-y-8 relative ml-4">
              <div className="absolute left-[-1.15rem] top-2 bottom-2 w-0.5 bg-slate-100" />
              <StatusStep icon={<Clock size={14} />} title="Pending Approval" desc="We're checking your order" isActive />
              <StatusStep icon={<Machine size={14} />} title="In Process" desc="Washing with premium care" />
              <StatusStep icon={<Package size={14} />} title="Ready for You" desc="Fresh and folded" />
              <StatusStep icon={<CheckCircle2 size={14} />} title="Handed Over" desc="Service completed" isLast />
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-[-20%] bottom-[-20%] w-40 h-40 bg-brand rounded-full blur-[80px] opacity-20" />
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
              <Machine size={20} className="text-brand" />
              Support
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Need help with your booking? Our team is active 24/7.</p>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 py-3 rounded-2xl font-bold transition-all text-sm">
              Live Chat Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusStep({ icon, title, desc, isActive, isLast }: any) {
  return (
    <div className="relative">
      <div className={`absolute left-[-1.5rem] top-1 w-3 h-3 rounded-full border-2 ${isActive ? 'bg-brand border-brand shadow-[0_0_8px_rgba(79,195,247,0.5)]' : 'bg-white border-slate-200'} z-10`} />
      <div>
        <h4 className={`text-sm font-bold ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>{title}</h4>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function BookingCard({ booking, small }: any) {
  const statusColors: any = {
    "Pending": "bg-amber-100 text-amber-700 border-amber-200",
    "Processing": "bg-blue-100 text-blue-700 border-blue-200",
    "Ready for Pick-up / Delivery": "bg-green-100 text-green-700 border-green-200",
    "Completed": "bg-slate-100 text-slate-600 border-slate-200",
  };

  const statusProgress: any = {
    "Pending": 25,
    "Processing": 50,
    "Ready for Pick-up / Delivery": 75,
    "Completed": 100,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:border-brand/30 transition-all ${small ? 'py-3' : ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${booking.deliveryOption === 'Delivery' ? 'bg-orange-50 text-orange-500' : 'bg-indigo-50 text-indigo-500'}`}>
            {booking.deliveryOption === 'Delivery' ? <Truck size={24} /> : <Store size={24} />}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-lg leading-tight">{booking.serviceType}</h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-bold text-slate-400 uppercase">{booking.id.slice(-6)}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs font-bold text-slate-400 uppercase">{booking.weight} KG</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-sm font-bold text-brand">₱{booking.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border mb-1 whitespace-nowrap ${statusColors[booking.status]}`}>
            {booking.status.toUpperCase()}
          </span>
          <p className="text-[10px] font-bold text-slate-400">
            {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Just now'}
          </p>
        </div>
      </div>

      {!small && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Status Progress</span>
            <span className="text-[10px] font-bold text-brand">{statusProgress[booking.status]}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${statusProgress[booking.status]}%` }}
              className="h-full bg-brand rounded-full shadow-[0_0_8px_rgba(79,195,247,0.5)]"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
