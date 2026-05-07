import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Info } from "lucide-react";
import PdfDropzone from "../components/shared/PdfDropzone";
import { useAuthStore } from "../store/authStore";

const PROCESSING_STEPS = [
  "Upload file",
  "AI Parsing transkrip",
  "Mapping ke domain skill",
  "Generate rekomendasi karir",
];

export default function AcademicMapperPage() {
  const { token } = useAuthStore(); // Ambil token secara reaktif dari Zustand[cite: 6]
  const [step, setStep] = useState("upload");
  const [processingStep, setProcessingStep] = useState(0);
  const [file, setFile] = useState(null);

  const [resultData, setResultData] = useState({
    studentName: "",
    nrp: "",
    gpa: 0,
    skillData: [],
    careerMatches: [],
    extractedData: [],
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  async function handleUpload() {
    if (!file) return;

    // Validasi keberadaan token sebelum request[cite: 6]
    if (!token) {
      alert("Sesi berakhir, silakan login kembali.");
      return;
    }

    setStep("processing");
    const formData = new FormData();
    formData.append("transcript", file);

    try {
      const interval = setInterval(() => {
        setProcessingStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 1000);

      const response = await fetch(`${API_URL}/courses/analyze`, {
        method: "POST",
        body: formData,
        headers: {
          // Menggunakan token dari Zustand Store[cite: 6, 7]
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        clearInterval(interval);
        setResultData({
          studentName: result.studentName,
          nrp: result.nrp,
          gpa: result.gpa,
          skillData: result.skillData,
          careerMatches: result.careerMatches,
          extractedData: result.extractedData,
        });
        setTimeout(() => setStep("result"), 800);
      } else {
        clearInterval(interval);
        alert(result.message || "Gagal memproses transkrip");
        setStep("upload");
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
      setStep("upload");
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Academic Mapper
        </span>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Academic Mapper & Career Path
        </h1>
      </div>

      {step === "upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Upload Transkrip Nilai
            </h2>
            <PdfDropzone onFile={setFile} label="Upload Transkrip PDF" />
            {file && (
              <button
                onClick={handleUpload}
                className="mt-6 w-full py-4 rounded-2xl bg-green-600 text-white text-lg font-bold hover:bg-green-700 transition-all shadow-md active:scale-[0.98]"
              >
                Mulai Analisis AI
              </button>
            )}
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-600" />
              <h2 className="text-lg font-extrabold text-blue-900">
                Panduan Transkrip
              </h2>
            </div>
            <p className="text-[14px] font-semibold text-blue-700 mb-4">
              Perhatian: Mohon gunakan transkrip yang sesuai agar hasil analisis akurat.
            </p>
            <div className="space-y-3">
              {[
                "Buka siakad myITS",
                "Masuk ke modul Laporan",
                "Pilih Transkrip Sementara",
                "Download dengan format Horizontal (.pdf)",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4 text-[14px] text-blue-700 font-semibold leading-snug">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[13px] font-black">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-4 border-t border-blue-100">
              <p className="text-[12px] text-blue-500 italic">
                *Sistem menyamarkan data sensitif sebelum diproses AI untuk keamanan Anda.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === "processing" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-sm font-medium text-gray-700">
            {PROCESSING_STEPS[processingStep]}...
          </p>
        </div>
      )}

      {step === "result" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard label="Nama Mahasiswa" value={resultData.studentName} />
            <StatsCard label="NRP" value={resultData.nrp} />
            <StatsCard label="GPA Transkrip" value={resultData.gpa} isGpa />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Skills Assessment
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={resultData.skillData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <Tooltip />
                  <Radar
                    name="Skor"
                    dataKey="score"
                    stroke="#16a34a"
                    fill="#16a34a"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-lg font-extrabold text-gray-800 mb-8">
                Rekomendasi Jalur Karir
              </h2>
              <div className="space-y-6">
                {resultData.careerMatches.map((career, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-colors duration-300"
                  >
                    <div className="flex justify-between mb-4">
                      <span className="text-lg font-extrabold text-gray-900">
                        {career.role}
                      </span>
                      <span
                        className="text-base font-black"
                        style={{ color: career.color }}
                      >
                        {career.match}% Match
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${career.match}%`,
                          backgroundColor: career.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => setStep("upload")}
            className="px-6 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Analisis Ulang
          </button>
        </div>
      )}
    </div>
  );
}

function StatsCard({ label, value, isGpa }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p
        className={`text-3xl font-black mt-3 ${isGpa ? "text-green-600" : "text-gray-900"}`}
      >
        {value}
      </p>
    </div>
  );
}
