import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Bot, User, FileText, ExternalLink } from "lucide-react";
import { SKS_JALUR } from "../lib/utils";
import { useAuthStore } from "../store/authStore";

function FormatMessageText({ text, isUser }) {
  if (!text) return null;

  // 1. Preprocess the text to separate inline numbered lists (e.g. " 1. **" or " 1. ") onto newlines.
  // We'll replace spaces before numbers like " 1. **" or " 2. " with a newline.
  let processedText = text;

  // Replace space before list item number with newline.
  // We match a space followed by a digit and a dot, then a space or bold tag.
  processedText = processedText.replace(/\s+(\d+\.)\s+(?=\*\*|[A-Z])/g, '\n$1 ');

  // 2. Split text by newlines.
  const rawBlocks = processedText.split(/\n+/);
  const blocks = [];

  // 3. For each block, if it's not a list item, check its sentence count.
  // If a block has more than 3 sentences, we split it into smaller paragraph blocks of 3 sentences each.
  rawBlocks.forEach((block) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    // Check if it is a list item (starts with e.g. "1. ")
    const listMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
    if (listMatch) {
      blocks.push({
        type: "list-item",
        number: listMatch[1],
        content: listMatch[2],
      });
      return;
    }

    // It is a normal text paragraph. Split into sentences.
    // We split by standard sentence endings: period, question mark, exclamation mark followed by space or end of string.
    const sentences = trimmed.match(/[^.!?]+[.!?]+(\s+|$)/g) || [trimmed];

    if (sentences.length <= 4) {
      blocks.push({
        type: "paragraph",
        content: trimmed,
      });
    } else {
      let currentGroup = [];
      sentences.forEach((sentence, idx) => {
        currentGroup.push(sentence);
        if (currentGroup.length === 3 || idx === sentences.length - 1) {
          blocks.push({
            type: "paragraph",
            content: currentGroup.join("").trim(),
          });
          currentGroup = [];
        }
      });
    }
  });

  // Helper to parse bold (**word**) and italic (*word*) into JSX elements.
  const parseMarkdown = (str) => {
    // Split by ** or * markers.
    // Regex matches either **bold** or *italic*
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const content = part.slice(2, -2);
        return (
          <strong
            key={index}
            className={`font-extrabold ${isUser ? "text-white" : "text-blue-900"
              }`}
          >
            {content}
          </strong>
        );
      } else if (part.startsWith("*") && part.endsWith("*")) {
        const content = part.slice(1, -1);
        return (
          <em
            key={index}
            className={`italic ${isUser ? "text-blue-100" : "text-blue-800"
              }`}
          >
            {content}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        if (block.type === "list-item") {
          return (
            <div key={i} className="flex gap-2.5 pl-1 py-0.5 items-start leading-relaxed">
              <span className={`font-extrabold flex-shrink-0 min-w-[1.25rem] ${isUser ? "text-blue-100" : "text-blue-600 dark:text-blue-400"}`}>
                {block.number}.
              </span>
              <span className="flex-1">
                {parseMarkdown(block.content)}
              </span>
            </div>
          );
        }
        return (
          <p key={i} className="leading-relaxed">
            {parseMarkdown(block.content)}
          </p>
        );
      })}
    </div>
  );
}

