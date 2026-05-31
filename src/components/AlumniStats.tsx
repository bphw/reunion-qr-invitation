import React from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, CheckCircle2, AlertCircle, BarChart3 } from 'lucide-react';

interface AlumniStatsProps {
  stats: {
    totalRegisteredAndPaid: number;
    totalCheckedIn: number;
    percentCheckedIn: number;
  };
}

export default function AlumniStats({ stats }: AlumniStatsProps) {
  const belumCheckIn = Math.max(0, stats.totalRegisteredAndPaid - stats.totalCheckedIn);

  const chartData = [
    { name: 'Hadir (Check-In)', value: stats.totalCheckedIn, color: '#06D6A0' },
    { name: 'Belum Check-In', value: belumCheckIn, color: '#EF476F' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] p-6 md:p-8 border-4 border-[#073B4C] shadow-[12px_12px_0px_0px_#118AB2] text-[#073B4C]"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-[#FFD166] p-3 rounded-2xl border-4 border-[#073B4C] shadow-lg rotate-[-2deg]">
          <BarChart3 size={32} className="text-[#073B4C]" />
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">
            Statistik Kehadiran Reuni
          </h3>
          <p className="text-[#118AB2] font-extrabold text-xs md:text-sm uppercase tracking-wider mt-1">
            Data Real-Time Check-In QR Code & Verifikasi Tiket
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Pie Chart Column (left on desktop) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-3xl border-4 border-[#073B4C] shadow-[4px_4px_0px_0px_#073B4C]">
          <div className="text-center mb-2">
            <span className="text-xs font-black uppercase tracking-widest opacity-60">Rasio Kehadiran</span>
          </div>
          
          <div className="relative w-full h-[180px] flex items-center justify-center">
            {stats.totalRegisteredAndPaid === 0 ? (
              <div className="text-center font-bold text-slate-400">Belum ada data</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#073B4C" strokeWidth={3} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '4px solid #073B4C', 
                        borderRadius: '16px', 
                        fontWeight: 'bold', 
                        color: '#073B4C' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center text on the pie donut hole */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black italic text-[#073B4C] leading-none">{stats.percentCheckedIn}%</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#073B4C]/50 mt-1">Hadir</span>
                </div>
              </>
            )}
          </div>
          
          <div className="flex gap-4 mt-2 text-xs font-bold justify-center text-[#073B4C]">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#073B4C]" style={{ backgroundColor: '#06D6A0' }} />
              <span>Hadir ({stats.totalCheckedIn})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#073B4C]" style={{ backgroundColor: '#EF476F' }} />
              <span>Belum ({belumCheckIn})</span>
            </div>
          </div>
        </div>

        {/* Statistic Cards Column (right on desktop) */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4 w-full">
          
          {/* Card 1: Total Registered and Paid */}
          <div className="bg-[#FFD166] p-4 rounded-3xl border-4 border-[#073B4C] shadow-[4px_4px_0px_0px_#073B4C] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/40 p-2.5 rounded-2xl border-2 border-[#073B4C]/25 text-[#073B4C]">
                <Users size={24} strokeWidth={2.5} />
              </div>
              <div className="text-[#073B4C]">
                <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest opacity-85 leading-tight">Terdaftar & Lunas</p>
                <p className="text-xs font-bold opacity-65 leading-tight">Total Undangan</p>
              </div>
            </div>
            <div className="text-right text-[#073B4C]">
              <span className="text-3xl md:text-4xl font-black tracking-tighter italic">{stats.totalRegisteredAndPaid}</span>
              <span className="text-xs font-bold ml-1">Sobat</span>
            </div>
          </div>

          {/* Card 2: Already Checked-In */}
          <div className="bg-[#06D6A0] p-4 rounded-3xl border-4 border-[#073B4C] shadow-[4px_4px_0px_0px_#073B4C] flex items-center justify-between gap-4 text-[#073B4C]">
            <div className="flex items-center gap-3">
              <div className="bg-white/40 p-2.5 rounded-2xl border-2 border-[#073B4C]/25 text-[#073B4C]">
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </div>
              <div className="text-[#073B4C]">
                <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest opacity-90 leading-tight">Hadir di Lokasi</p>
                <p className="text-xs font-bold opacity-70 leading-tight">Sudah Check-In</p>
              </div>
            </div>
            <div className="text-right text-[#073B4C]">
              <span className="text-3xl md:text-4xl font-black tracking-tighter italic">{stats.totalCheckedIn}</span>
              <span className="text-xs font-bold ml-1">Sobat</span>
            </div>
          </div>

          {/* Card 3: Pending Check-In */}
          <div className="bg-[#EF476F] p-4 rounded-3xl border-4 border-[#073B4C] shadow-[4px_4px_0px_0px_#073B4C] flex items-center justify-between gap-4 text-[#073B4C]">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-2xl border-2 border-[#073B4C]/25 text-white">
                <AlertCircle size={24} strokeWidth={2.5} />
              </div>
              <div className="text-white">
                <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest opacity-95 leading-tight">Menunggu Kedatangan</p>
                <p className="text-xs font-bold opacity-80 leading-tight text-white/90">Belum Check-In</p>
              </div>
            </div>
            <div className="text-right text-white">
              <span className="text-3xl md:text-4xl font-black tracking-tighter italic">{belumCheckIn}</span>
              <span className="text-xs font-bold ml-1">Sobat</span>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
