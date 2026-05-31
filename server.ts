import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";

console.log("SERVER.TS STARTING...");

async function startServer() {
  console.log("startServer() called");
  const app = express();
  const PORT = 3000;

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  console.log("Initializing Supabase...");
  // Supabase Configuration
  const supabaseUrl = process.env.SUPABASE_URL || "https://whiyuofnjrnqnhinyfyn.supabase.co";
  const supabaseKey = process.env.SUPABASE_KEY || "sb_publishable_0baiYB7gQHC2F60uFzp9lg_C7liBcZM";
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log("Supabase client created.");

  // Get Class Names Endpoint
  app.get("/api/classes", async (req, res) => {
    try {
      // Fetch unique classes from Supabase
      const { data, error } = await supabase
        .from('participants')
        .select('class_of');

      if (error) throw error;

      const classes = Array.from(new Set(data.map(item => item.class_of?.toString().trim()).filter(Boolean))).sort();
      
      res.json(classes);
    } catch (error) {
      console.error("Fetch classes error:", error);
      res.status(500).json({ error: "Gagal mengambil data kelas dari database" });
    }
  });

  // Get Configurations Endpoint
  app.get("/api/config", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('configs')
        .select('key, val');

      if (error) {
        console.error("Supabase Config Error:", error);
        // Fallback or return empty if table doesn't exist yet
        return res.json({});
      }

      const config: Record<string, string> = {};
      data.forEach(item => {
        if (item.key) config[item.key] = item.val;
      });
      
      res.json(config);
    } catch (error) {
      console.error("Fetch config error:", error);
      res.status(500).json({ error: "Gagal mengambil data konfigurasi" });
    }
  });
  
  // Get Alumni Statistics Endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const { data: participants, error } = await supabase
        .from('participants')
        .select('id, payment_checklist, check_in');

      if (error) {
        console.error("Supabase stats error:", error);
        throw error;
      }

      let totalRegisteredAndPaid = 0;
      let totalCheckedIn = 0;

      if (participants) {
        participants.forEach(p => {
          const isPaid = p.payment_checklist === true || 
                         p.payment_checklist === "TRUE" || 
                         p.payment_checklist === "true" ||
                         p.payment_checklist === "1" ||
                         p.payment_checklist === 1;
                         
          const isCheckedIn = p.check_in === true ||
                              p.check_in === "TRUE" ||
                              p.check_in === "true" ||
                              p.check_in === "1" ||
                              p.check_in === 1;

          if (isPaid) {
            totalRegisteredAndPaid++;
            if (isCheckedIn) {
              totalCheckedIn++;
            }
          }
        });
      }

      res.json({
        totalRegisteredAndPaid,
        totalCheckedIn,
        percentCheckedIn: totalRegisteredAndPaid > 0 ? Math.round((totalCheckedIn / totalRegisteredAndPaid) * 100) : 0
      });
    } catch (error) {
      console.error("Fetch stats error:", error);
      res.status(500).json({ error: "Gagal mengambil statistik alumni" });
    }
  });

  // Get feedbacks (joining elements and reactions cleanly on server side)
  app.get("/api/feedbacks", async (req, res) => {
    try {
      // Fetch all participants to map names and classes
      const { data: participants, error: pError } = await supabase
        .from('participants')
        .select('id, full_name, nick_name, class_of');

      const participantMap: Record<string, any> = {};
      if (participants) {
        participants.forEach(p => {
          participantMap[p.id] = {
            name: p.full_name || "Tanpa Nama",
            nickname: p.nick_name || p.full_name || "Tanpa Nama",
            className: p.class_of || "Alumni"
          };
        });
      }

      // Fetch all feedbacks
      // Try querying with parent_id column
      let query = supabase.from('feedback').select('id, created_at, participant_id, feedback, parent_id');
      let fbResult = await query;
      
      if (fbResult.error) {
        console.warn("Retrying feedback query without parent_id column...");
        query = supabase.from('feedback').select('id, created_at, participant_id, feedback');
        fbResult = await query;
      }

      if (fbResult.error) {
        console.error("Supabase feedback error:", fbResult.error);
        return res.status(500).json({ error: "Gagal mengambil data Pojok Cuap-Cuap" });
      }

      const feedbacks = fbResult.data || [];

      // Fetch all reactions
      let rxResult = await supabase
        .from('feedback_reactions')
        .select('id, feedback_id, participant_id, reaction');
      
      const reactionsByFeedback: Record<string, any[]> = {};
      if (rxResult.data) {
        rxResult.data.forEach(r => {
          if (!reactionsByFeedback[r.feedback_id]) {
            reactionsByFeedback[r.feedback_id] = [];
          }
          reactionsByFeedback[r.feedback_id].push({
            id: r.id,
            participant_id: r.participant_id,
            reaction: r.reaction,
            userName: participantMap[r.participant_id]?.nickname || "Alumni"
          });
        });
      }

      // Process and structure feedbacks and replies
      const mappedFeedbacks = feedbacks.map(f => {
        let parentId = (fbResult.data && 'parent_id' in f) ? (f as any).parent_id : null;
        let actualFeedbackText = f.feedback || "";
        
        // Secondary fallback to support replies via [REPLY_TO:id] text prefix
        if (!parentId && actualFeedbackText.startsWith('[REPLY_TO:')) {
          const match = actualFeedbackText.match(/^\[REPLY_TO:([^\]]+)\]\s*(.*)/);
          if (match) {
            parentId = match[1];
            actualFeedbackText = match[2];
          }
        }

        return {
          id: f.id,
          created_at: f.created_at,
          participant_id: f.participant_id,
          feedback: actualFeedbackText,
          parent_id: parentId,
          user: participantMap[f.participant_id] || { name: "Alumni", nickname: "Alumni", className: "90" },
          reactions: reactionsByFeedback[f.id] || []
        };
      });

      // Split into root feedbacks and replies
      const rootFeedbacks = mappedFeedbacks.filter(f => !f.parent_id);
      const replies = mappedFeedbacks.filter(f => f.parent_id);

      rootFeedbacks.forEach((rf: any) => {
        rf.replies = replies
          .filter(r => r.parent_id?.toString() === rf.id.toString())
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      });

      // Sort root feedbacks: newest first
      rootFeedbacks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      res.json(rootFeedbacks);
    } catch (error) {
      console.error("Fetch feedbacks error:", error);
      res.status(500).json({ error: "Gagal mengambil data Pojok Cuap-Cuap" });
    }
  });

  // Post new feedback or reply
  app.post("/api/feedback", async (req, res) => {
    try {
      const { participant_id, feedback, parent_id } = req.body;
      if (!participant_id || !feedback) {
        return res.status(400).json({ error: "Saran dan identitas harus diisi, sob!" });
      }

      if (feedback.trim().length > 500) {
        return res.status(400).json({ error: "Waduh kepanjangan, maksimal 500 karakter ya sob!" });
      }

      // Prepare insert payload
      let insertData: any = {
        participant_id,
        feedback: feedback.trim()
      };

      if (parent_id) {
        insertData.parent_id = parent_id;
      }

      const { data, error } = await supabase
        .from('feedback')
        .insert([insertData])
        .select();

      if (error) {
        // If it failed because parent_id column does not exist
        if (error.message && error.message.includes('parent_id') && parent_id) {
          const fallbackText = `[REPLY_TO:${parent_id}] ${feedback.trim()}`;
          const { data: fbData, error: fbError } = await supabase
            .from('feedback')
            .insert([{ participant_id, feedback: fallbackText }])
            .select();
            
          if (fbError) throw fbError;
          return res.json(fbData[0]);
        }
        throw error;
      }

      res.json(data[0]);
    } catch (error) {
      console.error("Post feedback error:", error);
      res.status(500).json({ error: "Gagal mengirimkan cuap-cuap kamu. Coba lagi ya sob!" });
    }
  });

  // Add or toggle feedback reaction
  app.post("/api/feedback-reaction", async (req, res) => {
    try {
      const { participant_id, feedback_id, reaction } = req.body;
      if (!participant_id || !feedback_id || !reaction) {
        return res.status(400).json({ error: "Data reaksi kurang lengkap nih, sob!" });
      }

      // Check if reaction already exists to toggle it
      const { data: existing, error: checkError } = await supabase
        .from('feedback_reactions')
        .select('id')
        .eq('participant_id', participant_id)
        .eq('feedback_id', feedback_id)
        .eq('reaction', reaction);

      if (checkError) throw checkError;

      if (existing && existing.length > 0) {
        // Delete to toggle OFF
        const { error: deleteError } = await supabase
          .from('feedback_reactions')
          .delete()
          .eq('id', existing[0].id);

        if (deleteError) throw deleteError;
        return res.json({ status: "removed" });
      } else {
        // Insert new reaction to toggle ON
        const { data, error: insertError } = await supabase
          .from('feedback_reactions')
          .insert([{ participant_id, feedback_id, reaction }])
          .select();

        if (insertError) throw insertError;
        res.json({ status: "added", reaction: data[0] });
      }
    } catch (error) {
      console.error("Reaction toggle error:", error);
      res.status(500).json({ error: "Gagal memproses reaksi kamu, sob!" });
    }
  });

  // Get User Status Endpoint (for realtime check-in detection)
  app.get("/api/status/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const { data: user, error } = await supabase
        .from('participants')
        .select('id, check_in, check_in_timestamp, check_in_sequence')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Fetch status error:", error);
        return res.status(404).json({ error: "User tidak ditemukan" });
      }

      res.json({
        check_in: user.check_in,
        check_in_timestamp: user.check_in_timestamp,
        check_in_sequence: user.check_in_sequence
      });
    } catch (error) {
      console.error("Status check error:", error);
      res.status(500).json({ error: "Gagal mengambil status user" });
    }
  });

  // Login Endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { phone, className } = req.body;

      if (!phone || !className) {
        return res.status(400).json({ error: "Nomor telepon dan kelas harus diisi ya!" });
      }

      // Normalize input phone for comparison
      const normalizedInputPhone = phone.trim().replace(/\D/g, '');
      console.log(`Login attempt: Phone=${phone}, Normalized=${normalizedInputPhone}, Class=${className}`);

      // Query participants matching class
      const { data: participants, error } = await supabase
        .from('participants')
        .select('id, full_name, nick_name, whatsapp, class_of, payment_checklist, check_in, check_in_timestamp, check_in_sequence')
        .eq('class_of', className.trim());

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }

      if (!participants || participants.length === 0) {
        console.warn(`No participants found for class: ${className}`);
        return res.status(401).json({ error: "Waduh, data kelas ini belum ada di sistem sob." });
      }

      console.log(`Found ${participants.length} participants for class ${className}`);

      // Find user matching phone (matching last 9 digits for robustness)
      const user = participants.find(p => {
        const rowPhone = (p.whatsapp || "").toString().trim().replace(/\D/g, '');
        if (rowPhone.length < 9 || normalizedInputPhone.length < 9) {
           return rowPhone === normalizedInputPhone && rowPhone !== "";
        }
        return rowPhone.endsWith(normalizedInputPhone.slice(-9)) || normalizedInputPhone.endsWith(rowPhone.slice(-9));
      });

      if (!user) {
        console.warn(`User not found for phone match: ${normalizedInputPhone} in class ${className}`);
        return res.status(401).json({ error: "Gagal Absen! Pastikan nomor WhatsApp dan kelas benar ya sob!" });
      }

      // Check payment status - handle boolean, string, or number
      const isPaid = user.payment_checklist === true || 
                     user.payment_checklist === "TRUE" || 
                     user.payment_checklist === "true" ||
                     user.payment_checklist === "1" ||
                     user.payment_checklist === 1;

      if (!isPaid) {
        console.warn(`User found but not paid: ${user.full_name} (${user.id})`);
        return res.status(400).json({ error: "Tolong lunasi pembayaran reuni dulu ya sob :)" });
      }

      console.log(`User found and paid: ${user.full_name} (${user.id})`);

      // Success - map Supabase fields to app fields
      res.json({
        id: user.id,
        name: user.full_name || "Tanpa Nama",
        nickname: user.nick_name || user.full_name || "Tanpa Nama",
        phone: user.whatsapp,
        className: user.class_of,
        check_in: user.check_in,
        check_in_timestamp: user.check_in_timestamp,
        check_in_sequence: user.check_in_sequence
      });

    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Gagal memproses data. Silakan coba lagi nanti ya sob!" });
    }
  });

  // Catch-all for unmatched API routes
  app.all("/api/*", (req, res) => {
    console.warn(`Unmatched API request: ${req.method} ${req.url}`);
    res.status(404).json({ error: `API endpoint ${req.method} ${req.url} not found` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Initializing Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite ready.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("CRITICAL SERVER ERROR:", err);
  process.exit(1);
});
