const kadoLinkData = {
    // Audio Efek (Menggunakan URL online agar selalu berfungsi)
    trollSfx: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_731518b056.mp3", 
    bgMusic: "https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc5916301b.mp3",  
    
    // Teks instruksi di atas layar
    initialInstruction: "Ketuk kado ini untuk membuka kejutannya! 😜",
    nextInstructionTemplate: "Masih ada? Coba buka lagi! ✨📦",
    
    // TAHAPAN PRANK (Dibuat menjadi 6 Step dengan GIF Anda)
    stages: [
        {
            scale: 5,
            boxImage: "assets/gift-1.gif", // Pastikan file ada di folder 'assets'
            trollTitle: "Yeee Ngarep! 🤪",
            trollMsg: "Kado segede ini isinya ZONK! Katanya sih kado aslinya ada di dalem kotak yang lebih kecil...",
            buttonText: "Buka Kotak Berikutnya"
        },
        {
            scale: 4,
            boxImage: "assets/gift-2.gif", 
            trollTitle: "Cieee Penasaran... 🤭",
            trollMsg: "Masih kosong juga! Sabar ya sayang... Orang sabar disayang aku. Buka lagi gih!",
            buttonText: "Buka Lagi Ah"
        },
        {
            scale: 3,
            boxImage: "assets/gift-3.gif", 
            trollTitle: "Mulai Kesel Ya? 😂",
            trollMsg: "Hehehe jangan ngambek dong, ini ujian mental sebelum dapet hadiah utama. Yuk klik lagi!",
            buttonText: "Lanjut Buka Kotak"
        },
        {
            scale: 2,
            boxImage: "assets/gift-4.gif", 
            trollTitle: "Dikit Lagi Deh... 🙄",
            trollMsg: "Serius, aku nggak bohong. Kotak yang ini emang masih kosong, tapi kotak berikutnya tebak aja sendiri!",
            buttonText: "Sabar... Buka Lagi"
        },
        {
            scale: 1,
            boxImage: "assets/gift-5.gif", 
            trollTitle: "BELUM JUGAA?! 🧐",
            trollMsg: "Ampun! Tinggal sedikit lagi nih sampai ke lapisan inti. Tarik napas dalam-dalam ya...",
            buttonText: "Klik Sekali Lagi"
        },
        {
            scale: 0.5,
            boxImage: "assets/gift-6.gif", 
            trollTitle: "KOTAK TERAKHIR! 😱",
            trollMsg: "Yeay! Ini beneran kotak terakhir. Di balik tombol ini ada hadiah utama buat kamu. Siap?",
            buttonText: "Buka Hadiah Utama!"
        }
    ],
    
    // HADIAH UTAMA (Klimaks Akhir)
    finalGift: {
        title: "Kena Prank 6 Kali! 😜 Tapi Happy Birthday!",
        message: "Hehehe maaf banget ya dikerjain sampai pegel kliknya. Selamat ulang tahun kesayangan! Hubungi aku buat ambil kado aslinya ya!",
        
        // UBAH BAGIAN INI SAJA BOS:
        imageUrl: "assets/kado-asli.jpg", // Arahkan ke gambar kado magis yang baru disimpan
        
        buttonText: "Klaim Kado Asli Ke WhatsApp",
        buttonUrl: "https://wa.me/6281234567890?text=Sabar+aku+udah+klik+6+kali+prank+sayang"
    }
};