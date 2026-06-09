# services/planner_logic.py
import copy
from utils.curriculum_data import MASTER_KURIKULUM

def distribute_courses(wajib_courses, wun_courses, pilihan_courses, schedule_blueprint, taken_pilihan_sks, plan_type="normal"):
    """
    Smart Bucket Fill dengan Aturan Kurikulum ITS & Pre-Alokasi TA:
    0. Fase 0: Ekstraksi & Pre-Alokasi Mutlak untuk Pra-TA dan TA.
    1. Fase 1: WUN (MKWK & Penciri ITS) dikunci ke Semester 6 atau 7.
    2. Fase 2: Wajib Departemen dialokasikan sesuai urutan.
    3. Fase 3: Pilihan dialokasikan hingga batas kuota 15 SKS tercapai.
    """
    schedule = copy.deepcopy(schedule_blueprint)
    
    for sem in schedule:
        sem["_current_sks"] = 0

    # =========================================================================
    # --- PHASE 0: ISOLASI & PRE-ALOKASI TUGAS AKHIR DAN PRA-TA ---
    # =========================================================================
    ta_course = None
    prata_course = None
    filtered_wajib = []
    
    # 1. Pisahkan Pra-TA dan TA dari antrean matkul wajib
    for c in wajib_courses:
        nama_mk = str(c.get("nama", "")).lower()
        if "tugas akhir" in nama_mk:
            ta_course = c
        elif any(keyword in nama_mk for keyword in ["metodologi", "pra-ta", "pra ta", "penulisan ilmiah", "proposal"]):
            prata_course = c
        else:
            filtered_wajib.append(c)

    # 2. Cari index semester untuk Tugas Akhir (Semester terujung yang max_sks nya > 0)
    ta_idx = len(schedule) - 1
    while ta_idx > 0 and schedule[ta_idx]["max_sks"] == 0:
        ta_idx -= 1
        
    # 3. Pra-TA HARUS persis satu semester sebelum TA
    prata_idx = ta_idx - 1 if ta_idx > 0 else 0

    # Khusus untuk Plan C (Experience/Magang di Semester 7), Pra-TA harus ditarik lebih awal ke Semester 6
    if plan_type == "experience":
        prata_idx = 0

    # 4. Kunci mutlak posisi Pra-TA
    if prata_course:
        schedule[prata_idx]["courses"].append(prata_course)
        schedule[prata_idx]["_current_sks"] += int(prata_course.get("sks", 0))

    # 5. Kunci mutlak posisi Tugas Akhir
    if ta_course:
        schedule[ta_idx]["courses"].append(ta_course)
        schedule[ta_idx]["_current_sks"] += int(ta_course.get("sks", 0))


    # =========================================================================
    # --- PHASE 1: ALOKASI MK-WUN (MKWK & Penciri ITS) ---
    # =========================================================================
    sem_6_7 = [sem for sem in schedule if sem["periode"] in ["Semester 6", "Semester 7"]]
    unassigned_wun = []
    
    for course in wun_courses:
        placed = False
        c_sks = int(course.get("sks", 0))
        for sem in sem_6_7:
            if sem["_current_sks"] + c_sks <= sem["max_sks"]:
                sem["courses"].append(course)
                sem["_current_sks"] += c_sks
                placed = True
                break
        if not placed:
            unassigned_wun.append(course)


    # =========================================================================
    # --- PHASE 2: ALOKASI MK WAJIB DEPARTEMEN ---
    # =========================================================================
    sorted_wajib = sorted(filtered_wajib, key=lambda x: x.get("sem_default", 99))
    all_wajib = unassigned_wun + sorted_wajib
    
    for sem in schedule:
        unassigned_temp = []
        for course in all_wajib:
            c_sks = int(course.get("sks", 0))
            if sem["_current_sks"] + c_sks <= sem["max_sks"]:
                sem["courses"].append(course)
                sem["_current_sks"] += c_sks
            else:
                unassigned_temp.append(course)
        all_wajib = unassigned_temp 


    # =========================================================================
    # --- PHASE 3: ALOKASI MK PILIHAN (Strict 15 SKS Quota Limit) ---
    # =========================================================================
    sks_pilihan_needed = 15 - taken_pilihan_sks
    
    # Pisahkan matkul Magang agar tidak teralokasi sembarangan ke plan/semester lain
    magang_courses = [c for c in pilihan_courses if "magang" in str(c.get("nama", "")).lower()]
    regular_pilihan = [c for c in pilihan_courses if "magang" not in str(c.get("nama", "")).lower()]
    
    available_pilihan = copy.deepcopy(regular_pilihan)
    
    if sks_pilihan_needed > 0:
        # Pre-alokasi Matkul Magang KHUSUS untuk Plan C (Experience) di Semester 7
        if plan_type == "experience":
            sem_7 = next((s for s in schedule if s["periode"] == "Semester 7"), None)
            if sem_7:
                for mc in magang_courses:
                    c_sks = int(mc.get("sks", 0))
                    # Masukkan selama kuota SKS semester dan kuota SKS pilihan masih muat
                    if sem_7["_current_sks"] + c_sks <= sem_7["max_sks"] and (sks_pilihan_needed - c_sks) >= 0:
                        sem_7["courses"].append(mc)
                        sem_7["_current_sks"] += c_sks
                        sks_pilihan_needed -= c_sks

        # Sisa kuota SKS Pilihan diisi dengan matkul pilihan reguler
        for sem in schedule:
            idx = 0
            while idx < len(available_pilihan) and sem["_current_sks"] < sem["max_sks"] and sks_pilihan_needed > 0:
                course = available_pilihan[idx]
                c_sks = int(course.get("sks", 0))
                
                if sem["_current_sks"] + c_sks <= sem["max_sks"] and (sks_pilihan_needed - c_sks) >= 0:
                    sem["courses"].append(course)
                    sem["_current_sks"] += c_sks
                    sks_pilihan_needed -= c_sks
                    available_pilihan.pop(idx)
                else:
                    idx += 1

    for sem in schedule:
        sem.pop("_current_sks", None)
        
    return schedule


