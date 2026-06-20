document.addEventListener("DOMContentLoaded", () => {
  const DATA = typeof retroData !== "undefined" ? retroData : {};

  let hpValue = 0;
  let score = 0;
  let arcadeCoins = 3;
  let claimedCount = 0;
  let playerLeftPercent = 50;
  let isGameRunning = true;
  let activeItems = [];

  const hpFill = document.getElementById("hp-progress");
  const hpText = document.getElementById("hp-text");
  const scoreVal = document.getElementById("score-val");
  const gameArea = document.getElementById("game-area");
  const playerBear = document.getElementById("pixel-player");

  const stageGame = document.getElementById("stage-game");
  const stageReward = document.getElementById("stage-reward");

  const audio = document.getElementById("main-audio");
  const playBtn = document.getElementById("play-btn");
  const trackTitle = document.getElementById("track-title");

  const retroModal = document.getElementById("retro-modal");
  const modalMessage = document.getElementById("modal-message");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  const btnSpin = document.getElementById("btn-spin-gacha");
  const gachaScreen = document.getElementById("gacha-screen");
  const coinCountDisplay = document.getElementById("coin-count");

  const titleTrigger = document.getElementById("arcade-title");

  let gameLoopInterval = null;
  let spawnInterval = null;

  // ================================
  // APPLY DATA
  // ================================

  document.title = DATA.title || "Retro Arcade Apology";

  if (titleTrigger) {
    titleTrigger.textContent = DATA.title || "RETRO ARCADE APOLOGY";
  }

  const subtitle = document.querySelector(".arcade-subtitle");
  if (subtitle) {
    subtitle.textContent = DATA.subtitle || "LOVE HP QUEST";
  }

  if (playerBear) {
    playerBear.textContent = DATA.playerEmoji || "🐻";
  }

  const letterBox = document.getElementById("retro-text-letter");
  if (letterBox) {
    letterBox.innerText = DATA.letterText || "";
  }

  if (audio && DATA.assets?.bgMusic) {
    audio.src = DATA.assets.bgMusic;
  }

  renderMemoryImages();

  // ================================
  // MODAL
  // ================================

  function showRetroAlert(message) {
    if (!retroModal || !modalMessage) return;
    modalMessage.innerHTML = message;
    retroModal.classList.remove("hidden");
  }

  function closeRetroAlert() {
    if (!retroModal) return;
    retroModal.classList.add("hidden");
  }

  modalCloseBtn?.addEventListener("click", closeRetroAlert);

  retroModal?.addEventListener("click", (event) => {
    if (event.target === retroModal) closeRetroAlert();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeRetroAlert();
  });

  // ================================
  // GAME CONTROL
  // ================================

  function movePlayer(direction) {
    if (!isGameRunning) return;

    const playerSpeed = 8;

    if (direction === "left") {
      playerLeftPercent -= playerSpeed;
    }

    if (direction === "right") {
      playerLeftPercent += playerSpeed;
    }

    playerLeftPercent = Math.max(6, Math.min(94, playerLeftPercent));
    playerBear.style.left = `${playerLeftPercent}%`;
  }

  document.getElementById("btn-move-left")?.addEventListener("click", () => {
    movePlayer("left");
  });

  document.getElementById("btn-move-right")?.addEventListener("click", () => {
    movePlayer("right");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") movePlayer("left");
    if (event.key === "ArrowRight") movePlayer("right");
  });

  // Touch swipe control for HP
  let touchStartX = null;

  gameArea?.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  });

  gameArea?.addEventListener("touchmove", (event) => {
    if (touchStartX === null) return;

    const touchX = event.touches[0].clientX;
    const diff = touchX - touchStartX;

    if (Math.abs(diff) > 18) {
      movePlayer(diff > 0 ? "right" : "left");
      touchStartX = touchX;
    }
  });

  // ================================
  // FALLING ITEM
  // ================================

