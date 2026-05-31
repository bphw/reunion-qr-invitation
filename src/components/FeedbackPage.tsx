import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MessageSquare, Heart, ThumbsUp, PartyPopper, Laugh, Send, Calendar } from 'lucide-react';

interface SubmitterInfo {
  name: string;
  nickname: string;
  className: string;
}

interface Reaction {
  id: string;
  participant_id: string;
  reaction: string;
  userName: string;
}

interface Reply {
  id: string;
  created_at: string;
  participant_id: string;
  feedback: string;
  parent_id: string;
  user: SubmitterInfo;
  reactions: Reaction[];
}

interface Feedback {
  id: string;
  created_at: string;
  participant_id: string;
  feedback: string;
  parent_id: string | null;
  user: SubmitterInfo;
  reactions: Reaction[];
  replies?: Reply[];
}

interface FeedbackPageProps {
  user: {
    id: string;
    name: string;
    nickname: string;
    className: string;
  };
  onBack: () => void;
}

// Available emojis for reaction
const REACTION_EMOJIS = [
  { key: 'heart', emoji: '❤️', label: 'Cinta' },
  { key: 'thumbs_up', emoji: '👍', label: 'Mantap' },
  { key: 'party', emoji: '🎉', label: 'Hore' },
  { key: 'funny', emoji: '😂', label: 'Lucu' },
  { key: 'love_eyes', emoji: '😍', label: 'Suka' },
  { key: 'fire', emoji: '🔥', label: 'Keren' },
  { key: 'clap', emoji: '👏', label: 'Tepukan' },
  { key: 'raise_hands', emoji: '🙌', label: 'Mantap' },
  { key: 'party_face', emoji: '🥳', label: 'Helem' },
  { key: 'sad', emoji: '😭', label: 'Terharu' },
  { key: 'pray', emoji: '🙏', label: 'Matur Nuwun' }
];

