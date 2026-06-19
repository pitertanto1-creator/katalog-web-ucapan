// ==================== ENGINE GAME & DATA MOMENT CAPSULE ====================
document.addEventListener("DOMContentLoaded", () => {
    
    // Jalur file foto wajah ber-topi beruang yang sudah ada di folder assets kamu
    const cardImages = [
        "assets/nadya-happy.png",
        "assets/nadya-sad.png",
        "assets/nadya-happy.png", 
        "assets/nadya-sad.png",   
        "assets/nadya-happy.png",
        "assets/nadya-sad.png"
    ];

    // Menggandakan array untuk membuat 6 pasang kartu (Total 12 kartu)
    let gameCards = [...cardImages, ...cardImages];
    
    // Algoritma Pengacak Posisi Kartu Otomatis (Fisher-Yates)
    gameCards.sort(() => Math.random() - 0.5);

    const memoryGrid = document.getElementById('memory-grid');
    const hpFill = document.getElementById('hp-progress');
    const hpText = document.getElementById('hp-text');

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;
    const totalPairs = cardImages.length;

    // JALANKAN GENERATE KARTU KELUAR DI LAYAR MONITOR
    function createCards() {
        memoryGrid.innerHTML = "";
        gameCards.forEach((imagePath) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.framework = imagePath;

            card.innerHTML = `
                <div class="card-front">
                    <img src="${imagePath}" alt="Nadya Face">
                </div>
                <div class="card-back">🐻</div>
            `;

            card.addEventListener('click', flipCard);
            memoryGrid.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        matchedPairs++;
        updateProgress();
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 800);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function updateProgress() {
        let progressPercent = (matchedPairs / totalPairs) * 100;
        hpFill.style.width = progressPercent + '%';
        hpText.innerText = `${matchedPairs}/${totalPairs} Pairs`;

        // KONDISI MENANG: JIKA SELESAI, PINDAH SCREEN KE REWARD CAPSULE
        if (matchedPairs === totalPairs) {
            setTimeout(() => {
                document.getElementById('stage-game').classList.add('hidden');
                document.getElementById('stage-reward').classList.remove('hidden');
            }, 1000);
        }
    }

    createCards();
});

// FUNGSI UNTUK MENANGKAP DAN MEMUNCULKAN FOTO SECARA DINAMIS DI SLOT UPLOAD
function handleImage(input, imgId, slotId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImg = document.getElementById(imgId);
            const placeholderSlot = document.getElementById(slotId);
            
            previewImg.src = e.target.result;
            previewImg.style.display = "block";
            placeholderSlot.style.display = "none";
        }
        reader.readAsDataURL(file);
    }
}

// LOGIKA SURAT DARURAT (OPEN WHEN CHIPS)
function openEmergencyLetter(type) {
    let message = "";
    if (type === 'kangen') {
        message = "📂 MEMORY_FOUND: Kalo lagi kangen, langsung telfon aku ya! Jangan dipendem terus dipake ngambek. Aku selalu ada buat kamu. 🐻❤️";
    } else if (type === 'marah') {
        message = "⚠️ WARNING_SYSTEM: Yah, jangan ngambek lagi dong... Inget ga game memory beruang susah ini aja bisa kamu tamatin demi baikan? Maafin aku ya? 🥺🌹";
    } else if (type === 'sedih') {
        message = "🛡️ ANTIVIRUS_ACTIVE: Hey, jangan sedih. Apapun masalah hari ini yang bikin kamu bad mood, kita selesaiin bareng-bareng Player 2! 🍦✨";
    }
    
    document.getElementById('modal-message').innerText = message;
    document.getElementById('retro-modal').classList.remove('hidden');
}
// --- FITUR PRESET: EFEK KLIK TOMBOL LOCK PEACE ---
document.getElementById('btn-final-baikaan').addEventListener('click', function() {
    // 1. Trigger efek getar transisi di layar monitor
    const screen = document.querySelector('.arcade-screen');
    screen.style.animation = 'screen-shake 0.3s ease-in-out';
    setTimeout(() => screen.style.animation = '', 300);

    // 2. Jika kamu memakai library canvas-confetti, ini akan meledakkan konfeti di layar.
    // Jika tidak ada library, kita ganti dengan sistem pop-up pesan kelulusan perdamaian.
    let targetMessage = "🏆 CO-OP MISSION ACCOMPLISHED!\n\n" + 
                    "Sistem mendeteksi tingkat keharmonisan telah kembali ke 100%.\n" +
                    "Status hubungan: Resmi Baikan! \n" +
                    "Jangan ngambek-ngambek lagi ya Player 2, I Love You! 🐻❤️";

    // 3. Munculkan Alert Modal Retro dengan pesan spesial baikan
    document.getElementById('modal-message').innerText = targetMessage;
    document.getElementById('retro-modal').classList.remove('hidden');
    
    // 4. Ubah teks tombol secara permanen sebagai tanda sukses terkunci
    this.innerText = "🔒 PEACE LOCKED & SECURED!";
    this.style.background = "#00ffff"; // Berubah warna jadi biru muda neon
    this.style.color = "#000";
    this.disabled = true; // Tombol mati tidak bisa diklik ulang karena sudah damai
});