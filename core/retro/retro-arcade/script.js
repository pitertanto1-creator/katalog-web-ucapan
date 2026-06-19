// script.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. SETTING GAME DISESUAIKAN (MULAI DARI 0% HP)
    let hpValue = 0; // Mulai dari 0 agar game lebih panjang
    let score = 0;
    let arcadeCoins = 3; // Koin untuk spin gacha di akhir game
    let claimedCount = 0;
    let playerLeftPercent = 50; 
    const playerSpeed = 8;     
    
    const hpFill = document.getElementById('hp-progress');
    const hpText = document.getElementById('hp-text');
    const scoreVal = document.getElementById('score-val');
    const gameArea = document.getElementById('game-area');
    const playerBear = document.getElementById('pixel-player');
    
    let activeItems = [];
    let gameLoopInterval;
    let spawnInterval;
    let isGameRunning = true;

    // Render Teks Awal Surat
    document.getElementById('retro-text-letter').innerText = retroData.letterText;

    // KONTROL ALERT MODAL RETRO
    const retroModal = document.getElementById('retro-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    function showRetroAlert(msg) {
        modalMessage.innerHTML = msg;
        retroModal.classList.remove('hidden');
    }
    modalCloseBtn.addEventListener('click', () => { retroModal.classList.add('hidden'); });

    // 2. SISTEM PERGERAKAN BERUANG PLAYER
    function movePlayer(direction) {
        if (!isGameRunning) return;
        if (direction === 'left') {
            playerLeftPercent -= playerSpeed;
            if (playerLeftPercent < 5) playerLeftPercent = 5; 
        } else if (direction === 'right') {
            playerLeftPercent += playerSpeed;
            if (playerLeftPercent > 95) playerLeftPercent = 95; 
        }
        playerBear.style.left = playerLeftPercent + '%';
    }

    document.getElementById('btn-move-left').addEventListener('click', () => movePlayer('left'));
    document.getElementById('btn-move-right').addEventListener('click', () => movePlayer('right'));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') movePlayer('left');
        if (e.key === 'ArrowRight') movePlayer('right');
    });

    // script.js

        // --- MECHANIC BARU: SPAWNING GAMBAR WAJAH BER-TOPI BERUANG ---
    function createFallingItem() {
        if (!isGameRunning) return;
        
        // 1. Buat wadah kotak untuk objek jatuh
        const itemContainer = document.createElement('div');
        itemContainer.className = 'falling-item';
        
        // 2. Buat tag gambar <img>
        const nadyaImg = document.createElement('img');
        
        // Peluang acak muncul: 65% Senyum, 35% Cemberut
        const isHappyNadya = Math.random() > 0.35; 
        
        // 3. Arahkan jalur file ke gambar baru di folder assets
        if (isHappyNadya) {
            nadyaImg.src = "assets/nadya-happy.png"; // Wajah senyum topi beruang
            nadyaImg.alt = "Happy Nadya";
        } else {
            nadyaImg.src = "assets/nadya-sad.png";   // Wajah cemberut topi beruang
            nadyaImg.alt = "Sad Nadya";
        }
        
        // 4. Masukkan gambar ke dalam wadah kotak
        itemContainer.appendChild(nadyaImg);
        
        // 5. Atur koordinat posisi acak di atas layar game
        const randomLeft = Math.floor(Math.random() * 85) + 5; 
        itemContainer.style.left = randomLeft + '%';
        itemContainer.style.top = '-50px'; // Set agak ke atas karena gambar berukuran besar
        
        gameArea.appendChild(itemContainer);
        
        // 6. Masukkan data ke dalam array pemantau tabrakan
        activeItems.push({
            element: itemContainer, 
            leftPercent: randomLeft,
            topPx: -50,
            type: isHappyNadya ? 'good' : 'bad' // Logika skor & HP tetap sinkron
        });
    }
    function updateGameEngine() {
        if (!isGameRunning) return;

        for (let i = activeItems.length - 1; i >= 0; i--) {
            let item = activeItems[i];
            item.topPx += 5; // Kecepatan jatuh item
            item.element.style.top = item.topPx + 'px';
            
            if (item.topPx >= 185 && item.topPx <= 205) {
                if (Math.abs(item.leftPercent - playerLeftPercent) <= 10) {
                    // JIKA MENANGKAP HATI BERIKAT NILAI BEBAN +5% (Wajib 20 kali kumpul secara bersih)
                    if (item.type === 'good') {
                        updateHP(5); // +5% HP tiap hati melayang
                        score += 100;
                    } else {
                        updateHP(-5); // -5% HP jika terkena amarah
                        score = Math.max(0, score - 50);
                    }
                    scoreVal.innerText = String(score).padStart(4, '0');
                    item.element.remove();
                    activeItems.splice(i, 1);
                    continue;
                }
            }
            
            if (item.topPx > 230) {
                item.element.remove();
                activeItems.splice(i, 1);
            }
        }
    }

    function updateHP(amount) {
        hpValue += amount;
        if (hpValue > 100) hpValue = 100;
        if (hpValue < 0) hpValue = 0;

        hpFill.style.width = hpValue + '%';
        hpText.innerText = hpValue + '%';

        if (hpValue >= 100) {
            isGameRunning = false;
            clearInterval(gameLoopInterval);
            clearInterval(spawnInterval);
            
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            activeItems.forEach(item => item.element.remove());

            setTimeout(() => {
                document.getElementById('stage-game').classList.add('hidden');
                document.getElementById('stage-reward').classList.remove('hidden');
            }, 1200);
        }
    }

    gameLoopInterval = setInterval(updateGameEngine, 30);
    spawnInterval = setInterval(createFallingItem, 850); // Kecepatan spawn objek dipercepat sedikit biar seru

    // --- BARU: LOGIKA FITUR MESIN GACHA & INVENTORY SYSTEM ---
    const btnSpin = document.getElementById('btn-spin-gacha');
    const gachaScreen = document.getElementById('gacha-screen');
    const coinCountDisplay = document.getElementById('coin-count');

    btnSpin.addEventListener('click', () => {
        if (arcadeCoins <= 0) {
            showRetroAlert('🪙 ERROR: OUT OF COINS!<br>Semua koin arcade kamu sudah habis digunakan.');
            return;
        }

        arcadeCoins--;
        coinCountDisplay.innerText = arcadeCoins;
        btnSpin.disabled = true;
        gachaScreen.innerText = "⚡ SPINNING... ⚡";

        // Simulasi animasi Gacha bergulir acak ala kasino retro
        let spinCount = 0;
        let shuffleInterval = setInterval(() => {
            let tempIndex = Math.floor(Math.random() * retroData.vouchers.length);
            gachaScreen.innerText = retroData.vouchers[tempIndex];
            spinCount++;

            if (spinCount > 10) {
                clearInterval(shuffleInterval);
                
                // Ambil hasil final acak dari data.js
                const finalVoucher = retroData.vouchers[Math.floor(Math.random() * retroData.vouchers.length)];
                gachaScreen.innerHTML = `🎉 GOT: ${finalVoucher}`;
                
                // Masukkan item ke dalam slot ransel / inventory yang kosong
                claimedCount++;
                const activeSlot = document.getElementById(`inv-${claimedCount}`);
                if (activeSlot) {
                    activeSlot.innerText = finalVoucher;
                    activeSlot.classList.add('claimed');
                }

                // Ledakan petasan kertas kecil tiap dapat voucher
                confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0 } });
                confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1 } });

                btnSpin.disabled = false;
            }
        }, 150);
    });

    // SISTEM BAILAAN AKHIR & MUSIK AUDIO (Tetap Pertahankan Versi Kemarin)
    document.getElementById('btn-final-baikaan').addEventListener('click', () => {
        showRetroAlert('🎮 PLAYER 1 & PLAYER 2 CO-OP CONNECTED!<br>Sistem error diatasi, kita resmi baikan ya sayang! 🥰🌹');
    });

    const audio = document.getElementById('main-audio');
    const playBtn = document.getElementById('play-btn');
    if(audio) audio.src = retroData.assets.bgMusic;

    playBtn.addEventListener('click', () => {
        if(!audio.src) return;
        if(audio.paused) { audio.play(); } else { audio.pause(); }
    });

    // MASTER CHIP LOCK AKURAT JUALAN (KLIK JUDUL 5 KALI)
    let clickCount = 0;
    const titleTrigger = document.getElementById('arcade-title');
    titleTrigger.addEventListener('click', () => {
        clickCount++;
        if(clickCount === 5) {
            document.body.classList.toggle('admin-mode');
            const status = document.body.classList.contains('admin-mode') ? 'UNLOCKED' : 'LOCKED';
            showRetroAlert(`⚙️ SECURITY MASTER CHIP: ${status}<br>Akses edit dan upload foto/musik klien sekarang aktif.`);
            clickCount = 0;
        }
        setTimeout(() => { clickCount = 0; }, 3000);
    });
});

// Sisa fungsi helper ke bawah (triggerUpload, handleImage, handleMusic) biarkan tetap seperti kemarin ya...
function triggerUpload(id) { document.getElementById(id).click(); }
function handleImage(input, prevId, slotId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.getElementById(prevId);
            img.src = e.target.result; img.style.display = 'block';
            document.getElementById(slotId).style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function handleMusic(input) {
    if (input.files && input.files[0]) {
        const audio = document.getElementById('main-audio');
        document.getElementById('track-title').innerText = "🎵 " + input.files[0].name.toUpperCase();
        audio.src = URL.createObjectURL(input.files[0]);
        audio.play();
    }
}
function handleMusic(input) {
    if (input.files && input.files[0]) {
        const audio = document.getElementById('main-audio');
        document.getElementById('track-title').innerText = "🎵 " + input.files[0].name.toUpperCase();
        audio.src = URL.createObjectURL(input.files[0]);
        audio.play();
    }
}