def generate_blueprint_plans(extracted_courses: list) -> dict:
    taken_codes = {str(c.get("kode", "")).upper().strip() for c in extracted_courses}
    total_sks_completed = sum(int(c.get("sks", 0) or 0) for c in extracted_courses)
    
    if total_sks_completed < 60:
        return {
            "status": "error",
            "message": f"SKS belum mencukupi prasyarat analisis. Total SKS Anda: {total_sks_completed} SKS (Minimal 60 SKS)."
        }

    taken_wajib_sks = 0
    taken_wun_sks = 0
    taken_pilihan_sks = 0
    
    for c in extracted_courses:
        c_code = str(c.get("kode", "")).upper().strip()
        c_sks = int(c.get("sks", 0) or 0)
        
        found_in_master = False
        for mk in MASTER_KURIKULUM:
            if mk["kode"].upper() == c_code:
                found_in_master = True
                if mk.get("tipe") == "Pilihan":
                    taken_pilihan_sks += c_sks
                elif c_code.startswith("UG") or mk.get("tipe") == "Agama":
                    taken_wun_sks += c_sks
                else:
                    taken_wajib_sks += c_sks
                break
                
        if not found_in_master:
            if c_code.startswith("UG"):
                taken_wun_sks += c_sks
            else:
                taken_pilihan_sks += c_sks

    remaining_wajib = []
    remaining_wun = []
    pool_pilihan = []
    
    has_taken_religion = any(
        code in taken_codes for code in ["UG234905", "UG234904", "UG234901", "UG234903", "UG234906", "UG234902"]
    )
    
    wun_prefixes = ("UG",)
    
    for mk in MASTER_KURIKULUM:
        kode_mk = mk["kode"].upper()
        
        if kode_mk in taken_codes:
            continue
            
        # Cek Pilihan terlebih dahulu agar KKN Tematik (UG234917) tidak masuk ke WUN wajib
        if mk.get("tipe") == "Pilihan":
            pool_pilihan.append(mk)
        elif kode_mk.startswith(wun_prefixes) or mk.get("tipe") == "Agama":
            if mk.get("tipe") == "Agama":
                if not has_taken_religion and kode_mk == "UG234901":
                    remaining_wun.append(mk)
            else:
                remaining_wun.append(mk)
        else:
            remaining_wajib.append(mk)

    # =========================================================================
    # REVISI BLUEPRINT: Blueprint Plan A Sem 8 dimatikan (0 SKS)
    # Ini akan memaksa TA masuk ke Semester 7, dan Pra-TA masuk ke Semester 6
    # =========================================================================
    plan_a_blueprint = [
        {"periode": "Semester 6", "max_sks": 24, "fokus": "Maksimalkan SKS & Teori Utama", "courses": []},
        {"periode": "Semester 7", "max_sks": 24, "fokus": "Eksekusi Tugas Akhir & Kelulusan", "courses": []},
        {"periode": "Semester 8", "max_sks": 0, "fokus": "Lulus 3.5 Tahun (Tidak Ada SKS)", "courses": []}
    ]
    
    plan_b_blueprint = [
        {"periode": "Semester 6", "max_sks": 24, "fokus": "Penyelarasan Kompetensi Utama", "courses": []},
        {"periode": "Semester 7", "max_sks": 20, "fokus": "Persiapan Magang / Portofolio", "courses": []},
        {"periode": "Semester 8", "max_sks": 20, "fokus": "Eksekusi Tugas Akhir & Kelulusan", "courses": []}
    ]
    
    plan_c_blueprint = [
        {"periode": "Semester 6", "max_sks": 24, "fokus": "Tuntaskan Seluruh MK Teori Wajib", "courses": []},
        {"periode": "Semester 7", "max_sks": 20, "fokus": "Program Magang Penuh Waktu (Konversi MBKM)", "courses": []},
        {"periode": "Semester 8", "max_sks": 22, "fokus": "Laporan Magang & Eksekusi Tugas Akhir", "courses": []}
    ]

    target_total_sks = 144
    sks_needed = target_total_sks - total_sks_completed

    plans = {
        "fast": {
            "title": "Plan A — Lulus 3.5 Tahun",
            "desc": "Ambil maks SKS tiap semester, percepat kelulusan.",
            "schedule": distribute_courses(remaining_wajib, remaining_wun, pool_pilihan, plan_a_blueprint, taken_pilihan_sks, "fast")
        },
        "balanced": {
            "title": "Plan B — Optimalkan SKS + Karir",
            "desc": "Mix SKS optimal, fokus skill industri dan persiapan karir.",
            "schedule": distribute_courses(remaining_wajib, remaining_wun, pool_pilihan, plan_b_blueprint, taken_pilihan_sks, "balanced")
        },
        "experience": {
            "title": "Plan C — Fokus Experience",
            "desc": "Selesaikan wajib lebih awal, magang penuh di akhir studi.",
            "schedule": distribute_courses(remaining_wajib, remaining_wun, pool_pilihan, plan_c_blueprint, taken_pilihan_sks, "experience")
        }
    }

    return {
        "status": "success",
        "metadata": {
            "sks_completed": total_sks_completed,
            "target_total_sks": target_total_sks,
            "sks_needed": sks_needed if sks_needed > 0 else 0,
            "distribusi_sks": {
                "wajib": {
                    "target": 103,
                    "diambil": taken_wajib_sks,
                    "sisa": max(0, 103 - taken_wajib_sks)
                },
                "wun": {
                    "target": 26,
                    "diambil": taken_wun_sks,
                    "sisa": max(0, 26 - taken_wun_sks)
                },
                "pilihan": {
                    "target": 15,
                    "diambil": taken_pilihan_sks,
                    "sisa": max(0, 15 - taken_pilihan_sks)
                }
            }
        },
        "plans": plans,
        "pool_pilihan_tersedia": pool_pilihan
    }