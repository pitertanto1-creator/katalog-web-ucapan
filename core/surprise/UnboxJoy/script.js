document.addEventListener("DOMContentLoaded", () => {
    // 1. Menyuntikkan Data Teks dari data.js ke Elemen HTML
    document.getElementById("target-name").innerText = birthdayData.targetName;
    document.getElementById("sender-name").innerText = birthdayData.senderName;
    document.getElementById("hero-age").innerText = birthdayData.age + "TH";
    document.getElementById("chapter-age").innerText = "CH. " + birthdayData.age;
    document.getElementById("quote-text").innerText = birthdayData.quote;
    document.getElementById("scratch-reward").innerText = birthdayData.scratchReward;
    
    // 2. Setup File Musik Latar Belakang
    const audio = document.getElementById("bgMusic");
    audio.src = birthdayData.bgMusic;
    // Mengambil nama file asli dari tautan path untuk dipajang di player
    const fileName = birthdayData.bgMusic.split('/').pop() || "Birthday_Track.mp3";
    document.getElementById("track-name").innerText = fileName;

    // 3. Memasang Foto Banner Utama (Hero Image) jika tersedia
    const heroImg = document.getElementById("hero-img");
    const heroPlaceholder = document.getElementById("hero-placeholder");
    if (birthdayData.heroImage) {
        heroImg.src = birthdayData.heroImage;
        heroImg.onload = () => {
            heroImg.classList.remove("hidden");
            heroPlaceholder.classList.add("hidden");
        };
    }

    // 4. Membuat Struktur Gambar Polaroid Otomatis dari data.js
    const polaroidContainer = document.getElementById("polaroid-container");
    const rotations = ["rotate-[-3deg]", "rotate-[4deg]", "rotate-[-1deg]"]; // Efek tumpukan estetik miring acak
    
    birthdayData.photos.forEach((photoUrl, index) => {
        const rotationClass = rotations[index % rotations.length];
        const responsiveHide = index === 2 ? "hidden sm:block" : ""; // Foto ketiga disembunyikan di layar HP mini agar grid pas
        
        const card = document.createElement("div");
        card.className = `bg-white p-2 pb-6 shadow-xl ${rotationClass} border border-neutral-200/20 rounded transform hover:rotate-0 hover:scale-105 transition duration-300 ${responsiveHide}`;
        
        card.innerHTML = `
            <div class="bg-neutral-800 aspect-square rounded-sm overflow-hidden flex items-center justify-center">
                <img src="${photoUrl}" alt="Memori ${index+1}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="text-[9px] text-white/40 p-2 text-center hidden">[Foto Belum Ada]</span>
            </div>
        `;
        polaroidContainer.appendChild(card);
    });

    // 5. Membuat List Cerita Accordion Otomatis dari data.js
    const notesContainer = document.getElementById("love-notes-container");
    birthdayData.loveNotes.forEach((note, index) => {
        const noteId = `note${index}`;
        const isLast = index === birthdayData.loveNotes.length - 1;
        const noteDiv = document.createElement("div");
        noteDiv.className = isLast ? "pb-1" : "border-b border-white/10 pb-3";
        
        noteDiv.innerHTML = `
            <button onclick="toggleAccordion('${noteId}')" class="cursor-pointer w-full flex justify-between items-center text-left py-2 font-bold text-sm text-white hover:text-[#4CDBE4] transition">
                <span>${note.title}</span>
                <span id="icon-${noteId}" class="text-[#4CDBE4]">➕</span>
            </button>
            <div id="${noteId}" class="hidden mt-2 text-xs text-white/70 leading-relaxed font-light pl-1 transition-all duration-300">
                ${note.content}
            </div>
        `;
        notesContainer.appendChild(noteDiv);
    });
});

// Fungsi Membuka Gate Utama (Klik Tombol Unlock)
function unlockBox() {
    const gate = document.getElementById('gate-screen');
    const main = document.getElementById('main-screen');
    const audio = document.getElementById('bgMusic');

    // Menembakkan Efek Confetti Berwarna-warni
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
    
    // Memutar musik otomatis (Akan tertahan jika izin browser dinonaktifkan pembaca, player menyediakan tombol play cadangan)
    audio.play().catch(() => console.log("Autoplay musik dicegah browser. Menunggu interaksi lanjutan pengguna."));

    // Animasi Menghilangkan Gate dan Memunculkan Konten Utama
    gate.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        gate.style.display = 'none';
        main.classList.remove('hidden');
        setTimeout(() => {
            main.classList.remove('opacity-0');
            initScratchCard(); // Memulai proses rendering kanvas kartu gosok kado
        }, 50);
    }, 700);
}

// Logika Pengendali On/Off Pemutar Musik
function toggleMusic() {
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('play-pause-btn');
    const icon = document.getElementById('music-icon');

    if (audio.paused) {
        audio.play();
        btn.innerText = "PLAYING";
        icon.classList.add("spin-slow");
    } else {
        audio.pause();
        btn.innerText = "PAUSED";
        icon.classList.remove("spin-slow");
    }
}

// Menjaga agar icon piringan berputar otomatis jika lagu terdeteksi berjalan
document.getElementById('bgMusic').addEventListener('play', () => {
    document.getElementById('music-icon').classList.add("spin-slow");
});

// Logika Mekanisme Buka-Tutup Surat Ucapan (Accordion)
function toggleAccordion(id) {
    const element = document.getElementById(id);
    const icon = document.getElementById('icon-' + id);
    
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
        icon.innerText = '➖';
    } else {
        element.classList.add('hidden');
        icon.innerText = '➕';
    }
}

// Logika Inti Sistem Kartu Gosok Hadiah (Interactive Scratch Card Canvas)
function initScratchCard() {
    const canvas = document.getElementById('scratchCanvas');
    const ctx = canvas.getContext('2d');
    
    // Menghitung dimensi area penutup agar presisi mengikuti card induknya
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    // Mewarnai kanvas penutup dengan warna ungu gelap estetik matching tema web
    ctx.fillStyle = '#261b4e'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Memberi teks petunjuk gosok di atas kanvas penutup
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TAP & GOSOK DI SINI 🖐️', canvas.width / 2, canvas.height / 2 + 4);

    let isDrawing = false;

    // Fungsi utama menghapus lapisan piksel kanvas saat digosok jari/mouse
    function scratch(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        // Deteksi koordinat untuk mouse click ataupun touch screen HP
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.globalCompositeOperation = 'destination-out'; // Membuat goresan menjadi transparan tembus ke belakang
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2); // Ukuran radius gosokan jari
        ctx.fill();
    }

    // Sambungan penangkap sensor perangkat komputer (Mouse)
    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    
    // Sambungan penangkap sensor layar sentuh smartphone (Touch screen)
    canvas.addEventListener('touchstart', () => isDrawing = true);
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', scratch);
}