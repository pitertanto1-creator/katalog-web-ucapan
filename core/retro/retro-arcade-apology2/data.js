// data.js - PUSAT DATA KONTEN KAPSUL WAKTU (EDIT DI SINI)
const RETRO_GAME_DATA = {
    // 1. Jalur file gambar kartu memory beruang (Pastikan nama filenya cocok di folder assets)
    cardImages: [
        "assets/nadya-happy.png",
        "assets/nadya-sad.png",
        "assets/nadya-happy.png", 
        "assets/nadya-sad.png",   
        "assets/nadya-happy.png",
        "assets/nadya-sad.png"
    ],

    // 2. Isi pesan teks surat utama baikan setelah menang game
    mainLetterText: "Hai sayang, maaf ya udah bikin sistemnya glitch kemarin... Aku sayang banget sama kamu! ❤️ Kumpulkan momen-momen kita di bawah ini ya!",

    // 3. Data Linimasa Hubungan (Bisa kamu tambah atau kurangi sesuka hati)
    timeline: [
        {
            date: "12 Nov 2024",
            desc: "👾 First Met (Hari pertama kenal, kamu jaim bgt!)"
        },
        {
            date: "25 Jan 2025",
            desc: "🌹 Co-Op Player (Hari kita resmi bareng-bareng)."
        },
        {
            date: "14 Jun 2026",
            desc: "💥 The System Glitch (Hari ini, maaf ya udah bikin kesel, tapi kita sukses baikan!)"
        }
    ],

    // 4. Isi teks pesan rahasia tombol emergency (Open When... Chips)
    emergencyLetters: {
        kangen: "📂 MEMORY_FOUND: Kalo lagi kangen, langsung telfon aku ya! Jangan dipendem terus dipake ngambek. Aku selalu ada buat kamu. 🐻❤️",
        marah: "⚠️ WARNING_SYSTEM: Yah, jangan ngambek lagi dong... Inget ga game memory beruang susah ini aja bisa kamu tamatin demi baikan? Maafin aku ya? 🥺🌹",
        sedih: "🛡️ ANTIVIRUS_ACTIVE: Hey, jangan sedih. Apapun masalah hari ini yang bikin kamu bad mood, kita selesaiin bareng-bareng Player 2! 🍦✨"
    },

    // 5. Pesan akhir pop-up ketika tombol LOCK PEACE diklik
    lockPeaceMessage: "🏆 CO-OP MISSION ACCOMPLISHED!\n\nSistem mendeteksi tingkat keharmonisan telah kembali ke 100%.\nStatus hubungan: Resmi Baikan! \n\nJangan ngambek-ngambek lagi ya Player 2, I Love You! 🐻❤️"
};