function createFallingItem() {
  if (!isGameRunning || !gameArea) return;

  const item = document.createElement("div");
  item.className = "falling-item";

  const isGood = Math.random() > 0.35;

  const img = document.createElement("img");
  img.src = isGood
    ? DATA.assets?.happyFace || "assets/nadya-happy.png"
    : DATA.assets?.sadFace || "assets/nadya-sad.png";

  img.alt = isGood ? "Senyum" : "Mood Buruk";

  img.onerror = () => {
    item.innerHTML = isGood ? "😊" : "😡";
    item.classList.add("emoji-fallback");
  };

  item.appendChild(img);

  const randomLeft = Math.floor(Math.random() * 82) + 7;

  item.style.left = `${randomLeft}%`;
  item.style.top = "-70px";

  gameArea.appendChild(item);

  activeItems.push({
    element: item,
    leftPercent: randomLeft,
    topPx: -70,
    type: isGood ? "good" : "bad"
  });
}

  function updateGameEngine() {
    if (!isGameRunning || !gameArea || !playerBear) return;

    const gameRect = gameArea.getBoundingClientRect();
    const playerRect = playerBear.getBoundingClientRect();

    for (let i = activeItems.length - 1; i >= 0; i--) {
      const item = activeItems[i];

      item.topPx += 4.8;
      item.element.style.top = `${item.topPx}px`;

      const itemRect = item.element.getBoundingClientRect();

      const isColliding =
        itemRect.left < playerRect.right &&
        itemRect.right > playerRect.left &&
        itemRect.top < playerRect.bottom &&
        itemRect.bottom > playerRect.top;

      if (isColliding) {
        if (item.type === "good") {
          updateHP(5);
          score += 100;
        } else {
          updateHP(-5);
          score = Math.max(0, score - 50);
          showScreenShake();
        }

        scoreVal.textContent = String(score).padStart(4, "0");

        item.element.remove();
        activeItems.splice(i, 1);
        continue;
      }

      if (itemRect.top > gameRect.bottom + 20) {
        item.element.remove();
        activeItems.splice(i, 1);
      }
    }
  }

  function updateHP(amount) {
    hpValue += amount;
    hpValue = Math.max(0, Math.min(100, hpValue));

    hpFill.style.width = `${hpValue}%`;
    hpText.textContent = `${hpValue}%`;

    if (hpValue >= 100) {
      winGame();
    }
  }

  function winGame() {
    if (!isGameRunning) return;

    isGameRunning = false;

    clearInterval(gameLoopInterval);
    clearInterval(spawnInterval);

    activeItems.forEach((item) => item.element.remove());
    activeItems = [];

    if (typeof confetti === "function") {
      confetti({
        particleCount: 160,
        spread: 80,
        origin: { y: 0.62 }
      });
    }

    showRetroAlert(DATA.messages?.gameWin || "💥 ACCESS GRANTED!");

    setTimeout(() => {
      stageGame.classList.add("hidden");
      stageReward.classList.remove("hidden");
      closeRetroAlert();
    }, 1400);
  }

  function showScreenShake() {
    document.body.classList.add("shake");
    setTimeout(() => {
      document.body.classList.remove("shake");
    }, 240);
  }

  gameLoopInterval = setInterval(updateGameEngine, 30);
  spawnInterval = setInterval(createFallingItem, 850);

  // ================================
  // MUSIC
  // ================================

  playBtn?.addEventListener("click", () => {
    if (!audio || !audio.src) return;

    if (audio.paused) {
      audio.play();
      playBtn.textContent = "PAUSE";
    } else {
      audio.pause();
      playBtn.textContent = "PLAY";
    }
  });

  // ================================
  // GACHA
  // ================================

  btnSpin?.addEventListener("click", () => {
    if (arcadeCoins <= 0) {
      showRetroAlert(DATA.messages?.outOfCoins || "OUT OF COINS!");
      return;
    }

    arcadeCoins--;
    coinCountDisplay.textContent = arcadeCoins;
    btnSpin.disabled = true;
    gachaScreen.textContent = "⚡ SPINNING... ⚡";

    let spinCount = 0;

    const shuffleInterval = setInterval(() => {
      const vouchers = DATA.vouchers || [];
      const tempIndex = Math.floor(Math.random() * vouchers.length);

      gachaScreen.textContent = vouchers[tempIndex] || "🎟️ ROMANTIC VOUCHER";

      spinCount++;

      if (spinCount > 10) {
        clearInterval(shuffleInterval);

        const finalVoucher =
          vouchers[Math.floor(Math.random() * vouchers.length)] ||
          "🎟️ VOUCHER MANIS";

        gachaScreen.innerHTML = `🎉 GOT:<br>${finalVoucher}`;

        claimedCount++;

        const activeSlot = document.getElementById(`inv-${claimedCount}`);
        if (activeSlot) {
          activeSlot.innerText = finalVoucher;
          activeSlot.classList.add("claimed");
        }

        if (typeof confetti === "function") {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });

          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }

        btnSpin.disabled = false;
      }
    }, 140);
  });

  // ================================
  // FINAL BUTTON
  // ================================

  document.getElementById("btn-final-baikaan")?.addEventListener("click", () => {
    showRetroAlert(DATA.messages?.finalBaikan || "CO-OP CONNECTED!");

    if (typeof confetti === "function") {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.65 }
      });
    }
  });

  // ================================
  // ADMIN MODE
  // klik judul 5 kali
  // ================================

  let titleClickCount = 0;

  titleTrigger?.addEventListener("click", () => {
    titleClickCount++;

    if (titleClickCount === 5) {
      document.body.classList.toggle("admin-mode");

      const status = document.body.classList.contains("admin-mode")
        ? "UNLOCKED"
        : "LOCKED";

      showRetroAlert(
        `⚙️ SECURITY MASTER CHIP: ${status}<br>${DATA.messages?.adminUnlock || ""}`
      );

      titleClickCount = 0;
    }

    setTimeout(() => {
      titleClickCount = 0;
    }, 3000);
  });
});

