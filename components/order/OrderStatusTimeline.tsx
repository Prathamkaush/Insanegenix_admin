"use client";

import { motion } from "framer-motion";
import { FiCheck, FiClock, FiTruck, FiBox, FiPackage } from "react-icons/fi";

type Props = {
  status: string;
  createdAt: string;
  confirmedAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
};

const steps = [
  { key: "PENDING", label: "Order Placed", icon: <FiPackage />, dateKey: "createdAt" },
  { key: "CONFIRMED", label: "Confirmed", icon: <FiCheck />, dateKey: "confirmedAt" },
  { key: "SHIPPED", label: "Shipped", icon: <FiTruck />, dateKey: "shippedAt" },
  { key: "DELIVERED", label: "Delivered", icon: <FiBox />, dateKey: "deliveredAt" },
];

export default function OrderStatusTimeline({
  status,
  createdAt,
  confirmedAt,
  shippedAt,
  deliveredAt,
}: Props) {
  const dates: any = {
    createdAt,
    confirmedAt,
    shippedAt,
    deliveredAt,
  };

  const activeIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="bg-zinc-950/80 border border-white/10 p-6 md:p-12 rounded-sm shadow-2xl text-white">
      <header className="mb-8 md:mb-12">
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2 flex items-center gap-2">
          <FiClock className="text-brandRed" /> Real-time Tracking
        </h2>
        <p className="text-xl font-black uppercase tracking-tighter italic font-serif text-white">
          Where&apos;s my haul?
        </p>
      </header>

      {/* TIMELINE CONTAINER */}
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full max-w-4xl mx-auto gap-8 md:gap-0">
        
        {/* PROGRESS LINES */}
        {/* Desktop Line (Horizontal) */}
        <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/10 z-0" />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-brandRed z-0"
        />

        {/* Mobile Line (Vertical) */}
        <div className="md:hidden absolute left-[20px] top-0 w-[2px] h-full bg-white/10 z-0" />
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="md:hidden absolute left-[20px] top-0 w-[2px] bg-brandRed z-0"
        />

        {steps.map((step, i) => {
          const active = i <= activeIndex;
          const current = i === activeIndex;
          const date = dates[step.dateKey];

          return (
            <div key={step.key} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-0 group w-full md:w-auto">
              {/* Icon Circle */}
              <motion.div
                initial={false}
                animate={{ 
                  backgroundColor: active ? "var(--eg-theme-primary, #e50914)" : "#080808",
                  borderColor: active ? "var(--eg-theme-primary, #e50914)" : "#ffffff1a",
                  scale: current ? 1.1 : 1
                }}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 shadow-sm shrink-0 ${
                  active ? "text-white" : "text-zinc-600"
                }`}
              >
                {active && i < activeIndex ? <FiCheck size={18} /> : step.icon}
                
                {/* Pulsing indicator for current step */}
                {current && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandRed opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brandRed"></span>
                  </span>
                )}
              </motion.div>

              {/* Label & Date */}
              <div className="md:absolute md:top-16 text-left md:text-center flex flex-col justify-center">
                <p className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                  active ? "text-white" : "text-zinc-500"
                }`}>
                  {step.label}
                </p>
                {date && active && (
                  <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter mt-1">
                    {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Spacing for labels in desktop view */}
      <div className="hidden md:block h-20" />
    </div>
  );
}
