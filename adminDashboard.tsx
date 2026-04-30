import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Booking, BookingStatus } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  MoreVertical, 
  Check, 
  Truck, 
  Phone, 
  ArrowRight,
  AlertCircle
} from "lucide-react";

export function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [notifying, setNotifying] = useState<string | null>(null);

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

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, currentStatus: BookingStatus, phone: string, name: string) => {
    const statusOrder: BookingStatus[] = ["Pending", "Processing", "Ready for Pick-up / Delivery", "Completed"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex >= statusOrder.length - 1) return;

    const nextStatus = statusOrder[currentIndex + 1];
    
    try {
      await api.bookings.update(id, { status: nextStatus });

      // Send Notification
      if (nextStatus === "Processing" || nextStatus === "Ready for Pick-up / Delivery") {
        await sendSMS(phone, name, nextStatus);
      }
      
      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const sendSMS = async (phone: string, name: string, status: string) => {
    setNotifying(phone);
    const message = `Hi ${name}! Your SPIN laundry booking is now ${status}. Thank you!`;
    
    try {
      await api.notify(phone, message);
    } catch (err) {
      console.error("Notification Error:", err);
    } finally {
      setNotifying(null);
    }
  };

  const filteredBookings = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

  const stats = {
    pending: bookings.filter(b => b.status === "Pending").length,
    processing: bookings.filter(b => b.status === "Processing").length,
    ready: bookings.filter(b => b.status.includes("Ready")).length,
    total: bookings.length
  };

  return (
    <div className="bg-[#F0F9FF] min-h-screen">
      <div className="p-4 sm:p-10 max-w-[1600px] mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Admin Control</h1>
            <div className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Real-time Operations Monitor
            </div>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-blue-50 overflow-x-auto no-scrollbar">
            {["All", "Pending", "Processing", "Ready for Pick-up / Delivery", "Completed"].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest ${
                  filter === st ? "bg-brand text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </header>

        {/* Professional Polish Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Pending" value={stats.pending} color="blue" />
          <StatCard title="In Laundry" value={stats.processing} color="green" />
          <StatCard title="Outbound" value={stats.ready} color="orange" />
          <StatCard title="Revenue" value={`₱${bookings.reduce((a, b) => a + b.totalPrice, 0).toLocaleString()}`} color="brand" isCurrency />
        </div>

        {/* Bookings Table Wrapper */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-blue-50 overflow-hidden">
          <div className="p-8 border-b border-blue-50 flex items-center justify-between bg-white">
            <h3 className="font-black text-slate-900 tracking-tight text-xl">Active Bookings</h3>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search orders, names..." 
                className="pl-12 pr-6 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-brand transition-all w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-blue-50">
                  <th className="px-8 py-5">Customer Identity</th>
                  <th className="px-8 py-5">Service Configuration</th>
                  <th className="px-8 py-5">Lifecycle Status</th>
                  <th className="px-8 py-5 text-right">Accounting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                <AnimatePresence>
                  {filteredBookings.map((booking) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-blue-50/20 transition-colors"
                    >
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-brand font-black text-white flex items-center justify-center text-lg shadow-lg shadow-blue-100">
                            {booking.customerName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 tracking-tight">{booking.customerName}</p>
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                              <Phone size={12} className="text-brand" /> {booking.customerPhone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col gap-2">
                          <span className="text-sm font-black text-slate-800 tracking-tight leading-none">{booking.serviceType}</span>
                          <div className="flex flex-wrap gap-2">
                             <span className="text-[9px] bg-slate-900 text-white px-2 py-1 rounded-lg font-black tracking-widest">{booking.id.slice(-8)}</span>
                             <span className="text-[9px] bg-brand-light text-brand px-2 py-1 rounded-lg font-black tracking-widest">{booking.weight} KG</span>
                             {booking.deliveryOption === 'Delivery' && (
                               <div className="flex items-center gap-1 text-[9px] bg-orange-100 text-orange-600 px-2 py-1 rounded-lg font-black tracking-widest">
                                 <Truck size={12} /> {booking.address?.slice(0, 15)}...
                               </div>
                             )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-4">
                          <StatusBadge status={booking.status} />
                          {booking.status !== "Completed" && (
                            <button
                              onClick={() => updateStatus(booking.id, booking.status, booking.customerPhone, booking.customerName)}
                              className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-brand transition-all transform active:scale-95 shadow-md flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                            >
                              Move Stage
                              <ArrowRight size={14} />
                            </button>
                          )}
                          {notifying === booking.customerPhone && (
                            <div className="flex items-center gap-2 text-[10px] font-black text-brand uppercase tracking-widest">
                               <div className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                               Notifying...
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <p className="font-black text-2xl text-slate-900 tracking-tighter">₱{booking.totalPrice.toFixed(2)}</p>
                        <p className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">
                          {booking.deliveryOption}
                        </p>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center">
                       <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                          <AlertCircle className="text-blue-200" size={48} />
                       </div>
                       <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">No matching records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, isCurrency }: { title: string, value: any, color: string, isCurrency?: boolean }) {
  const colorMap: any = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    orange: "bg-orange-50",
    brand: "bg-cyan-50"
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-blue-50 relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 ${colorMap[color]} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700`} />
      <div className="relative z-10">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</span>
        <div className="flex items-baseline gap-1 mt-2">
          <span className={`text-4xl font-black tracking-tighter ${isCurrency ? "text-brand" : "text-slate-900"}`}>
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    "Pending": "bg-amber-100 text-amber-700 border-amber-200 shadow-amber-100",
    "Processing": "bg-blue-100 text-blue-700 border-blue-200 shadow-blue-100",
    "Ready for Pick-up / Delivery": "bg-green-100 text-green-700 border-green-200 shadow-green-100",
    "Completed": "bg-slate-100 text-slate-600 border-slate-200 shadow-slate-100",
  };

  return (
    <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border shadow-sm uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  );
}
