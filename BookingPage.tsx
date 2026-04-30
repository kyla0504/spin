import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Weight, 
  ShoppingBag, 
  Truck, 
  Store,
  MapPin,
  Sparkles,
  Info,
  Check
} from "lucide-react";
import { ServiceType, DeliveryOption } from "../types";

const PRICING: Record<ServiceType, number> = {
  "Wash Only": 50,
  "Wash and Fold": 75,
  "Wash, Fold with Fabric Conditioner": 95,
};

export function BookingPage() {
  const [serviceType, setServiceType] = useState<ServiceType>("Wash Only");
  const [weight, setWeight] = useState<number>(0);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("Pick-up");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAddress(user.address || "");
    }
  }, []);

  const totalPrice = weight * PRICING[serviceType];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (weight <= 0) return alert("Please enter a valid weight");
    if (deliveryOption === "Delivery" && !address) return alert("Please enter a delivery address");

    setLoading(true);

    try {
      await api.bookings.create({
        serviceType,
        weight,
        totalPrice,
        deliveryOption,
        address: deliveryOption === "Delivery" ? address : null,
      });

      navigate("/dashboard");
    } catch (err: any) {
      alert(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto space-y-8 lg:space-y-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-3 text-slate-500 hover:text-brand transition-all group"
      >
        <div className="p-2 sm:p-2.5 bg-white rounded-xl shadow-sm border border-blue-50 group-hover:shadow-md transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="font-black text-[10px] uppercase tracking-widest hidden sm:inline">Back to Dashboard</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10"
      >
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <section className="bg-white rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-sm border border-blue-50">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 sm:mb-8 tracking-tighter flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl text-brand">
                <Sparkles size={24} />
              </div>
              New Booking
            </h2>

            <form onSubmit={handleBooking} className="space-y-8 lg:space-y-10">
              {/* Service Selection */}
              <div className="space-y-4 sm:space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">1. Choose Service</label>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {(Object.keys(PRICING) as ServiceType[]).map((type) => {
                    const icon = type === "Wash Only" ? "🧺" : type === "Wash and Fold" ? "👕" : "✨";
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setServiceType(type)}
                        className={`flex items-center justify-between p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all group ${
                          serviceType === type 
                          ? 'border-brand bg-brand-light shadow-lg shadow-blue-100 transform -translate-y-1' 
                          : 'border-slate-50 hover:border-blue-100 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className={`text-3xl sm:text-4xl transition-transform group-hover:scale-110 ${serviceType === type ? 'grayscale-0' : 'grayscale opacity-60'}`}>
                            {icon}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-base sm:text-lg leading-tight tracking-tight">{type}</p>
                            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${serviceType === type ? 'text-brand' : 'text-slate-400'}`}>
                              ₱{PRICING[type].toFixed(2)} per kg
                            </p>
                          </div>
                        </div>
                        <div className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center transition-all ${serviceType === type ? 'bg-brand text-white scale-110' : 'bg-slate-100 text-transparent'}`}>
                          <Check size={14} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weight Input */}
              <div className="space-y-4 sm:space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">2. Estimated Weight</label>
                <div className="relative group">
                  <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl border border-blue-50 shadow-sm text-brand group-focus-within:shadow-md transition-all">
                    <Weight size={20} className="sm:size-[24px]" />
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    required
                    placeholder="0.0"
                    className="w-full pl-16 sm:pl-22 pr-8 py-4 sm:py-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] sm:rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-brand transition-all font-black text-2xl sm:text-3xl text-slate-900"
                    value={weight || ""}
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                  />
                  <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Kilograms</span>
                  </div>
                </div>
              </div>

              {/* Delivery Selection */}
              <div className="space-y-4 sm:space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">3. Delivery Logistics</label>
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  {(["Pick-up", "Delivery"] as DeliveryOption[]).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDeliveryOption(opt)}
                      className={`flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all relative overflow-hidden group ${
                        deliveryOption === opt 
                        ? 'border-brand bg-brand-light text-brand shadow-lg shadow-blue-100' 
                        : 'border-slate-50 hover:border-blue-100 text-slate-400'
                      }`}
                    >
                      <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${deliveryOption === opt ? 'bg-white shadow-sm scale-110' : 'bg-slate-50 group-hover:bg-blue-50'}`}>
                        {opt === "Pick-up" ? <Store size={24} className="sm:size-[32px]" /> : <Truck size={24} className="sm:size-[32px]" />}
                      </div>
                      <span className="font-black text-xs uppercase tracking-[0.2em]">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address Input */}
              {deliveryOption === "Delivery" && (
                <div className="space-y-4 sm:space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Delivery Address</label>
                  <div className="relative">
                      <MapPin className="absolute left-4 sm:left-5 top-4 sm:top-5 text-slate-400" size={20} />
                    <textarea
                      required
                      placeholder="Street, Barangay, City..."
                      className="w-full pl-12 sm:pl-14 pr-6 sm:pr-8 py-4 sm:py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] sm:rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-brand transition-all min-h-[100px] sm:min-h-[140px] font-bold text-slate-700 text-sm sm:text-base"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button
                disabled={loading || !weight}
                type="submit"
                className="w-full bg-brand text-white py-4 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] font-black text-lg sm:text-xl hover:bg-brand-dark transition-all shadow-xl shadow-blue-200 disabled:opacity-50 uppercase tracking-widest mt-6 sm:mt-10 active:scale-95"
              >
                {loading ? "PROCESSING..." : `CONFIRM BOOKING`}
              </button>
            </form>
          </section>
        </div>

        {/* Price Breakdown Sidebar */}
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-slate-900 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden lg:sticky lg:top-30">
            <div className="absolute right-[-20%] top-[-20%] w-32 sm:w-40 h-32 sm:h-40 bg-brand rounded-full blur-[80px] opacity-20" />
            
            <h3 className="font-black text-lg sm:text-xl mb-8 sm:mb-10 flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl text-brand">
                <ShoppingBag size={20} />
              </div>
              Summary
            </h3>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center group">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Service Fee</span>
                <span className="font-black text-sm">₱{PRICING[serviceType].toFixed(2)}/kg</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Estimated Weight</span>
                <span className="font-black text-sm">{weight || 0} kg</span>
              </div>
              <div className="flex justify-between items-center group text-green-400">
                <span className="text-xs font-bold uppercase tracking-wider">Delivery Fee</span>
                <span className="font-black text-sm uppercase">Free</span>
              </div>
              
              <div className="border-t border-white/10 pt-6 sm:pt-8 mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Total Estimate</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-brand tracking-tighter">₱{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 sm:mt-12 p-4 sm:p-5 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10 flex gap-3 sm:gap-4">
              <div className="p-1.5 sm:p-2 bg-white/5 rounded-lg sm:rounded-xl h-fit">
                  <Info className="text-brand" size={16} />
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400 font-bold uppercase tracking-wide">
                Price may vary slightly based on final manual weighing at our hub.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-blue-50">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-100">
                 <span className="text-xl">💬</span>
               </div>
               <h4 className="font-black text-slate-800 text-sm">Real-time Updates</h4>
             </div>
             <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
               You will receive instant SMS notifications at every step of your laundry journey.
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
