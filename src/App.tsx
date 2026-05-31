import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Phone, GraduationCap, ChevronLeft, ChevronRight, LogOut, Ticket, User, MapPin, Calendar, Car, Train, Bike, Plane, Shirt, RectangleVertical, Heart, Quote, MessageSquare } from 'lucide-react';
import AlumniStats from './components/AlumniStats';
import FeedbackPage from './components/FeedbackPage';

interface UserData {
  id: string;
  name: string;
  nickname: string;
  phone: string;
  className: string;
  check_in?: boolean;
  check_in_timestamp?: string;
  check_in_sequence?: number;
}

const EVENT_DATE_FALLBACK = "2026-06-06T13:00:00+07:00";

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft(null);
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="sticky top-4 md:top-6 z-[60] w-full flex justify-center pointer-events-none mb-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#073B4C] text-[#FFD166] px-4 py-2 md:px-6 md:py-3 rounded-2xl border-4 border-[#073B4C] shadow-[4px_4px_0_0_#EF476F] flex items-center justify-center gap-2 md:gap-4 pointer-events-auto"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm md:text-xl font-black leading-none">{timeLeft.days}</span>
          <span className="text-[6px] md:text-[8px] font-black uppercase tracking-widest opacity-50">Hari</span>
        </div>
        <div className="text-sm md:text-xl font-black opacity-30">:</div>
        <div className="flex flex-col items-center">
          <span className="text-sm md:text-xl font-black leading-none">{timeLeft.hours}</span>
          <span className="text-[6px] md:text-[8px] font-black uppercase tracking-widest opacity-50">Jam</span>
        </div>
        <div className="text-sm md:text-xl font-black opacity-30">:</div>
        <div className="flex flex-col items-center">
          <span className="text-sm md:text-xl font-black leading-none">{timeLeft.minutes}</span>
          <span className="text-[6px] md:text-[8px] font-black uppercase tracking-widest opacity-50">Menit</span>
        </div>
        <div className="text-sm md:text-xl font-black opacity-30">:</div>
        <div className="flex flex-col items-center">
          <span className="text-sm md:text-xl font-black leading-none">{timeLeft.seconds}</span>
          <span className="text-[6px] md:text-[8px] font-black uppercase tracking-widest opacity-50">Detik</span>
        </div>
        <div className="text-sm md:text-xl font-black opacity-30">:</div>
        <div className="flex flex-col items-center">
          <span className="text-sm md:text-xl font-black leading-none italic">...menuju hari H!</span>
          <span className="text-[6px] md:text-[8px] font-black uppercase tracking-widest opacity-50">Reuni</span>
        </div>
      </motion.div>
    </div>
  );
}

const TEACHERS_MESSAGES = [
  {
    "text": "Terimakasih atas undangannya",
    "author": "ibu Lidya widaningsih"
  },
  {
    "text": "Semoga selalu sukses",
    "author": "ibu Dra Cut Yulia"
  },
  {
    "text": "Jagalah kebersamaan,rajin\"beribadah sesuai agamanya masing\"..",
    "author": "bapak H.Drs.Gantang tri.p.MM"
  },
  {
    "text": "Jauh dikenang dekat di sayang. Sembilan. Ockey",
    "author": "bapak Sasmitho"
  },
  {
    "text": "Usah kau takut pd kerasnya dunia....Sukses selalu anak2ku.",
    "author": "ibu Dra. Sri Endah Kusumaningrum "
  },
  {
    "text": "Angkatan 2001 slalu di hati ♥️♥️",
    "author": "ibu Dianti Endah"
  },
  {
    "text": "Terima kasih atas perhatian buat kami, guru SMAN 90 Jakarta. Semoga Ananda semakin sukses dalam karier/ usaha dan pelayanan .",
    "author": "ibu Berkah Hartati, Dra."
  },
  {
    "text": "Jadilah pribadi-pribadi yang selalu menebar kebaikan untuk orang lain, sukses dan kompak selalu untuk angkatan 2001",
    "author": "bapak Sarino, S.Kom"
  },
  {
    "text": "Terimakasih untuk undangan reuninya. Semoga kita sehat semua biar bisa ketemuan di reuni perak",
    "author": "ibu Dra. Hj. Sri Wahyuni"
  },
  {
    "text": "Orang.sukses itu selalu menyayangi orang tua dan guru2nya.",
    "author": "ibu Dra Hj. Hildayati"
  },
  {
    "text": "Ibu bangga dgn keberhasilan anak ku dan masih ingat sama guru guru yg mengajar sukses terus ",
    "author": "ibu MULYANIS ROSMA"
  },
  {
    "text": "Salah satu amalan terbaik adalah menjalin silaturahim dan apresiasi yg tinggi buat alumni 2001 ini yg masih mengingat dan menjalin silaturahmi pada guru2 yg mengajar lbh seperempat abad yg lalu... smoga mendapat keberkahan Allah SWT... Aamiin",
    "author": "ibu Dra.Hj.Erna Kadhy Iriany"
  },
  {
    "text": "Terus berjuang untuk menjadi lebih baik",
    "author": "bapak Sentot sumitro"
  },
  {
    "text": "Life is like a book, having pages to write, having story to tell, and experience to learn. ",
    "author": "ibu Maria Ulfah S.Pd., M M"
  },
  {
    "text": "Saya bangga pernah menjadi guru kalian ,melihat kalian tumbuh ,berkembang menjadi pribadi yang baik,unggul,mandiri, sukses dan bermanfaat buat masyarakat dan bangsanya",
    "author": "ibu Dewi Setiariani ,Dra Hj"
  },
  {
    "text": "Semangat dan bersyukur",
    "author": "ibu Nunung Nuryanah"
  },
  {
    "text": "Selamat ya kalian sdh pada berhasil dan sukses selalu",
    "author": "ibu Dra Nurdiana.S"
  },
  {
    "text": "Im proud of you all",
    "author": "ibu Desliza Wahab, S.Pd."
  },
  {
    "text": "Alhamdulillaah, luar biasa kalian meskipun sudah sukses masih ingat dengan kami.",
    "author": "ibu Evi Yumeri "
  },
  {
    "text": "Anak-anak SMAN 90 baik-baik, pintar-pintar, dan selalu santun",
    "author": "ibu Dra. Roliah Rolin"
  },
  {
    "text": "Semoga acara ini membawa berkah...kebahagiaan , silaturohmi yg erat...dan rejeki panitia alumni meningkat",
    "author": "ibu FARIDA ETIK RATNAWATI S.Pd.,M.Si."
  },
  {
    "text": "Semoga semua siswa SMA negeri 90,tercapai semua cita cita membanggakan keluarga dan mengharumkan nama bangsa di kemudian hari",
    "author": "bapak Drs.Taufik "
  },
  {
    "text": "Hiasi dirimu dengan ilmu dan hiasi persaudaraan dan persahabat dengan kesetiaanan",
    "author": "ibu Endang Rudiana, S.Pd"
  },
  {
    "text": "Alhamdulilah anak2 ibu sdh pada sukses",
    "author": "ibu Dra Nurdiana.S"
  },
  {
    "text": "Kalian semua diberkati Tuhan memperoleh sukses dalam kehidupan berguna untuk nusa dan bangsa ",
    "author": "bapak Drs. Robert Lumban Gaol M.M."
  },
  {
    "text": "Tetap Istiqomah menghadapi dunia yg amburadul",
    "author": "bapak SUGIYANTO "
  },
  {
    "text": "Baik , kreatif dan semangat untuk mencapai tujuan ",
    "author": "bapak Drs KM Tambunan "
  },
  {
    "text": "Semoga anak anakku sukses semua, aamiin ",
    "author": "bapak Marjuki Miad"
  },
  {
    "text": "Selamat berkumpul kembali. Waktu mungkin mengubah segalanya, tetapi kenangan dan nilai-nilai yang kita bangun bersama di sekolah akan selalu melekat. Kesuksesan kalian hari ini adalah kebahagiaan terbesar kami.",
    "author": "ibu SITI MARDIYAH,S.Pd.Fis"
  },
  {
    "text": "Semoga terus bslajar unfuk kemajuan bangsa dan negara.",
    "author": "ibu Emmu"
  }
];

