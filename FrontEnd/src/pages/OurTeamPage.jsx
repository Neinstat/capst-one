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
    },
    {
      name: "Muhammad Andrean Rizq Prasetio",
      nrp: "5027231052",
      role: "UI/UX & Frontend Engineer",
      desc: "Merancang dan membangun antarmuka yang intuitif dan responsif bagi pengguna.",
      avatar: "FE",
      gradient: "from-sky-500 to-blue-600",
      glow: "rgba(14,165,233,0.35)",
    },
    {
      name: "Randist Prawandha Putera",
      nrp: "5027231059",
      role: "AI Engineer",
      desc: "Membangun pipeline AI untuk fitur SKS Chatbot.",
      avatar: "AI",
      gradient: "from-blue-500 to-cyan-600",
      glow: "rgba(6,182,212,0.30)",
    },
    {
      name: "Hasan",
      nrp: "5027231073",
      role: "Project Manager",
      desc: "Memimpin manajemen proyek dan penyelarasan pipeline AI pada fitur utama.",
      avatar: "PM",
      gradient: "from-indigo-500 to-purple-600",
      glow: "rgba(139,92,246,0.30)",
    },
    {
      name: "Nabiel Nizar Anwari",
      nrp: "5027231087",
      role: "UI/UX Designer",
      desc: "Membangun pipeline AI untuk fitur Akademic Mapper, Semester Planner, CV Reviewer.",
      avatar: "AI",
      gradient: "from-blue-600 to-blue-800",
      glow: "rgba(37,99,235,0.30)",
    },
  ];

  return (
    <div className="h-full overflow-y-auto clean-scrollbar">
      <div className="p-8 max-w-5xl mx-auto animate-scale-in">

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-spark-card border border-spark-border rounded-2xl p-6 flex flex-col items-center text-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Avatar */}
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-xl font-black text-white shadow-lg`}
                  style={{ boxShadow: `0 8px 24px ${member.glow}` }}
                >
                  {member.avatar}
                </div>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Info */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-extrabold text-spark-primary tracking-tight">
                  {member.name}
                </h3>

                {/* ── BAGIAN NRP YANG DITAMBAHKAN ────────────────────────────── */}
                <p className="text-[11px] font-mono font-bold text-spark-muted tracking-wide -mt-0.5">
                  NRP: {member.nrp}
                </p>
                {/* ────────────────────────────────────────────────────────── */}

                <span
                  className={`inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-gradient-to-r ${member.gradient} text-white`}
                >
                  {member.role}
                </span>
                <p className="text-xs text-spark-secondary font-medium leading-relaxed mt-2">
                  {member.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Quote */}
        <div className="mt-12 text-center">
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