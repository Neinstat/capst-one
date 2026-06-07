import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Bot, User, Loader2 } from "lucide-react";
import { SKS_JALUR } from "../lib/utils";
import { useAuthStore } from "../store/authStore"; // Impor store auth untuk mengambil token JWT

export default function SksChatbotPage() {
  const { token } = useAuthStore(); // Ambil token JWT
  const [step, setStep] = useState("jalur");
  const [jalur, setJalur] = useState(null);
  const [subJalur, setSubJalur] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const CONVERSION_TABLE = [
    { type: "Magang 3–6 minggu", sks: "3 SKS" },
    { type: "Magang 16–24 minggu", sks: "20 SKS" },
    { type: "Juara 1/2/3 Belmawa (< 5 anggota)", sks: "20 SKS" },
    { type: "Juara 1/2/3 Belmawa (≥ 5 anggota)", sks: "10 SKS" },
    { type: "PKM Lolos Pendanaan", sks: "6 SKS" },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Sertakan token keamanan mahasiswa
        },
        body: JSON.stringify({
          message: input,
          jalur: jalur?.label || "", // Kirim teks nama jalur (misal: Magang MBKM)
          subJalur: subJalur || "", // Kirim nama sub-jalur yang dipilih
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
        throw new Error(
          data.message || "Gagal mendapatkan balasan dari server.",
        );
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
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950 text-white p-8 md:p-10 shadow-2xl border border-white/5">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-white/10 backdrop-blur-md text-rose-200 border border-white/10 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              MBKM AI Agent
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-rose-100 to-indigo-100">
              Konversi SKS
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
              Chatbot cerdas untuk estimasi konversi SKS jalur prestasi dan
              magang MBKM. Pilih jalur, lalu ceritakan kegiatanmu.
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
              className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl text-sm font-bold border border-white/20 hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" /> Ganti Jalur
            </button>
          )}
        </div>
      </div>

      {/* Jalur Selection Step */}
      {step === "jalur" && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-7 max-w-lg shadow-sm">
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-5">
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
                  className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-rose-400/60 bg-rose-50/50 shadow-md shadow-rose-500/10"
                      : "border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/50"
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 transition-colors ${isSelected ? "bg-rose-500" : "bg-gray-300"}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-extrabold text-gray-900">
                      {j.label}
                    </p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5 leading-relaxed">
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
                            className={`text-[11px] px-3 py-1.5 rounded-xl border font-bold transition-all ${
                              subJalur === s
                                ? "bg-rose-500 border-rose-500 text-white shadow-sm shadow-rose-500/20"
                                : "border-gray-200 text-gray-600 bg-white hover:border-rose-300 hover:text-rose-600"
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
            className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-sm font-bold shadow-lg shadow-rose-500/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            Lanjut ke Chat →
          </button>
        </div>
      )}

      {/* Chat Step */}
      {step === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversion Reference Table */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-6">
              <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">
                Tabel Konversi Resmi DTI
              </h3>
              <div className="space-y-0">
                {CONVERSION_TABLE.map(({ type, sks }) => (
                  <div
                    key={type}
                    className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0 gap-3"
                  >
                    <p className="text-xs text-gray-600 font-semibold leading-snug">
                      {type}
                    </p>
                    <span className="text-[11px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100/60 flex-shrink-0">
                      {sks}
                    </span>
                  </div>
                ))}
              </div>

              {/* Active Context */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Konteks Aktif
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-100/60">
                    {jalur?.label}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100/60">
                    {subJalur}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div
            className="lg:col-span-2 flex flex-col bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            style={{ minHeight: 520 }}
          >
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-gray-900">
                  MBKM AI Agent
                </p>
                <p className="text-[10px] font-semibold text-gray-400">
                  {jalur?.label} · {subJalur}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600">
                  Online
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-end gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-sm mb-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed font-semibold ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-br-sm shadow-md shadow-rose-500/20"
                        : "bg-gray-100/80 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mb-0.5">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex items-end gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-gray-100/80 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                placeholder="Ketik detail kegiatan MBKM kamu..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-rose-100 focus:border-rose-400 focus:outline-none transition-all font-semibold disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