export default function App() {
  const [phone, setPhone] = useState('');
  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState<string[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingClasses, setFetchingClasses] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messagesPage, setMessagesPage] = useState(1);

  const [eventDate, setEventDate] = useState(EVENT_DATE_FALLBACK);
  const [showStats, setShowStats] = useState<boolean>(true);
  const [stats, setStats] = useState<{ totalRegisteredAndPaid: number; totalCheckedIn: number; percentCheckedIn: number } | null>(null);

  const [showFeedbackConfig, setShowFeedbackConfig] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'main' | 'feedback'>('main');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Fetch configs and classes on mount
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        if (data.EVENT_DATE) {
          setEventDate(data.EVENT_DATE);
        }
        if (data.SHOW_ALUMNI_STATS !== undefined) {
          setShowStats(data.SHOW_ALUMNI_STATS === "true" || data.SHOW_ALUMNI_STATS === "1");
        } else {
          setShowStats(true);
        }
        if (data.SHOW_FEEDBACK !== undefined) {
          setShowFeedbackConfig(data.SHOW_FEEDBACK === "true" || data.SHOW_FEEDBACK === "1");
        } else {
          setShowFeedbackConfig(true);
        }
      } catch (err) {
        console.error("Failed to fetch configs", err);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/classes');
        const data = await response.json();
        if (Array.isArray(data)) {
          setClasses(data);
          if (data.length > 0 && !className) {
            setClassName(data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch classes", err);
      } finally {
        setFetchingClasses(false);
      }
    };

    fetchConfigs();
    fetchClasses();
  }, []);

  // Polling for check-in status
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (user && !user.check_in) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/status/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            if (data.check_in) {
              const updatedUser = { ...user, ...data };
              setUser(updatedUser);
              localStorage.setItem('reunion_user', JSON.stringify(updatedUser));
            }
          }
        } catch (err) {
          console.error("Failed to poll status", err);
        }
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);

  // Polling for alumni check-in stats
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    if (user && showStats) {
      fetchStats();
      // Poll stats every 10 seconds to keep it real-time
      interval = setInterval(fetchStats, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user, showStats]);

  useEffect(() => {
    const savedUser = localStorage.getItem('reunion_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('reunion_user');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, className }),
      });

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON/Error response received:", text);
        throw new Error(`Server returned unexpected response (${response.status})`);
      }

      if (response.ok) {
        setUser(data);
        localStorage.setItem('reunion_user', JSON.stringify(data));
      } else {
        console.error("Login failed response:", data);
        setError(data.error || 'Waduh, ada kesalahan sistem nih. Coba lagi ya sob!');
      }
    } catch (err) {
      console.error("Login network/unexpected error:", err);
      setError('Maaf, gagal nyambung ke server. Coba lagi ya sob!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('reunion_user');
    setPhone('');
    setActiveView('main');
  };

  const handleFeedbackClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      setIsFeedbackModalOpen(true);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!feedbackInput.trim()) return;

    if (feedbackInput.trim().length > 500) {
      setFeedbackError("Kepanajangan sob, maksimal 500 karakter ya!");
      return;
    }

    try {
      setSubmittingFeedback(true);
      setFeedbackError(null);
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: user.id,
          feedback: feedbackInput.trim()
        })
      });

      if (response.ok) {
        setIsFeedbackModalOpen(false);
        setFeedbackInput('');
        setActiveView('feedback');
      } else {
        const data = await response.json();
        setFeedbackError(data.error || "Gagal mengirimkan feedback. Coba lagi ya, sob!");
      }
    } catch (err) {
      console.error("Feedback submit error", err);
      setFeedbackError("Koneksi gagal. Coba lagi nanti ya, sob!");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Generate QR Code Link
  const qrValue = user 
    ? `https://silver-reunion-90-qr-attendance-258479971315.asia-southeast1.run.app/?id=${user.id}`
    : '';

  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Silver Reunion 90 SMAN 90 Jakarta')}&details=${encodeURIComponent('Jangan lupa sob reuni silver SMAN 90 di Milestone Cafe, Bintaro!')}&location=${encodeURIComponent('Milestone Cafe Bintaro')}&dates=20260606T060000Z/20260606T090000Z`;

  const openGoogleCalendar = () => {
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FFD166] text-[#073B4C] font-sans antialiased p-4 md:p-10 flex flex-col items-center justify-center relative">
      
      {/* Draggable Logout Button (Top Right Default) */}
      <AnimatePresence>
        {user && (
          <motion.button 
            drag
            dragMomentum={false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
            whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 1000 }}
            initial={{ opacity: 0, x: 20, scale: 0.5 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.5 }}
            onClick={handleLogout}
            className="fixed top-6 right-6 md:top-10 md:right-10 z-[100] bg-[#EF476F] text-white p-4 rounded-2xl border-4 border-[#073B4C] shadow-[4px_4px_0_0_#073B4C] active:translate-y-1 active:shadow-none transition-all hover:bg-[#d43f62] flex items-center gap-2 font-black uppercase text-xs tracking-widest cursor-grab touch-none"
          >
            <LogOut size={18} strokeWidth={3} /> <span className="hidden md:inline">Keluar</span>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl space-y-10">
        
        {/* Header Section */}
        {user && <CountdownTimer targetDate={eventDate} />}
        <header className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 md:w-40 md:h-40 shrink-0"
            >
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-[#073B4C] overflow-hidden shadow-2xl relative">
                <img 
                  src="/logo.png" 
                  alt="Silver Reunion 90 Logo" 
                  className="w-full h-full object-contain p-2 relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const icon = document.createElement('div');
                    icon.className = "w-full h-full bg-[#EF476F] flex items-center justify-center";
                    icon.innerHTML = '<svg viewBox="0 0 24 24" width="60" height="60" stroke="currentColor" stroke-width="2" fill="none" class="text-white"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>';
                    e.currentTarget.parentElement?.appendChild(icon);
                  }}
                />
              </div>
            </motion.div>
            <div>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-[#EF476F]"
              >
                Silver<br/>Reunion '90
              </motion.h1>
              <p className="mt-4 text-sm md:text-lg font-bold bg-[#073B4C] text-white px-4 py-1.5 inline-block rounded-full shadow-[4px_4px_0px_0px_#EF476F]">
                25 Tahun Persahabatan & Kenangan
              </p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xl lg:text-2xl font-black uppercase text-[#073B4C] whitespace-nowrap">6 Juni 2026 <span className="text-xs md:text-sm opacity-60">13.00 WIB</span></p>
            <p className="text-lg font-medium opacity-80 italic">Milestone Cafe Bintaro</p>
          </div>
        </header>

        {activeView === 'feedback' && user ? (
          <FeedbackPage user={user} onBack={() => setActiveView('main')} />
        ) : (
          <>
            <main className="flex flex-col gap-8">
              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            <AnimatePresence mode="wait">
              {!user ? (
                <motion.div
                  key="login-box"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full lg:w-1/2 bg-white rounded-[40px] p-8 md:p-10 border-4 border-[#073B4C] shadow-[12px_12px_0px_0px_#073B4C] flex flex-col relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFD166] opacity-10 rounded-full" />
                  
                  <h2 className="text-4xl font-black mb-8 uppercase italic tracking-tighter text-[#EF476F]">Halo Sobat Alumni!</h2>
                  <p className="mb-8 text-sm font-bold text-[#073B4C]/60 leading-relaxed text-balance">Yuk, masukin data kamu buat absen kehadiran reuni perak kita nanti!</p>
                  
                  <form onSubmit={handleLogin} className="space-y-6 flex-1 flex flex-col">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">Nomor WhatsApp</label>
                      <div className="relative">
                        <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#073B4C]/30" />
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Contoh: 0812..."
                          required
                          className="w-full border-4 border-[#073B4C] rounded-2xl p-4 pl-12 font-bold text-xl focus:outline-none focus:bg-[#EF476F]/5 transition-colors placeholder:text-stone-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">Pilih Kelas</label>
                      <div className="relative">
                        <GraduationCap size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#073B4C]/30 z-10" />
                        <select
                          value={className}
                          onChange={(e) => setClassName(e.target.value)}
                          disabled={fetchingClasses}
                          className="w-full border-4 border-[#073B4C] rounded-2xl p-4 pl-12 font-bold text-xl focus:outline-none focus:bg-[#EF476F]/5 transition-colors bg-white appearance-none cursor-pointer pr-12"
                        >
                          {fetchingClasses ? (
                            <option>Memuat data kelas...</option>
                          ) : (
                            <>
                              <option value="" disabled>Pilih Kelas</option>
                              {classes.map((cls) => (
                                <option key={cls} value={cls}>{cls}</option>
                              ))}
                            </>
                          )}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#073B4C]">
                          <ChevronRight size={24} className="rotate-90" strokeWidth={3} />
                        </div>
                      </div>
                    </div>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-5 bg-red-50 border-4 border-[#EF476F] rounded-2xl flex items-start gap-3 mt-2 shadow-[4px_4px_0_0_#EF476F]"
                      >
                        <div className="w-6 h-6 bg-[#EF476F] rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                          <span className="text-white font-black text-sm">!</span>
                        </div>
                        <p className="text-sm font-black text-[#073B4C] leading-tight">
                          {error}
                        </p>
                      </motion.div>
                    )}

                    <button 
                      disabled={loading || fetchingClasses}
                      className="mt-8 w-full bg-[#06D6A0] hover:bg-[#05b88a] text-[#073B4C] font-black text-2xl py-6 rounded-3xl border-4 border-[#073B4C] shadow-[0_8px_0_0_#073B4C] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-8 h-8 border-4 border-[#073B4C]/20 border-t-[#073B4C] rounded-full animate-spin" />
                      ) : (
                        <>LIHAT TIKET <ChevronRight size={28} strokeWidth={3} /></>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="invite-box"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full bg-[#118AB2] rounded-[40px] p-2 border-4 border-[#073B4C] shadow-[12px_12px_0px_0px_#EF476F] flex flex-col md:flex-row overflow-hidden shadow-[12px_12px_0px_0px_#073B4C]"
                >
                  {/* Left Side: Text Details */}
                  <div className="flex-1 bg-[#073B4C] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                        <p className="bg-[#06D6A0] text-[#073B4C] font-black tracking-widest uppercase text-xs px-3 py-1 rounded-full inline-block italic shadow-[4px_4px_0_0_#118AB2]">
                          Absensi Terverifikasi
                        </p>
                      </div>
                      
                      <p className="text-[#FFD166] text-sm font-black uppercase tracking-widest mb-2">Senang Melihatmu, Sob!</p>
                      <div className="mb-4">
                        <h3 className="text-5xl md:text-7xl font-black leading-none uppercase italic tracking-tighter">
                          {user.nickname}
                        </h3>
                        <p className="text-sm font-bold text-white/60 mt-1 uppercase tracking-wider">
                          ({user.name})
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-[#FFD166] uppercase tracking-wide">
                        Alumni SMAN 90 — Kelas {user.className}
                      </p>
                    </div>

                    <div className="pt-8 border-t border-white/20 relative z-10 mt-10">
                      <p className="text-[10px] opacity-50 uppercase tracking-[0.3em] mb-2 font-black">Link Absensi Digital Kamu</p>
                      <div className="bg-[#118AB2]/20 p-4 rounded-xl border-2 border-white/10">
                        <p className="text-[10px] font-mono break-all text-[#06D6A0] leading-relaxed">
                          {qrValue}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: QR Code & Calendar */}
                  <div className="w-full md:w-96 bg-white p-10 flex flex-col items-center justify-center text-center gap-6 relative">
                    <AnimatePresence mode="wait">
                      {user.check_in ? (
                        <motion.div 
                          key="checkin-success"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-full aspect-square border-4 border-[#06D6A0] rounded-[2.5rem] p-6 shadow-[8px_8px_0_0_#06D6A0] bg-white flex flex-col items-center justify-center relative overflow-hidden"
                        >
                          <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#06D6A0] text-white p-4 rounded-full mb-4 shadow-lg"
                          >
                            <Ticket size={48} strokeWidth={3} />
                          </motion.div>
                          <h4 className="text-xl font-black text-[#073B4C] uppercase italic tracking-tighter leading-tight">Berhasil<br/>Check-In!</h4>
                          <div className="mt-4 p-3 bg-[#06D6A0]/10 border-2 border-[#06D6A0] rounded-xl w-full">
                            <p className="text-[10px] font-black uppercase text-[#073B4C] mb-1">Nomor Urut Kamu</p>
                            <p className="text-3xl font-black text-[#073B4C]">{user.check_in_sequence || '-'}</p>
                          </div>
                          <p className="mt-4 text-[9px] font-bold text-[#073B4C]/50 leading-relaxed">
                            Sudah check in pada:<br/>
                            <span className="text-[#073B4C]">{user.check_in_timestamp || '-'}</span>
                          </p>
                          
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-10 -right-10 w-24 h-24 bg-[#06D6A0]/10 rounded-full"
                          />
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="qr-code"
                          initial={{ rotate: -5, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ delay: 0.3 }}
                          className="w-full aspect-square border-4 border-[#073B4C] rounded-[2.5rem] p-6 shadow-[8px_8px_0_0_#073B4C] bg-white flex items-center justify-center relative group"
                        >
                          <QRCodeSVG 
                            value={qrValue} 
                            size={200}
                            level="H"
                            includeMargin={false}
                            fgColor="#073B4C"
                            className="w-full h-auto"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="space-y-4">
                      {!user.check_in && (
                        <div className="space-y-1">
                          <p className="text-xs font-black uppercase text-[#073B4C] tracking-[0.3em]">Scan Saat Masuk</p>
                          <p className="text-[10px] font-bold text-[#073B4C] opacity-30 italic">Tunjukkan pada meja registrasi</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                        <button 
                          onClick={openGoogleCalendar}
                          className="flex items-center justify-center gap-3 w-full sm:w-auto bg-[#EF476F] text-white font-black py-4 px-6 rounded-2xl border-4 border-[#073B4C] shadow-[4px_4px_0_0_#073B4C] hover:scale-105 active:translate-y-1 active:shadow-none transition-all text-[10px] uppercase tracking-widest italic"
                        >
                          <Calendar size={18} strokeWidth={3} /> Simpan Kalender
                        </button>
                        {showFeedbackConfig && (
                          <button 
                            onClick={() => setActiveView('feedback')}
                            className="flex items-center justify-center gap-3 w-full sm:w-auto bg-[#06D6A0] text-[#073B4C] font-black py-4 px-6 rounded-2xl border-4 border-[#073B4C] shadow-[4px_4px_0_0_#073B4C] hover:scale-105 active:translate-y-1 active:shadow-none transition-all text-[10px] uppercase tracking-widest italic"
                          >
                            <MessageSquare size={18} strokeWidth={3} /> Kesan Pesan
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="w-full h-2 flex gap-1">
                      {Array.from({length: 12}).map((_, i) => (
                        <div key={i} className={`flex-1 h-full rounded-full ${i % 2 === 0 ? 'bg-[#EF476F]' : 'bg-[#06D6A0]'}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right sidebar info on desktop (only on login) */}
            {!user && (
              <div className="hidden lg:flex w-1/3 flex-col gap-6">
                <div className="bg-[#118AB2] border-4 border-[#073B4C] p-8 rounded-[40px] shadow-[12px_12px_0_0_#06D6A0] text-white space-y-4">
                  <Ticket className="w-12 h-12 text-[#FFD166]" strokeWidth={3} />
                  <h3 className="text-3xl font-black italic uppercase leading-none">The 90's Vibe is Back!</h3>
                  <p className="text-sm font-bold opacity-80 leading-relaxed italic">
                    "Menyambung Silaturahmi, Mengulang Memori di Silver Reunion 90"
                  </p>
                </div>
                <div className="bg-[#073B4C] border-4 border-[#073B4C] p-8 rounded-[40px] shadow-[12px_12px_0_0_#EF476F] text-[#FFD166] flex-1 flex flex-col justify-center">
                  <p className="text-xs font-black uppercase tracking-widest text-[#EF476F] mb-6 font-black italic">Info Lokasi</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="shrink-0 text-[#EF476F]" />
                      <p className="text-sm font-bold">Milestone Cafe Bintaro</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="shrink-0 text-[#EF476F]" />
                      <p className="text-sm font-bold whitespace-nowrap">6 Juni 2026 <span className="text-[9px] opacity-60">13.00 WIB</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Statistics Section (Only shown once user logged in) */}
          {user && showStats && stats && (
            <AlumniStats stats={stats} />
          )}

          {/* New Event Details Section (Visible after login or separate) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Directions Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[40px] p-8 md:p-10 border-4 border-[#073B4C] shadow-[12px_12px_0px_0px_#118AB2]"
            >
              <h3 className="text-2xl font-black mb-8 uppercase italic flex items-center gap-3">
                <MapPin className="text-[#EF476F]" strokeWidth={3} /> Cara Menuju Lokasi
              </h3>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-[#EF476F]/10 rounded-2xl flex items-center justify-center shrink-0 border-2 border-[#EF476F]">
                    <Car size={24} className="text-[#EF476F]" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-widest mb-1">Mobil</h4>
                    <p className="text-xs font-bold leading-relaxed opacity-70">
                      Keluar di gerbang Pondok Aren, lurus terus sampai lampu merah hotel Aviary, belok kiri lalu belok kanan, ikuti jalan, lokasi di sebelah kanan.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-[#06D6A0]/10 rounded-2xl flex items-center justify-center shrink-0 border-2 border-[#06D6A0]">
                    <Train size={24} className="text-[#06D6A0]" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-widest mb-1">KRL</h4>
                    <p className="text-xs font-bold leading-relaxed opacity-70">
                      Turun stasiun <span className="underline decoration-2 underline-offset-2">Jurang Manggu</span>, lewat tunnel menuju BXC pesan Grab dari lobby, atau naik Grab dari depan stasiun. Atau turun stasiun <span className="underline decoration-2 underline-offset-2">Sudimara</span> exit pintu utara, lanjut Grab/Gojek dari ke venue.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-[#FFD166]/20 rounded-2xl flex items-center justify-center shrink-0 border-2 border-[#FFD166]">
                    <Bike size={24} className="text-[#073B4C]" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-widest mb-1">Motor</h4>
                    <p className="text-xs font-bold leading-relaxed opacity-70">
                      Dari rumah masing-masing langsung gas aja lurus ke lokasi sob! :)
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-[#118AB2]/10 rounded-2xl flex items-center justify-center shrink-0 border-2 border-[#118AB2]">
                    <Plane size={24} className="text-[#118AB2]" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-widest mb-1">Pesawat Terbang</h4>
                    <p className="text-xs font-bold leading-relaxed opacity-70">
                      Booking tiket ke Soekarno-Hatta lewat tiket.com/Traveloka. Landing, lanjut Grab/Go-car santuy ke Milestone. Jangan lupa saldo e-money ya sob!
                    </p>
                  </div>
                </div>
              </div>

              {/* Footnote */}
              <div className="mt-6 pt-6 border-t-4 border-[#073B4C] border-dashed text-xs md:text-sm font-black text-[#073B4C] flex items-start gap-3 bg-[#FFD166]/10 p-4 rounded-2xl border-2 border-[#073B4C]">
                <div className="bg-[#EF476F] text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-md">
                  i
                </div>
                <p className="leading-relaxed opacity-90">
                  Panitia menghimbau teman-teman menggunakan transum atau roda dua untuk mengurangi keribetan parkir :)
                </p>
              </div>
            </motion.div>

            {/* Map Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#073B4C] rounded-[40px] p-2 border-4 border-[#073B4C] shadow-[12px_12px_0px_0px_#FFD166] flex flex-col overflow-hidden min-h-[400px]"
            >
              <div className="p-6 text-white">
                 <h3 className="text-xl font-black uppercase italic flex items-center gap-2">
                  <MapPin className="text-[#06D6A0]" /> Milestone Cafe Bintaro
                </h3>
              </div>
              <div className="flex-1 bg-white relative">
                 {/* Simple Iframe Embed based on common pattern if possible, or link */}
                 <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.918!2d106.712!3d-6.279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fa8946766d03%3A0xc6c4f03673ab1947!2sMilestone%20Cafe%20%26%20Creative%20Space!5e0!3m2!1sen!2sid!4v1715738000000!5m2!1sen!2sid" 
                  className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="absolute bottom-4 right-4">
                   <a 
                    href="https://share.google/E9xALeH3GCWB7iqOs" 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-[#EF476F] text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-110 active:scale-95 transition-all border-2 border-[#073B4C]"
                  >
                    Buka Di Maps
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

        </main>

        {/* Dress Code Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[40px] p-8 md:p-10 border-4 border-[#073B4C] shadow-[12px_12px_0px_0px_#EF476F] text-[#073B4C] hover:shadow-[16px_16px_0px_0px_#EF476F] transition-all"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="shrink-0 flex items-center justify-center gap-4">
              <div className="w-24 h-24 bg-[#073B4C] rounded-[2.5rem] flex items-center justify-center rotate-3 border-4 border-[#EF476F] shadow-xl">
                 <Shirt size={48} className="text-[#FFD166]" strokeWidth={3} />
              </div>
              <div className="w-24 h-24 bg-[#EF476F] rounded-[2.5rem] flex items-center justify-center -rotate-3 border-4 border-[#073B4C] shadow-xl">
                 <User size={48} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6 text-[#073B4C]">Dress Code</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="group flex items-center gap-4 bg-[#FFD166]/10 p-4 rounded-2xl border-4 border-[#073B4C] hover:bg-[#FFD166]/30 transition-all">
                  <div className="bg-[#EF476F] p-3 rounded-xl text-white group-hover:scale-110 transition-transform">
                    <Shirt size={24} strokeWidth={3} />
                  </div>
                  <span className="text-lg font-black uppercase tracking-tight">Atasan Putih</span>
                </li>
                <li className="group flex items-center gap-4 bg-[#118AB2]/10 p-4 rounded-2xl border-4 border-[#073B4C] hover:bg-[#118AB2]/30 transition-all">
                  <div className="bg-[#118AB2] p-3 rounded-xl text-2xl group-hover:scale-110 transition-transform flex items-center justify-center">
                    👖
                  </div>
                  <span className="text-lg font-black uppercase tracking-tight">Bawahan Jeans</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Susunan Acara Section */}
        {user && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#118AB2] rounded-[40px] p-8 md:p-10 border-4 border-[#073B4C] shadow-[12px_12px_0px_0px_#06D6A0] text-white hover:shadow-[16px_16px_0px_0px_#06D6A0] transition-all relative overflow-hidden"
          >
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <Calendar size={200} fill="currentColor" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="bg-[#FFD166] p-4 rounded-2xl shadow-lg rotate-[-3deg] border-4 border-[#073B4C]">
                  <Calendar size={40} className="text-[#073B4C]" fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-white">Susunan Acara</h3>
                  <p className="text-[#FFD166] font-bold text-sm md:text-lg uppercase tracking-widest mt-1">Agenda Run-down Selengkapnya</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border-4 border-[#073B4C] overflow-hidden text-[#073B4C] shadow-[8px_8px_0px_0px_#073B4C]">
              <div className="divide-y-4 divide-[#073B4C]">
                {[
                  { time: "12.30 - 13.45", title: "Registrasi", desc: "Datang lebih awal buat ambil merchandise seru dan photo booth bareng sob!", icon: "📝", color: "#FFD166" },
                  { time: "14.00 - 14.10", title: "Pembukaan", desc: "Pembukaan resmi acara reuni perak oleh MC kece badai", icon: "📢", color: "#EF476F" },
                  { time: "14.10 - 14.20", title: "Pemutaran Video Sekolah & Foto Guru", desc: "Nostalgia suasana SMAN 90 Jakarta jadul dan kenangan manis guru-guru tercinta", icon: "📹", color: "#118AB2" },
                  { time: "14.20 - 14.35", title: "Sambutan Perwakilan Guru", desc: "Mendengar kembali nasihat hangat dan petuah bijak dari bapak/ibu guru kita", icon: "👨‍🏫", color: "#06D6A0" },
                  { time: "14.35 - 14.45", title: "Simbolis Cindera Mata & Foto Bersama", desc: "Penyerahan tanda kasih alumni 2001 kepada guru-guru yang berjasa", icon: "🎁", color: "#EF476F" },
                  { time: "14.45 - 14.55", title: "Pemutaran Video Kolase Angkatan 2001", desc: "Flashback masa-masa indah putih abu-abu, kumpul bersama kawan lama", icon: "🎬", color: "#FFD166" },
                  { time: "14.55 - 15.05", title: "Sambutan Ketua Panitia & Foto Bersama", desc: "Sepatah dua patah kata terima kasih dari ketua panitia reuni", icon: "🎤", color: "#118AB2" },
                  { time: "15.05 - 15.10", title: "Menyanyi Bersama Lagu Jaman Putih-Abu2", desc: "Sing along bareng lagu-lagu ngetren tahun 2000-an penanda masa sekolah", icon: "🎵", color: "#06D6A0" },
                  { time: "15.10 - 15.30", title: "Coffee Break & Ishoma", desc: "Santai sejenak, ibadah sholat, nikmati camilan dan kopi hangat", icon: "☕", color: "#FFD166" },
                  { time: "15.30 - 17.00", title: "Acara Inti", desc: "Kuis seru, games angkatan, pembagian doorprize, dan temu kangen bebas", icon: "🎉", color: "#EF476F" },
                  { time: "17.00 - 17.10", title: "Pembagian Cinderamata Guru & Penutupan", desc: "Sesi penutup, doa bersama, pembagian bingkisan, dan salam-salaman hangat", icon: "✨", color: "#06D6A0" }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 transition-all hover:bg-slate-50 relative group cursor-default"
                  >
                    {/* Left side: Time badge */}
                    <div className="shrink-0 flex items-center md:w-48">
                      <div className="bg-[#073B4C] text-white px-4 py-2 rounded-2xl font-black text-sm md:text-sm border-4 border-[#073B4C] shadow-[4px_4px_0px_0px_#FFD166] group-hover:shadow-[4px_4px_0px_0px_#EF476F] transition-all whitespace-nowrap uppercase italic tracking-wider">
                        {item.time}
                      </div>
                    </div>

                    {/* Middle: Icon badge with solid neobrutalist outline */}
                    <div className="shrink-0 hidden md:flex items-center justify-center w-14 h-14 rounded-2xl border-4 border-[#073B4C] shadow-[3px_3px_0px_0px_#073B4C] text-2xl" style={{ backgroundColor: item.color }}>
                      {item.icon}
                    </div>

                    {/* Right side: Title & Description */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="md:hidden text-lg">{item.icon}</span>
                        <h4 className="text-lg md:text-xl font-black uppercase italic tracking-tight">{item.title}</h4>
                      </div>
                      <p className="text-xs md:text-sm font-bold opacity-75 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        )}

        {/* Teachers' Messages Section - Visible after login */}
        {user && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#EF476F] rounded-[40px] p-8 md:p-12 border-4 border-[#073B4C] shadow-[12px_12px_0px_0px_#073B4C] text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
              <Heart size={200} fill="currentColor" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-[#FFD166] p-4 rounded-2xl shadow-lg rotate-[-3deg] border-4 border-[#073B4C]">
                  <Quote size={40} className="text-[#073B4C]" fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">Pesan & Kesan</h3>
                  <p className="text-[#FFD166] font-bold text-sm md:text-lg uppercase tracking-widest mt-1">Dari Bapak/Ibu Guru Kita</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {TEACHERS_MESSAGES.slice((messagesPage - 1) * 6, messagesPage * 6).map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.01, rotate: idx % 2 === 0 ? 0.3 : -0.3 }}
                    className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-3xl border-2 border-white/20 flex flex-col justify-between hover:bg-white/20 transition-all cursor-default"
                  >
                    <p className="text-base md:text-xl font-bold leading-relaxed mb-4 italic">
                      "{item.text}"
                    </p>
                    <div className="flex items-center gap-2 mt-auto">
                      <Heart size={16} className="text-[#FFD166]" fill="currentColor" />
                      <span className="text-xs md:text-sm font-black uppercase tracking-widest opacity-80">{item.author}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination Controls on Right Bottom Corner */}
              <div className="flex justify-end items-center gap-4 mt-8 flex-wrap">
                <span className="text-xs font-black uppercase tracking-widest opacity-75">
                  Halaman {messagesPage} dari {Math.max(6, Math.ceil(TEACHERS_MESSAGES.length / 6))}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMessagesPage(prev => Math.max(1, prev - 1))}
                    disabled={messagesPage === 1}
                    className={`bg-[#FFD166] text-[#073B4C] p-3 rounded-xl border-4 border-[#073B4C] shadow-[2px_2px_0_0_#073B4C] active:translate-y-0.5 active:shadow-none transition-all ${
                      messagesPage === 1 ? 'opacity-40 cursor-not-allowed shadow-none translate-y-0.5' : 'cursor-pointer hover:bg-[#ffe199]'
                    }`}
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft size={16} strokeWidth={4} />
                  </button>
                  <button
                    onClick={() => setMessagesPage(prev => Math.min(Math.max(6, Math.ceil(TEACHERS_MESSAGES.length / 6)), prev + 1))}
                    disabled={messagesPage >= 6}
                    className={`bg-[#FFD166] text-[#073B4C] p-3 rounded-xl border-4 border-[#073B4C] shadow-[2px_2px_0_0_#073B4C] active:translate-y-0.5 active:shadow-none transition-all ${
                      messagesPage >= 6 ? 'opacity-40 cursor-not-allowed shadow-none translate-y-0.5' : 'cursor-pointer hover:bg-[#ffe199]'
                    }`}
                    aria-label="Halaman berikutnya"
                  >
                    <ChevronRight size={16} strokeWidth={4} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sponsored By Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[40px] p-6 md:p-8 border-4 border-[#073B4C] shadow-[12px_12px_0px_0px_#06D6A0] flex flex-col items-center gap-6"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#073B4C]/40 italic">Gratefully Supported & Sponsored by</p>
          
          {/* First Row: Major Sponsors */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 w-full px-6">
            <motion.a 
              href="https://www.wardahbeauty.com"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1 }}
              className="h-12 md:h-16 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <img 
                src="/wardah.jpeg" 
                alt="Wardah" 
                className="max-h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black uppercase tracking-tighter text-[#073B4C]/30 italic";
                  label.innerText = "WARDAH";
                  e.currentTarget.parentElement?.appendChild(label);
                }}
              />
            </motion.a>
            <motion.a 
              href="https://www.herbalife.com"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1 }}
              className="h-16 md:h-20 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <img 
                src="/herbalife.png" 
                alt="Herbalife" 
                className="max-h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black uppercase tracking-tighter text-[#073B4C]/30 italic";
                  label.innerText = "HERBALIFE";
                  e.currentTarget.parentElement?.appendChild(label);
                }}
              />
            </motion.a>
            <motion.a 
              href="https://www.instagram.com/kayvillaresort"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1 }}
              className="h-16 md:h-24 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <img 
                src="/kay.png" 
                alt="Kay" 
                className="max-h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black uppercase tracking-tighter text-[#073B4C]/30 italic";
                  label.innerText = "KAY";
                  e.currentTarget.parentElement?.appendChild(label);
                }}
              />
            </motion.a>
            <motion.a 
              href="https://www.rsbhaktiasih.com"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1 }}
              className="h-16 md:h-24 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <img 
                src="/rsbhaktiasih.png" 
                alt="RS Bhakti Asih" 
                className="max-h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black uppercase tracking-tighter text-[#073B4C]/30 italic";
                  label.innerText = "RS BHAKTI ASIH";
                  e.currentTarget.parentElement?.appendChild(label);
                }}
              />
            </motion.a>
          </div>

          {/* Divider line style */}
          <div className="w-full max-w-2xl border-t-2 border-[#073B4C]/10 my-1" />

          {/* Supporting Sponsors (Wrapping flex grid) */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 w-full px-6">
            <motion.a 
              href="https://besman.co.id"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1 }}
              className="h-12 md:h-16 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <img 
                src="/besman.jpeg" 
                alt="Besman" 
                className="max-h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black uppercase tracking-tighter text-[#073B4C]/30 italic";
                  label.innerText = "BESMAN";
                  e.currentTarget.parentElement?.appendChild(label);
                }}
              />
            </motion.a>
            <motion.a 
              href="https://www.ancol.com"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1 }}
              className="h-16 md:h-24 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <img 
                src="/ancol.png" 
                alt="Ancol" 
                className="max-h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black uppercase tracking-tighter text-[#073B4C]/30 italic";
                  label.innerText = "ANCOL";
                  e.currentTarget.parentElement?.appendChild(label);
                }}
              />
            </motion.a>
            <motion.a 
              href="https://www.instagram.com/tokotisa"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1 }}
              className="h-16 md:h-24 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <img 
                src="/tokotisa.png" 
                alt="Toko Tisa" 
                className="max-h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black uppercase tracking-tighter text-[#073B4C]/30 italic";
                  label.innerText = "TOKO TISA";
                  e.currentTarget.parentElement?.appendChild(label);
                }}
              />
            </motion.a>
            <motion.a 
              href="https://www.stifiniknowyou.com"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1 }}
              className="h-16 md:h-24 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <img 
                src="/stifin.png" 
                alt="STIFIn" 
                className="max-h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black uppercase tracking-tighter text-[#073B4C]/30 italic";
                  label.innerText = "STIFIN";
                  e.currentTarget.parentElement?.appendChild(label);
                }}
              />
            </motion.a>
            <motion.a 
              href="https://unsia.ac.id"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1 }}
              className="h-16 md:h-24 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <img 
                src="/unsia.png" 
                alt="UNSIA" 
                className="max-h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black uppercase tracking-tighter text-[#073B4C]/30 italic";
                  label.innerText = "UNSIA";
                  e.currentTarget.parentElement?.appendChild(label);
                }}
              />
            </motion.a>
            <motion.a 
              href="https://www.instagram.com/gotogarut"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1 }}
              className="h-14 md:h-20 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <img 
                src="/gtg.png" 
                alt="GTG" 
                className="max-h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black uppercase tracking-tighter text-[#073B4C]/30 italic";
                  label.innerText = "GTG";
                  e.currentTarget.parentElement?.appendChild(label);
                }}
              />
            </motion.a>
            <motion.a 
              href="https://www.instagram.com/oscarbakery888"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1 }}
              className="h-16 md:h-22 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <img 
                src="/oscar.png" 
                alt="Oscar" 
                className="max-h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black uppercase tracking-tighter text-[#073B4C]/30 italic";
                  label.innerText = "OSCAR";
                  e.currentTarget.parentElement?.appendChild(label);
                }}
              />
            </motion.a>
            <motion.a 
              href="https://www.instagram.com/bimbelspc.id/?hl=en"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1 }}
              className="h-16 md:h-24 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <img 
                src="/spc.png" 
                alt="SPC" 
                className="max-h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black uppercase tracking-tighter text-[#073B4C]/30 italic";
                  label.innerText = "SPC";
                  e.currentTarget.parentElement?.appendChild(label);
                }}
              />
            </motion.a>
            <motion.a 
              href="https://www.facebook.com/pages/BELAL%20Enterprise%20Australia/848631515000347"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1 }}
              className="h-16 md:h-24 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <img 
                src="/belal.png" 
                alt="BELAL" 
                className="max-h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const label = document.createElement('span');
                  label.className = "text-xl font-black uppercase tracking-tighter text-[#073B4C]/30 italic";
                  label.innerText = "BELAL";
                  e.currentTarget.parentElement?.appendChild(label);
                }}
              />
            </motion.a>
          </div>
        </motion.div>
          </>
        )}

        <footer className="h-16 bg-[#073B4C] rounded-[2rem] border-4 border-[#073B4C] flex items-center px-10 gap-10 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[#EF476F] w-2 translate-x-0" />
          <div className="flex items-center gap-2 shrink-0">
            <p className="text-[#FFD166] text-xs font-black uppercase tracking-widest hidden md:block italic">SILVER REUNION TEAM</p>
            {showFeedbackConfig && (
              <button 
                onClick={handleFeedbackClick}
                className="text-[#06D6A0] hover:text-white transition-colors text-xs font-black uppercase tracking-widest italic flex items-center gap-1 cursor-pointer border-none bg-transparent"
              >
                &bull; <span className="underline">Kirim Saran / Cuap-Cuap</span>
              </button>
            )}
          </div>
          <div className="flex-1 border-t-2 border-white/10 hidden md:block"></div>
          <p className="text-white/40 text-[10px] font-bold shrink-0 uppercase tracking-[0.2em]">SMUN 90 Jakarta &bull; Alumni '90</p>
        </footer>

        {/* Feedback Modal Popup */}
        <AnimatePresence>
          {isFeedbackModalOpen && user && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFeedbackModalOpen(false)}
                className="absolute inset-0 bg-[#073B4C]/80 backdrop-blur-xs"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-[40px] border-4 border-[#073B4C] p-8 max-w-lg w-full relative z-10 shadow-[12px_12px_0_0_#EF476F] flex flex-col gap-6"
              >
                <div className="flex justify-between items-center pb-2 border-b-2 border-slate-100">
                  <h3 className="text-2xl font-black uppercase italic text-[#EF476F] tracking-tight">Kirim Cuap-Cuap & Saran</h3>
                  <button 
                    onClick={() => setIsFeedbackModalOpen(false)}
                    className="font-black text-[#073B4C] hover:text-[#EF476F] text-xl px-2 cursor-pointer transition-colors border-none bg-transparent"
                  >
                    ✖
                  </button>
                </div>

                <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                  <div className="text-xs font-bold space-y-1 w-full">
                    <p className="opacity-50 uppercase tracking-wider text-[10px] font-black">Pengirim Terverifikasi</p>
                    <p className="text-sm font-black text-[#073B4C]">{user.name} <span className="bg-[#06D6A0] text-white text-[9px] font-black px-2 py-0.5 rounded-full ml-1.5 uppercase">Kelas {user.className}</span></p>
                  </div>
                </div>

                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">Saran / Cuap-Cuap (Maks. 500 Karakter)</label>
                    <textarea
                      rows={5}
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      placeholder="Tuliskan masukan santuy, kesan-kesan masa sekolah, atau sapaan hangatmu di sini sob..."
                      maxLength={500}
                      required
                      className="w-full border-4 border-[#073B4C] rounded-2xl p-4 font-bold text-sm focus:outline-none focus:bg-[#EF476F]/5 transition-colors placeholder:text-stone-300 resize-none leading-relaxed text-[#073B4C]"
                    />
                    <div className="flex justify-between mt-1 text-[10px] font-bold text-[#073B4C]/50">
                      <span>Gunakan bahasa yang asyik & positif ya!</span>
                      <span className="font-black tracking-widest">{feedbackInput.length} / 500</span>
                    </div>
                  </div>

                  {feedbackError && (
                    <div className="p-4 bg-red-50 border-2 border-[#EF476F] rounded-xl text-xs font-bold text-[#EF476F]">
                      {feedbackError}
                    </div>
                  )}

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsFeedbackModalOpen(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#073B4C] font-black py-4 rounded-2xl border-2 border-[#073B4C] text-sm uppercase tracking-wider cursor-pointer transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submittingFeedback || !feedbackInput.trim()}
                      className="flex-1 bg-[#06D6A0] hover:bg-[#05b88a] disabled:opacity-50 text-[#073B4C] font-black py-4 rounded-2xl border-4 border-[#073B4C] shadow-[4px_4px_0_0_#073B4C] active:translate-y-0.5 active:shadow-none transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      {submittingFeedback ? (
                        <div className="w-5 h-5 border-3 border-[#073B4C]/25 border-t-[#073B4C] rounded-full animate-spin" />
                      ) : (
                        "KIRIM SARAN"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Login Prompt Modal for Feedback */}
        <AnimatePresence>
          {showLoginPrompt && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLoginPrompt(false)}
                className="absolute inset-0 bg-[#073B4C]/80 backdrop-blur-xs"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-[40px] border-4 border-[#073B4C] p-8 max-w-md w-full relative z-10 shadow-[12px_12px_0_0_#FFD166] flex flex-col items-center justify-center text-center gap-5"
              >
                <div className="bg-[#FFD166] p-4 rounded-3xl border-4 border-[#073B4C] shadow-[4px_4px_0_0_#073B4C] rotate-[-4deg]">
                  <User size={40} className="text-[#073B4C]" strokeWidth={3} />
                </div>
                
                <h3 className="text-3xl font-black uppercase italic text-[#EF476F] tracking-tighter mt-2">Login Dulu, Sob! 🔐</h3>
                <p className="text-sm font-bold text-[#073B4C]/70 leading-relaxed">
                  Kamu harus masukin WhatsApp & pilih kelas dulu biar nama & kelas kamu tercatat otomatis sebagai pengirim saran/cuap-cuap!
                </p>

                <button
                  onClick={() => {
                    setShowLoginPrompt(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-2 w-full bg-[#06D6A0] hover:bg-[#05b88a] text-[#073B4C] font-black py-4 rounded-2xl border-4 border-[#073B4C] shadow-[4px_4px_0_0_#073B4C] active:translate-y-0.5 active:shadow-none transition-all text-sm uppercase tracking-widest cursor-pointer"
                >
                  Yuk, Login Sekarang!
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