export default function FeedbackPage({ user, onBack }: FeedbackPageProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [submittingReply, setSubmittingReply] = useState<Record<string, boolean>>({});
  const [activePickerId, setActivePickerId] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/feedbacks');
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
        setError(null);
      } else {
        setError('Gagal mengambil data Pojok Cuap-Cuap. Silakan coba lagi ya, sob!');
      }
    } catch (err) {
      console.error("Failed to fetch feedbacks", err);
      setError('Gagal menghubungi server. Periksa koneksi internetmu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleToggleReaction = async (feedbackId: string, reactionKey: string) => {
    try {
      const response = await fetch('/api/feedback-reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: user.id,
          feedback_id: feedbackId,
          reaction: reactionKey
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Optimistically update reactions in local state
        setFeedbacks(prev => prev.map(f => {
          // Check if item is the root feedback
          if (f.id.toString() === feedbackId.toString()) {
            let updatedReactions = [...f.reactions];
            if (data.status === 'removed') {
              updatedReactions = updatedReactions.filter(r => 
                !(r.participant_id.toString() === user.id.toString() && r.reaction === reactionKey)
              );
            } else {
              updatedReactions.push({
                id: data.reaction.id,
                participant_id: user.id,
                reaction: reactionKey,
                userName: user.nickname
              });
            }
            return { ...f, reactions: updatedReactions };
          }

          // Check if item is inside the replies list
          if (f.replies && f.replies.length > 0) {
            const replyIndex = f.replies.findIndex(r => r.id.toString() === feedbackId.toString());
            if (replyIndex !== -1) {
              const updatedReplies = [...f.replies];
              const reply = updatedReplies[replyIndex];
              let updatedReactions = [...(reply.reactions || [])];
              
              if (data.status === 'removed') {
                updatedReactions = updatedReactions.filter(r => 
                  !(r.participant_id.toString() === user.id.toString() && r.reaction === reactionKey)
                );
              } else {
                updatedReactions.push({
                  id: data.reaction.id,
                  participant_id: user.id,
                  reaction: reactionKey,
                  userName: user.nickname
                });
              }
              
              updatedReplies[replyIndex] = { ...reply, reactions: updatedReactions };
              return { ...f, replies: updatedReplies };
            }
          }

          return f;
        }));
      }
    } catch (err) {
      console.error("Failed to toggle reaction", err);
    }
  };

  const TOP_EMOJI_KEYS = ['heart', 'thumbs_up', 'party', 'funny'];

  const renderReactions = (itemId: string, itemReactions: Reaction[]) => {
    const reactionsMap = getReactionCounts(itemReactions || []);
    
    // Display: top 4 default emojis, plus any other from the list that has a count > 0
    const emojisToRender = REACTION_EMOJIS.filter(emojiInfo => {
      const isTop4 = TOP_EMOJI_KEYS.includes(emojiInfo.key);
      const count = reactionsMap[emojiInfo.key]?.count || 0;
      return isTop4 || count > 0;
    });

    return (
      <div className="flex items-center gap-1 flex-wrap relative">
        {emojisToRender.map(emojiInfo => {
          const stats = reactionsMap[emojiInfo.key] || { count: 0, active: false };
          return (
            <motion.button
              key={emojiInfo.key}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleToggleReaction(itemId, emojiInfo.key)}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border font-black text-[9px] cursor-pointer transition-all ${
                stats.active
                  ? 'bg-[#FFD166] border-[#073B4C] text-[#073B4C]'
                  : 'bg-white border-[#073B4C]/10 hover:border-[#073B4C]/25 text-[#073B4C]/70'
              }`}
            >
              <span className="text-xs leading-none">{emojiInfo.emoji}</span>
              {stats.count > 0 && <span className="text-[9px]">{stats.count}</span>}
            </motion.button>
          );
        })}

        {/* Picker Trigger Button */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setActivePickerId(activePickerId === itemId ? null : itemId);
            }}
            className="flex items-center justify-center w-5.5 h-5.5 rounded-md border-2 border-[#073B4C]/10 hover:border-[#073B4C] text-[#073B4C]/60 hover:text-[#073B4C] font-black text-xs cursor-pointer bg-white transition-all shadow-[1px_1px_0_0_rgba(7,59,76,0.02)]"
          >
            +
          </motion.button>

          {activePickerId === itemId && (
            <>
              {/* Invisible backdrop to dismiss picker */}
              <div 
                className="fixed inset-0 z-40 cursor-default" 
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePickerId(null);
                }} 
              />
              {/* Dropdown Floating Multi-emoji Picker */}
              <div 
                className="absolute bottom-full mb-2 right-0 z-50 bg-white border-4 border-[#073B4C] p-2 rounded-2xl shadow-[4px_4px_0_0_#073B4C] grid grid-cols-4 gap-1.5 w-44"
                onClick={(e) => e.stopPropagation()}
              >
                {REACTION_EMOJIS.map(emojiInfo => (
                  <button
                    key={emojiInfo.key}
                    onClick={() => {
                      handleToggleReaction(itemId, emojiInfo.key);
                      setActivePickerId(null);
                    }}
                    className="hover:bg-slate-100 p-1.5 rounded-lg text-base flex items-center justify-center cursor-pointer transition-all hover:scale-115 active:scale-95"
                    title={emojiInfo.label}
                  >
                    {emojiInfo.emoji}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const handleSubmitReply = async (feedbackId: string) => {
    const text = replyTexts[feedbackId]?.trim();
    if (!text) return;

    if (text.length > 500) {
      alert("Balasan kepanjangan sob, maksimal 500 karakter ya!");
      return;
    }

    try {
      setSubmittingReply(prev => ({ ...prev, [feedbackId]: true }));
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: user.id,
          feedback: text,
          parent_id: feedbackId
        })
      });

      if (response.ok) {
        // Clear reply text input
        setReplyTexts(prev => ({ ...prev, [feedbackId]: '' }));
        // Refresh feed in real-time
        await fetchFeedbacks();
      } else {
        const errData = await response.json();
        alert(errData.error || "Gagal mengirimkan balasan, coba lagi ya sob!");
      }
    } catch (err) {
      console.error("Submit reply error:", err);
      alert("Terjadi kesalahan koneksi saat mengirim balasan");
    } finally {
      setSubmittingReply(prev => ({ ...prev, [feedbackId]: false }));
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Group reactions by emoji type
  const getReactionCounts = (reactions: Reaction[]) => {
    const counts: Record<string, { count: number; active: boolean }> = {};
    REACTION_EMOJIS.forEach(emoji => {
      counts[emoji.key] = { count: 0, active: false };
    });

    reactions.forEach(r => {
      if (counts[r.reaction]) {
        counts[r.reaction].count++;
        if (r.participant_id.toString() === user.id.toString()) {
          counts[r.reaction].active = true;
        }
      }
    });

    return counts;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="bg-white hover:bg-slate-50 text-[#073B4C] font-black py-3 px-6 rounded-2xl border-4 border-[#073B4C] shadow-[4px_4px_0_0_#EF476F] flex items-center gap-2 cursor-pointer transition-all uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={16} strokeWidth={3} /> Kembali ke Beranda
        </motion.button>
        
        <div className="text-right sm:text-right">
          <span className="text-xs font-black uppercase tracking-widest text-[#073B4C]/50">Pojok Reuni</span>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase text-[#EF476F] tracking-tighter leading-none mt-1">
            Pojok Cuap-Cuap Alumni
          </h2>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border-4 border-[#EF476F] rounded-3xl text-[#073B4C] shadow-[6px_6px_0_0_#EF476F]">
          <p className="font-black text-lg mb-2">Terjadi Hambatan, Sob! 🚧</p>
          <p className="font-bold text-sm opacity-80">{error}</p>
          <button 
            onClick={fetchFeedbacks}
            className="mt-4 bg-[#EF476F] text-white font-black py-2 px-4 rounded-xl border-2 border-[#073B4C] hover:scale-105 active:scale-95 transition-all text-xs"
          >
            Coba Ambil Ulang Data
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border-4 border-[#073B4C] shadow-[12px_12px_0_0_#118AB2]">
          <div className="w-16 h-16 border-8 border-[#073B4C]/10 border-t-[#EF476F] rounded-full animate-spin mb-4" />
          <p className="font-black text-xl text-[#073B4C] uppercase tracking-wider italic">Memuat Cuap-Cuap Alumni...</p>
          <p className="text-[#073B4C]/50 text-xs font-bold mt-2">Sabar ya sob, lagi ngerapihin datanya!</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-[40px] border-4 border-[#073B4C] shadow-[12px_12px_0_0_#06D6A0] text-[#073B4C] flex flex-col items-center justify-center">
          <div className="bg-[#FFD166] p-4 rounded-2xl border-4 border-[#073B4C] mb-6 shadow-[4px_4px_0_0_#073B4C] rotate-[-3deg]">
            <MessageSquare size={48} strokeWidth={2.5} />
          </div>
          <p className="font-black text-2xl uppercase tracking-tight italic">Belum ada Cuap-Cuap nih!</p>
          <p className="text-sm font-bold opacity-70 max-w-md mt-2 leading-relaxed">
            Jadilah yang pertama mengirimkan kesan, pesan, saran atau sapaan ke sobat alumni yang lain di Pojok Cuap-Cuap!
          </p>
          <button 
            onClick={onBack}
            className="mt-6 bg-[#06D6A0] hover:bg-[#05b88a] text-[#073B4C] font-black py-3 px-6 rounded-2xl border-4 border-[#073B4C] shadow-[4px_4px_0_0_#073B4C] active:translate-y-1 active:shadow-none transition-all uppercase text-xs tracking-widest text-center"
          >
            Kirim Cuap-Cuap Pertama Sekarang!
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {feedbacks.map((fb, idx) => {
              const reactionsMap = getReactionCounts(fb.reactions);
              const hasReplies = fb.replies && fb.replies.length > 0;

              return (
                <motion.div
                  key={fb.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-[32px] p-6 md:p-8 border-4 border-[#073B4C] shadow-[8px_8px_0_0_#073B4C] text-[#073B4C] flex flex-col gap-4 relative overflow-hidden"
                >
                  {/* Card Ribbon Style for Class info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#06D6A0] border-2 border-[#073B4C] flex items-center justify-center font-black text-white italic text-lg shadow-[2px_2px_0_0_#073B4C]">
                        {fb.user.nickname.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-lg leading-tight uppercase tracking-tight">
                            {fb.user.nickname}
                          </h4>
                          <span className="bg-[#EF476F]/10 text-[#EF476F] border-2 border-[#EF476F] font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {fb.user.className}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-[#073B4C]/50 uppercase tracking-widest">
                          {fb.user.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-[10px] text-[#073B4C]/50 font-bold uppercase tracking-wider">
                      {formatDate(fb.created_at)}
                    </div>
                  </div>

                  {/* Feedback Text content and compact Reaction Badges */}
                  <div className="relative bg-slate-50/50 p-4 md:p-5 border-2 border-[#073B4C]/5 rounded-2xl min-h-[4.5rem]">
                    <div className="text-base font-bold leading-relaxed whitespace-pre-wrap italic pr-0 sm:pr-48 pb-3 sm:pb-0">
                      "{fb.feedback}"
                    </div>

                    {/* Compact Reaction badges placed inside/on top-right of the text box (no heavy group container styling) */}
                    <div className="sm:absolute top-3.5 right-3.5 w-fit self-end sm:self-auto mt-2 sm:mt-0">
                      {renderReactions(fb.id, fb.reactions)}
                    </div>
                  </div>

                  {/* Nested Replies Section */}
                  <div className="mt-2 bg-[#118AB2]/5 rounded-2xl border-2 border-[#118AB2]/10 p-4 space-y-4">
                    <p className="text-[10px] font-black uppercase text-[#118AB2] tracking-wider flex items-center gap-1.5">
                      <MessageSquare size={12} strokeWidth={3} /> Balasan sobat lain ({fb.replies?.length || 0})
                    </p>

                    {hasReplies && (
                      <div className="space-y-3.5 pl-2 border-l-4 border-[#118AB2]/30">
                        {fb.replies?.map((reply) => (
                          <div key={reply.id} className="text-sm bg-white p-3 rounded-xl border-2 border-[#073B4C]/10 shadow-[2px_2px_0_0_#073B4C]/10">
                            <div className="flex items-center justify-between gap-2 border-b border-dashed border-slate-100 pb-1.5 mb-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xs text-[#073B4C]">{reply.user.nickname}</span>
                                <span className="bg-[#118AB2]/10 text-[#118AB2] text-[8px] font-black border border-[#118AB2]/30 px-1.5 rounded uppercase">{reply.user.className}</span>
                              </div>
                              <span className="text-[9px] font-bold text-slate-400">{formatDate(reply.created_at)}</span>
                            </div>
                            <p className="font-bold text-xs opacity-85 leading-relaxed italic text-[#073B4C]/90 pb-2">
                              "{reply.feedback}"
                            </p>
                            <div className="flex items-center justify-between gap-2 border-t border-dashed border-slate-100/60 pt-2">
                              <span className="text-[8px] font-black uppercase text-[#073B4C]/45 tracking-wider">Reaksi</span>
                              {renderReactions(reply.id, reply.reactions || [])}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Submit Reply form */}
                    <div className="flex gap-2.5 items-end pt-2">
                      <div className="flex-1 relative">
                        <textarea
                          rows={1}
                          value={replyTexts[fb.id] || ''}
                          onChange={(e) => setReplyTexts(prev => ({ ...prev, [fb.id]: e.target.value }))}
                          placeholder="Balas cuap-cuap ini, sapa balik sob!..."
                          maxLength={500}
                          className="w-full resize-none border-2 border-[#073B4C]/20 bg-white rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#118AB2] leading-tight"
                        />
                        <span className="absolute bottom-1 right-2 text-[8px] font-black tracking-widest text-[#073B4C]/30 uppercase">
                          {(replyTexts[fb.id] || '').length}/500
                        </span>
                      </div>
                      
                      <button
                        disabled={submittingReply[fb.id] || !(replyTexts[fb.id] || '').trim()}
                        onClick={() => handleSubmitReply(fb.id)}
                        className="bg-[#118AB2] hover:bg-[#0e7496] disabled:opacity-40 text-white font-black p-2.5 rounded-xl border-2 border-[#073B4C] shadow-[2.5px_2.5px_0_0_#073B4C] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer shrink-0"
                      >
                        {submittingReply[fb.id] ? (
                          <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}