// ================================
// MEMORY IMAGE RENDER
// ================================

function renderMemoryImages(DATA) {
  const grid = document.getElementById("memory-grid");
  if (!grid) return;

  const images = DATA?.assets?.memoryImages || [];

  grid.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    const frame = document.createElement("div");
    frame.className = "pixel-frame";
    frame.onclick = () => triggerUpload(`up-p${i + 1}`);

    const slot = document.createElement("div");
    slot.className = "img-slot";

    const img = document.createElement("img");
    img.id = `prev-p${i + 1}`;

    const placeholder = document.createElement("span");
    placeholder.id = `slot-p${i + 1}`;
    placeholder.textContent = "📁 LOAD_IMG";

    if (images[i]) {
      img.src = images[i];
      img.style.display = "block";
      slot.classList.add("has-image");
      placeholder.style.display = "none";
    } else {
      img.style.display = "none";
      slot.classList.remove("has-image");
      placeholder.style.display = "grid";
    }

    img.onerror = () => {
      img.style.display = "none";
      slot.classList.remove("has-image");
      placeholder.style.display = "grid";
    };

    const input = document.createElement("input");
    input.type = "file";
    input.id = `up-p${i + 1}`;
    input.accept = "image/*";
    input.onchange = () => handleImage(input, img.id, placeholder.id);

    slot.appendChild(img);
    slot.appendChild(placeholder);

    frame.appendChild(slot);
    frame.appendChild(input);

    grid.appendChild(frame);
  }
}

// ================================
// HELPER UPLOAD
// ================================

function triggerUpload(id) {
  if (!document.body.classList.contains("admin-mode")) return;

  const input = document.getElementById(id);
  if (input) input.click();
}

function handleImage(input, prevId, slotId) {
  if (!input.files || !input.files[0]) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const img = document.getElementById(prevId);
    const slot = document.getElementById(slotId);

    img.src = event.target.result;
    img.style.display = "block";

    if (slot) slot.style.display = "none";
  };

  reader.readAsDataURL(input.files[0]);
}

function handleMusic(input) {
  if (!input.files || !input.files[0]) return;

  const audio = document.getElementById("main-audio");
  const trackTitle = document.getElementById("track-title");

  if (!audio) return;

  audio.src = URL.createObjectURL(input.files[0]);

  if (trackTitle) {
    trackTitle.innerText = "🎵 " + input.files[0].name.toUpperCase();
  }

  audio.play();
}