export default function SksChatbotPage() {
  const { token } = useAuthStore();
  const [step, setStep] = useState("jalur");
  const [jalur, setJalur] = useState(null);
  const [subJalur, setSubJalur] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const CONVERSION_TABLE = [
    { type: "Magang 3–6 minggu", sks: "3 SKS" },
    { type: "Magang 16–24 minggu", sks: "20 SKS" },
    { type: "Juara 1/2/3 Belmawa (< 5 anggota)", sks: "20 SKS" },
    { type: "Juara 1/2/3 Belmawa (≥ 5 anggota)", sks: "10 SKS" },
    { type: "PKM Lolos Pendanaan", sks: "6 SKS" },
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    if (!token) {
      alert("Sesi Anda habis. Silakan login kembali.");
      return;
    }

    const userMsg = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: input,
          jalur: jalur?.label || "",
          subJalur: subJalur || "",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: data.reply || "Maaf, terjadi error. Coba lagi.",
            data: data.data,
          },
        ]);
      } else {
        throw new Error(data.message || "Gagal mendapatkan balasan dari server.");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: `Error: ${error.message}. Pastikan server backend Anda berjalan normal di port 5000.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 md:space-y-8 pb-10 md:pb-6 animate-scale-in text-spark-primary">
      {/* Hero Banner — sama persis seperti Academic Mapper */}
      <div className="relative overflow-hidden rounded-3xl spark-banner p-8 md:p-10 shadow-xl border">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-blue-900 border border-amber-500/35 uppercase tracking-widest shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              MBKM AI Agent
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Konversi SKS
            </h1>
            <p className="text-sm text-spark-secondary max-w-xl font-medium leading-relaxed">
              Chatbot cerdas untuk estimasi konversi SKS jalur prestasi dan magang MBKM.
              Pilih jalur, lalu ceritakan kegiatanmu.
            </p>
          </div>

          {step === "chat" && (
            <button
              onClick={() => {
                setStep("jalur");
                setJalur(null);
                setSubJalur(null);
                setMessages([]);
              }}
              className="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/15 hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" /> Ganti Jalur
            </button>
          )}
        </div>
      </div>

      {/* Content — sama seperti Academic Mapper */}
      <div className="features-blue-container">

        {/* Jalur Selection Step: dua kolom seperti Academic Mapper */}
        {step === "jalur" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card Kiri: Pilih Jalur */}
            <div className="bg-spark-card rounded-3xl border p-7 shadow-lg flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-extrabold text-spark-muted uppercase tracking-widest mb-5">
                  Pilih Jalur Konversi
                </h2>
                <div className="space-y-3">
                  {Object.values(SKS_JALUR).map((j) => {
                    const isSelected = jalur?.id === j.id;
                    return (
                      <button
                        key={j.id}
                        onClick={() => {
                          setJalur(j);
                          setSubJalur(null);
                        }}
                        className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${isSelected
                          ? "border-blue-500 bg-blue-500/5 shadow-md"
                          : "border-spark-border bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900/40"
                          }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 transition-colors ${isSelected ? "bg-blue-600" : "bg-slate-400 dark:bg-slate-700"
                            }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-extrabold text-spark-primary">{j.label}</p>
                          <p className="text-xs font-semibold text-spark-secondary mt-0.5 leading-relaxed">
                            {j.description}
                          </p>

                          {isSelected && j.sub?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {j.sub.map((s) => (
                                <button
                                  key={s}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSubJalur(s);
                                  }}
                                  className={`text-[11px] px-3 py-1.5 rounded-xl border font-bold transition-all ${subJalur === s
                                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                    : "border-spark-border text-spark-secondary bg-spark-card hover:border-blue-500/40 hover:text-blue-600"
                                    }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                disabled={!jalur || !subJalur}
                onClick={() => {
                  setStep("chat");
                  setMessages([
                    {
                      role: "bot",
                      text: `Halo! Saya akan membantu kamu menghitung estimasi konversi SKS untuk jalur ${jalur.label} — ${subJalur}. Ceritakan kegiatan kamu: nama perusahaan/kompetisi, durasi, dan jobdesc/prestasi yang diraih.`,
                    },
                  ]);
                }}
                className="mt-6 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/10 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                Lanjut ke Chat →
              </button>
            </div>

            {/* Card Kanan: Tabel Referensi SKS */}
            <div className="bg-spark-card rounded-3xl border p-7 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-sm font-extrabold text-spark-primary">Tabel Konversi SKS</h2>
                </div>
                <p className="text-xs font-semibold text-spark-secondary mb-5 leading-relaxed">
                  Referensi resmi perhitungan konversi SKS dari Departemen Teknologi Informasi ITS.
                </p>
                <div className="space-y-0">
                  {CONVERSION_TABLE.map(({ type, sks }) => (
                    <div
                      key={type}
                      className="flex items-start justify-between py-3 border-b border-spark-border last:border-0 gap-3"
                    >
                      <p className="text-xs text-spark-secondary font-semibold leading-snug">{type}</p>
                      <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20 flex-shrink-0">
                        {sks}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-spark-border space-y-3">
                <a
                  href="https://drive.google.com/file/d/1WhfgZpQPsTE_pRsW8mSZc0OoW53CZszJ/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-spark-border rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 hover:scale-[1.01] active:scale-95 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  PPT Panduan Resmi (PDF)
                </a>
                <p className="text-[10px] font-bold text-spark-muted leading-relaxed">
                  * Estimasi AI bersifat indikatif. Keputusan final ada di tangan koordinator MBKM DTI.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chat Step */}
        {step === "chat" && (
          <div className="flex flex-col md:flex-row gap-6 animate-scale-in h-auto md:h-[520px]">
            {/* Tabel Referensi */}
            <div className="w-full md:w-[280px] flex-shrink-0 overflow-y-auto clean-scrollbar">
              <div className="bg-spark-card rounded-3xl border p-6 shadow-lg min-h-full">
                <h3 className="text-[10px] font-extrabold text-spark-muted uppercase tracking-widest mb-4">
                  Tabel Konversi Resmi DTI
                </h3>
                <div className="space-y-0">
                  {CONVERSION_TABLE.map(({ type, sks }) => (
                    <div
                      key={type}
                      className="flex items-start justify-between py-2 border-b border-spark-border last:border-0 gap-3"
                    >
                      <p className="text-xs text-spark-secondary font-semibold leading-snug">{type}</p>
                      <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50/50 px-2 py-0.5 rounded-lg border border-blue-500/20 flex-shrink-0">
                        {sks}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-spark-border">
                  <p className="text-[10px] font-bold text-spark-muted uppercase tracking-widest mb-2">
                    Konteks Aktif
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-amber-400 text-blue-900 border border-amber-500/30 shadow-sm">
                      {jalur?.label}
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {subJalur}
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-spark-border">
                  <p className="text-[10px] font-extrabold text-spark-muted uppercase tracking-widest mb-1.5">
                    Butuh Panduan Detail?
                  </p>
                  <p className="text-[11px] font-semibold text-spark-secondary mb-3 leading-relaxed">
                    Baca panduan resmi alur konversi dan berkas syarat (LoA, PKS, dll).
                  </p>
                  <a
                    href="https://drive.google.com/file/d/1WhfgZpQPsTE_pRsW8mSZc0OoW53CZszJ/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 transition-all hover:scale-[1.01] active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Buka Panduan Resmi
                    <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                  </a>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 flex flex-col bg-spark-card rounded-3xl border shadow-lg overflow-hidden min-h-[450px] md:min-h-0">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-spark-border flex items-center gap-3 flex-shrink-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-spark-primary">MBKM AI Agent</p>
                  <p className="text-[10px] font-semibold text-spark-muted">
                    {jalur?.label} · {subJalur}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-600">Online</span>
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0 clean-scrollbar"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-end gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "bot" && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md mb-0.5">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed font-semibold ${msg.role === "user"
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 !text-white rounded-br-sm shadow-md"
                        : "bg-blue-50/50 text-blue-950 rounded-bl-sm border border-blue-100/70"
                        }`}
                    >
                      <FormatMessageText text={msg.text} isUser={msg.role === "user"} />

                      {msg.role === "bot" && /(loa|pks|dokumen|berkas|syarat|form)/i.test(msg.text) && (
                        <div className="mt-3 pt-3 border-t border-blue-100/60 dark:border-blue-900/20">
                          <a
                            href="https://drive.google.com/file/d/1WhfgZpQPsTE_pRsW8mSZc0OoW53CZszJ/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                          >
                            <FileText className="w-3 h-3" />
                            Pelajari Syarat & Panduan Resmi
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-100/60 flex items-center justify-center flex-shrink-0 mb-0.5">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-end gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-blue-50/50 rounded-2xl rounded-bl-sm px-4 py-3 border border-blue-100/70 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Bar */}
              <div className="px-5 py-4 border-t border-spark-border flex gap-3 bg-slate-50/50 dark:bg-slate-950/20 flex-shrink-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                  placeholder="Ketik detail kegiatan MBKM kamu..."
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-sm text-spark-primary placeholder-slate-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all font-semibold disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-400"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}