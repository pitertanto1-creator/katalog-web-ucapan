// script.js - SYSTEM ENGINE GAME BALON & KAFE MEMORI
document.addEventListener("DOMContentLoaded", () => {
    
    // ==================== LOGIKA STAGE 0: BALLOON POP ====================
    const balloonArea = document.getElementById('balloon-area');
    const balloonScoreEl = document.getElementById('balloon-score');
    
    let currentScore = 0;
    let balloonSpawnInterval = null;
    let isBalloonGameActive = true;

    function createBalloon() {
        if (!isBalloonGameActive || !balloonArea) return;

        const balloonList = CUTE_CAFE_DATA.balloonGame.balloons;
        const randomIcon = balloonList[Math.floor(Math.random() * balloonList.length)];

        const balloonNode = document.createElement('div');
        balloonNode.className = 'flying-balloon';
        balloonNode.innerText = randomIcon;

        // Hitung lebar area monitor secara presisi agar tidak meluber ke luar
        const areaWidth = balloonArea.clientWidth - 40;
        const randomX = Math.floor(Math.random() * areaWidth);
        
        // MENYUNTIKKAN KOORDINAT HORIZONTAL ACAK SECARA BENAR
        balloonNode.style.left = randomX + 'px';

        // Beri variasi kecepatan meluncur biar lebih seru (2 hingga 4 detik)
        const speed = (Math.random() * 2) + 2;
        balloonNode.style.animationDuration = speed + 's';

        // AKSI JIKA BALON DI-KLIK ATAU DI-TAP KEKASIH
        balloonNode.addEventListener('click', function(e) {
            if (!isBalloonGameActive) return;
            e.stopPropagation();

            // Ambil posisi balon saat ini untuk memunculkan efek percikan bintang
            const currentLeft = this.style.left;
            const currentTop = this.offsetTop;

            triggerPopEffect(currentLeft, currentTop);

            currentScore++;
            balloonScoreEl.innerText = currentScore;

            // Langsung hapus objek balon yang pecah
            this.remove();

            // KONDISI MENANG: JIKA CAPAI 10 SKOR -> MASUK KE TEKA-TEKI KAFE
            if (currentScore >= CUTE_CAFE_DATA.balloonGame.targetScore) {
                endBalloonGame();
            }
        });

        // Hapus elemen jika balon lolos terbang ke atas luar monitor
        balloonNode.addEventListener('animationend', () => {
            balloonNode.remove();
        });

        balloonArea.appendChild(balloonNode);
    }

    function triggerPopEffect(leftPos, topPos) {
        const effectNode = document.createElement('div');
        effectNode.className = 'pop-effect';
        effectNode.innerText = "✨💖";
        effectNode.style.left = leftPos;
        effectNode.style.top = topPos + 'px';
        
        balloonArea.appendChild(effectNode);
        setTimeout(() => effectNode.remove(), 400);
    }

    function endBalloonGame() {
        isBalloonGameActive = false;
        clearInterval(balloonSpawnInterval);
        
        const remnants = document.querySelectorAll('.flying-balloon');
        remnants.forEach(r => r.remove());

        // Ganti layar ke stage teka-teki
        document.getElementById('stage-balloon-game').classList.add('hidden');
        document.getElementById('stage-game').classList.remove('hidden');
        loadOrder();
    }

    if (balloonArea) {
        // Meluncurkan balon baru setiap 0.7 detik sekali
        balloonSpawnInterval = setInterval(createBalloon, 700);
    }


    // ==================== LOGIKA STAGE 1 & 2: TEKA TEKI KAFE MEMORI ====================
    let currentOrderIndex = 0;
    const ordersData = CUTE_CAFE_DATA.cafeOrders;

    const menuNameEl = document.getElementById('current-menu-name');
    const menuHintEl = document.getElementById('current-menu-hint');
    const answerInput = document.getElementById('cafe-answer-input');
    const submitBtn = document.getElementById('btn-submit-order');
    const errorAlert = document.getElementById('error-alert');
    const progressEl = document.getElementById('order-progress');

    function loadOrder() {
        if (currentOrderIndex < ordersData.length) {
            const currentOrder = ordersData[currentOrderIndex];
            menuNameEl.innerText = currentOrder.menuName;
            menuHintEl.innerText = currentOrder.hintText;
            answerInput.value = "";
            errorAlert.classList.add('hidden');
            progressEl.innerText = `Progress: ${currentOrderIndex}/${ordersData.length}`;
        } else {
            document.getElementById('stage-game').classList.add('hidden');
            document.getElementById('stage-reward').classList.remove('hidden');
            buildCuteRewardScreen();
        }
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const userInput = answerInput.value.trim().toLowerCase();
            const correctAnswer = ordersData[currentOrderIndex].correctAnswer.toLowerCase();

            if (userInput === correctAnswer) {
                currentOrderIndex++;
                loadOrder();
            } else {
                errorAlert.classList.remove('hidden');
            }
        });
    }

    if (answerInput) {
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitBtn.click();
        });
    }

    function buildCuteRewardScreen() {
        document.getElementById('cafe-letter-text').innerText = CUTE_CAFE_DATA.grandOpeningLetter;
        const polaroidHolder = document.getElementById('polaroid-holder');
        polaroidHolder.innerHTML = "";
        
        CUTE_CAFE_DATA.polaroidGallery.forEach(item => {
            const card = document.createElement('div');
            card.className = "polaroid-card";
            card.innerHTML = `<img src="${item.imageSrc}"><div class="polaroid-text">VIEW MEMORY</div>`;
            card.addEventListener('click', () => { triggerCuteModal(`💝 MEMORY SNAPSHOT:\n"${item.caption}"`); });
            polaroidHolder.appendChild(card);
        });

        const wishlistHolder = document.getElementById('wishlist-holder');
        wishlistHolder.innerHTML = "";
        CUTE_CAFE_DATA.loveWishlist.forEach((wishText, idx) => {
            const item = document.createElement('div');
            item.className = "wishlist-item";
            item.innerHTML = `<input type="checkbox" id="wish-${idx}"><label style="cursor:pointer;" for="wish-${idx}">${wishText}</label>`;
            wishlistHolder.appendChild(item);
        });
    }

    const btnCuteLock = document.getElementById('btn-cute-lock');
    if (btnCuteLock) {
        btnCuteLock.addEventListener('click', function() {
            triggerCuteModal(CUTE_CAFE_DATA.finalPeaceMessage);
            this.innerText = "💖 PEACE LOCKED 💖";
            this.style.background = "#ffb6c1";
            this.disabled = true;
        });
    }

    function triggerCuteModal(message) {
        document.getElementById('cute-modal-message').innerText = message;
        document.getElementById('cute-modal').classList.remove('hidden');
    }
});