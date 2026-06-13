import { useAuthStore } from "../store/authStore";

export default function HomePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-center lg:items-end select-none animate-scale-in text-spark-primary">

      {/* Left Side: Large Signpost Illustration touching the bottom and very close to the sidebar */}
      <div className="w-full lg:w-[45%] h-[55vh] lg:h-full flex items-end justify-center flex-shrink-0 relative">
        <img
          src="/Palang Fitur SPARK DTI.png"
          alt="Palang Fitur SPARK DTI"
          className="h-[105%] lg:h-[105%] w-auto max-w-none select-none filter drop-shadow-md hover:scale-[1.01] transition-transform duration-500 origin-bottom translate-x-4 lg:translate-x-12"
        />
      </div>

      {/* Right Side: Welcome Greeting and Spacious Guide Text */}
      <div className="w-full lg:flex-1 h-auto lg:h-full flex flex-col justify-center p-8 lg:pl-32 xl:pl-40 lg:pr-16 lg:py-14 text-left">
        <div className="space-y-6 max-w-xl">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-100 dark:text-white leading-tight">
              Selamat Datang, <br />
              <span className="font-extrabold" style={{ color: "rgb(59, 130, 246)" }}>{user?.nama ?? "Civitas DTI"}</span>
            </h1>
            <div className="w-20 h-1 rounded-full" style={{ backgroundColor: "rgb(59, 130, 246)" }} />
          </div>

          <div className="space-y-4 text-sm md:text-base text-spark-secondary font-semibold leading-relaxed">
            <p>
              SPARK DTI adalah platform akademik cerdas untuk memfasilitasi kebutuhan studi, pemetaan skill, dan perencanaan karir mahasiswa Departemen Teknologi Informasi ITS.
            </p>
            <p>
              Tersedia pilihan 5 fitur utama yang dapat Anda gunakan secara bebas. Silakan gunakan <strong>side panel</strong> di bagian kiri untuk mempermudah akses langsung dari satu fitur ke fitur lainnya.
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.98); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
