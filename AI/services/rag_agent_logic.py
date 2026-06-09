def retrieve_mbkm_knowledge(query: str) -> str:
    """Simple RAG retrieval for MBKM knowledge"""
    knowledge_base = {
        "magang": "Magang bersertifikat adalah program di mana mahasiswa belajar dan bekerja di industri selama 1-2 semester, diakui hingga 20 SKS.",
        "studi independen": "Studi Independen bersertifikat adalah program pembelajaran di luar kelas perguruan tinggi untuk menguasai kompetensi spesifik dan praktis.",
        "pertukaran": "Pertukaran Mahasiswa Merdeka memungkinkan mahasiswa belajar di kampus lain di Indonesia untuk bertukar budaya.",
        "sks": "Setiap aktivitas MBKM yang disetujui dapat dikonversi hingga maksimal 20 SKS per semester tergantung durasi dan beban kerja.",
        "syarat": "Syarat umum MBKM adalah mahasiswa aktif minimal semester 5 dan mendapat persetujuan dari prodi."
    }
    
    query_lower = query.lower()
    relevant_info = []
    
    for key, info in knowledge_base.items():
        if key in query_lower:
            relevant_info.append(info)
            
    if relevant_info:
        return " ".join(relevant_info)
    return "Program MBKM Kemdikbud memberikan kesempatan mahasiswa belajar di luar program studi."
