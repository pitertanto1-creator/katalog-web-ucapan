document.addEventListener("DOMContentLoaded", () => {
    // 1. Matikan Layar Loading Seketika
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }

    // 2. Siapkan Variabel dan Elemen DOM
    let currentStage = 0;
    let isMusicPlaying = false;

    const giftBox = document.getElementById('gift-box');
    const instructionText = document.getElementById('instruction-text');
    const glassCard = document.getElementById('glass-card');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const actionBtn = document.getElementById('action-btn');

    // 3. Siapkan Audio
    const trollAudio = new Audio(kadoLinkData.trollSfx);
    const bgMusicAudio = new Audio(kadoLinkData.bgMusic);
    bgMusicAudio.loop = true;

    // Fungsi Pembantu untuk Efek Confetti Instan
    function tembakConfettiKecil() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 40,   // Jumlah serpihan kertas
                spread: 60,          // Lebar sebaran serpihan
                origin: { y: 0.6 }   // Muncul dari posisi tengah sekitar kado
            });
        }
    }

    // 4. Fungsi Menampilkan Kado Berdasarkan Tahap (Stage)
    function renderKado() {
        const stage = kadoLinkData.stages[currentStage];
        
        // Ubah gambar kado dan ukurannya
        giftBox.src = stage.boxImage;
        giftBox.style.transform = `scale(${stage.scale})`;

        // Ubah teks instruksi di atas kado
        instructionText.innerText = currentStage === 0 
            ? kadoLinkData.initialInstruction 
            : kadoLinkData.nextInstructionTemplate;
    }

    // Render kado pertama kali saat web dibuka
    if (kadoLinkData && kadoLinkData.stages.length > 0) {
        renderKado();
    }

    // 5. Event: Saat Gambar Kado Diklik
    giftBox.addEventListener('click', () => {
        // Putar suara efek ketawa
        trollAudio.currentTime = 0;
        trollAudio.play().catch(() => console.log("Audio diblokir browser"));

        // =======================================================
        // BARU: LANGSUNG TEMBAK CONFETTI SETIAP KALI KADO DIKLIK!
        // =======================================================
        tembakConfettiKecil();

        // Cek apakah ini tahap terakhir
        if (currentStage === kadoLinkData.stages.length) {
            return; 
        }

        const stage = kadoLinkData.stages[currentStage];

        // Tampilkan Popup Prank
        popupTitle.innerText = stage.trollTitle;
        popupMessage.innerHTML = stage.trollMsg;
        actionBtn.innerText = stage.buttonText;
        glassCard.classList.add('show');
    });

    // 6. Event: Saat Tombol di Popup Diklik
    actionBtn.addEventListener('click', () => {
        // Sembunyikan popup
        glassCard.classList.remove('show');

        // Jika baru saja menutup popup hadiah utama, arahkan ke WA
        if (currentStage === kadoLinkData.stages.length) {
            window.location.href = kadoLinkData.finalGift.buttonUrl;
            return;
        }

        // Naikkan level tahap kado
        currentStage++;

        // Jika belum selesai, render kado mengecil berikutnya
        if (currentStage < kadoLinkData.stages.length) {
            renderKado();
        } 
        // Jika tahap prank habis, tampilkan Hadiah Utama
        else {
            bukaHadiahUtama();
        }
    });

    // 7. Fungsi Membuka Hadiah Utama (Ledakan Confetti Dobel & Lebih Besar!)
    function bukaHadiahUtama() {
        // Sembunyikan kotak kado
        giftBox.style.display = 'none';
        instructionText.innerText = "Selamat! 🎉";

        // Putar musik latar
        if (!isMusicPlaying) {
            bgMusicAudio.play().catch(() => console.log("Musik diblokir browser"));
            isMusicPlaying = true;
        }

        // Tampilkan popup hadiah utama
        popupTitle.innerText = kadoLinkData.finalGift.title;
        popupMessage.innerHTML = `
            <img src="${kadoLinkData.finalGift.imageUrl}" alt="Hadiah" style="width: 100%; border-radius: 10px; margin-bottom: 15px;">
            <p>${kadoLinkData.finalGift.message}</p>
        `;
        actionBtn.innerText = kadoLinkData.finalGift.buttonText;
        
        // Tampilkan kartu hadiah utama dan buat efek ledakan besar kiri-kanan
        setTimeout(() => {
            glassCard.classList.add('show');
            
            if (typeof confetti === 'function') {
                // Ledakan besar dari sisi kiri layar
                confetti({
                    particleCount: 120,
                    spread: 80,
                    origin: { y: 0.6, x: 0.2 },
                    colors: ['#ffd43b', '#ffffff', '#ff4d4d', '#4dabf7']
                });
                // Ledakan besar dari sisi kanan layar
                confetti({
                    particleCount: 120,
                    spread: 80,
                    origin: { y: 0.6, x: 0.8 },
                    colors: ['#ffd43b', '#ffffff', '#ff4d4d', '#4dabf7']
                });
            }
        }, 300);
    }
});