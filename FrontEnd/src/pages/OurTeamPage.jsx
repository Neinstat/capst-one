import { useState } from "react";

export default function OurTeamPage() {
  const team = [
    {
      name: "Fikri Aulia As Sa'adi",
      nrp: "5027231026",
      role: "Backend Engineer",
      desc: "Memimpin arsitektur sistem dan pengembangan end-to-end dari SPARK DTI.",
      avatar: "BE",
      gradient: "from-blue-600 to-indigo-600",
      glow: "rgba(99,102,241,0.35)",
      image: "/team/fikri.jpeg",
      quote: "Ngebangun arsitektur sistem dan backend yang kokoh itu seru banget. Bagi saya, API yang efisien adalah kunci utama biar user bisa dapet pengalaman yang lancar dan tanpa hambatan.",
      linkedin: "https://www.linkedin.com/in/fikri-aulia-as-saadi/",
      github: "https://github.com/FikriAuliaa"
    },
    {
      name: "Muhammad Andrean Rizq Prasetio",
      nrp: "5027231052",
      role: "UI/UX & Frontend Engineer",
      desc: "Merancang dan membangun antarmuka yang intuitif dan responsif bagi pengguna.",
      avatar: "FE",
      gradient: "from-sky-500 to-blue-600",
      glow: "rgba(14,165,233,0.35)",
      image: "/team/andre.png",
      quote: "Membuat website ini memang berangkat dari keresahan pribadi saya yang dimana pada semester 6 ini bingung terkait ketentuan konversi sks dan plan untuk mata kuliah tiap semester.",
      linkedin: "https://www.linkedin.com/in/muhammad-andrean-prasetio/",
      github: "https://github.com/Neinstat"
    },
    {
      name: "Randist Prawandha Putera",
      nrp: "5027231059",
      role: "AI Engineer",
      desc: "Membangun pipeline AI untuk fitur SKS Chatbot.",
      avatar: "AI",
      gradient: "from-blue-500 to-cyan-600",
      glow: "rgba(6,182,212,0.30)",
      image: "/team/randist.jpeg",
      quote: "Ngembangin pipeline AI buat Chatbot SKS ini menantang sekaligus asyik. Fokus saya adalah gimana cara teknologi pintar ini bisa beneran ngasih solusi personal buat kebutuhan mahasiswa.",
      linkedin: "https://www.linkedin.com/in/randistpputera/",
      github: "https://github.com/U5ESLESS"
    },
    {
      name: "Hasan",
      nrp: "5027231073",
      role: "Project Manager",
      desc: "Memimpin manajemen proyek dan penyelarasan pipeline AI pada fitur utama.",
      avatar: "PM",
      gradient: "from-indigo-500 to-purple-600",
      glow: "rgba(139,92,246,0.30)",
      image: "/team/hasan.png",
      quote: "Jadi PM di tim ini tuh tentang menyatukan banyak kepala. Kolaborasi yang asyik dan manajemen waktu yang pas adalah kunci kita buat nyulap ide-ide keren jadi produk nyata.",
      linkedin: "https://www.linkedin.com/in/hasanzs375/",
      github: "https://github.com/Hasanzs"
    },
    {
      name: "Nabiel Nizar Anwari",
      nrp: "5027231087",
      role: "AI Engineer",
      desc: "Membangun pipeline AI untuk fitur Akademic Mapper, Semester Planner, CV Reviewer.",
      avatar: "AI",
      gradient: "from-blue-600 to-blue-800",
      glow: "rgba(37,99,235,0.30)",
      image: "/team/nabiel.jpeg",
      quote: "Data akademik itu aslinya rumit banget. Lewat pemrosesan bahasa alami (NLP) yang saya bangun, saya pengen bikin semua data kompleks itu jadi simpel dan gampang dipahami mahasiswa.",
      linkedin: "https://www.linkedin.com/in/nabiel-nizar-anwari/",
      github: "https://github.com/bielnzar"
    },
  ];

  return (
    <div className="h-full overflow-y-auto clean-scrollbar">
      <div className="p-4 md:p-8 max-w-6xl mx-auto animate-scale-in">

        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/10 text-blue-600 border border-blue-500/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
            Tim Pengembang
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-spark-primary tracking-tight mb-3">
            Our Team
          </h1>
          <p className="text-sm text-spark-secondary font-semibold max-w-lg mx-auto leading-relaxed">
            Kami adalah tim mahasiswa Departemen Teknologi Informasi ITS yang merancang dan membangun SPARK DTI sebagai solusi akademik terintegrasi.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {team.map((member, i) => (
            <div
              key={i}
              className={`${i === 4 ? "lg:col-span-2 lg:max-w-2xl lg:mx-auto lg:w-full" : ""
                }`}
            >
              <TeamMemberCard member={member} />
            </div>
          ))}
        </div>

        {/* Footer Quote */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-spark-card border border-spark-border rounded-2xl px-8 py-5 shadow-sm max-w-xl">
            <p className="text-sm text-spark-secondary font-semibold italic leading-relaxed">
              "Kami percaya bahwa teknologi yang baik adalah teknologi yang membuat hidup akademik mahasiswa lebih mudah dan terarah."
            </p>
            <p className="text-xs font-extrabold text-blue-600 mt-3 uppercase tracking-widest">
              — Tim SPARK DTI
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Sub-component for individual Team Member Cards with Image Fallback
function TeamMemberCard({ member }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="bg-spark-card border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">

      {/* Upper Section: Photo & Profile Details */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

        {/* Photo Container (Ratio 1:1) */}
        <div className="relative flex-shrink-0 w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-lg border border-white/10">
          {!imgFailed ? (
            <img
              src={member.image}
              alt={member.name}
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${member.gradient} flex items-center justify-center`}
              style={{ boxShadow: `0 8px 24px ${member.glow}` }}
            >
              <svg
                className="w-14 h-14 text-white/40"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Profile Info Details */}
        <div className="flex-1 text-center sm:text-left space-y-2.5 min-w-0">
          <div>
            <h3 className="text-base font-extrabold text-spark-primary tracking-tight truncate">
              {member.name}
            </h3>
            <p className="text-xs font-mono font-bold text-spark-muted tracking-wide mt-0.5">
              NRP: {member.nrp}
            </p>
          </div>

          <span
            className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
          >
            {member.role}
          </span>

          <p className="text-xs text-spark-secondary font-medium leading-relaxed">
            {member.desc}
          </p>

          {/* Social Media Links */}
          <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-2.5">
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 hover:bg-blue-500 text-blue-600 dark:text-blue-400 hover:text-white border border-blue-500/20 hover:border-blue-500 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <LinkedInIcon className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-zinc-100 dark:bg-white/5 hover:bg-zinc-900 dark:hover:bg-zinc-100 text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-slate-950 border border-slate-200/80 dark:border-white/10 hover:border-zinc-900 dark:hover:border-zinc-100 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Kesan & Pesan bubble block */}
      {member.quote && (
        <div className="mt-5 p-4 bg-slate-950/20 border border-white/5 rounded-xl text-left relative">
          <span className="absolute -top-2.5 left-4 px-2 bg-spark-card text-[9px] font-black text-blue-500 uppercase tracking-widest border border-white/5 rounded-md">
            Kesan & Pesan
          </span>
          <p className="text-xs text-spark-secondary italic leading-relaxed pt-1">
            "{member.quote}"
          </p>
        </div>
      )}
    </div>
  );
}

// Inline SVG Icons
function LinkedInIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function GitHubIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}