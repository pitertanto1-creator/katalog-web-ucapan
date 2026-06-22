document.addEventListener("DOMContentLoaded", () => {
  const DATA = window.retroData || retroData;

  let hpValue = 0;
  let score = 0;
  let playerLeft = 50;
  let isGameRunning = true;
  let activeItems = [];

  let coins = 3;
  let claimedVoucher = 0;

  const titleEl = document.getElementById("arcade-title");
  const subtitleEl = document.getElementById("arcade-subtitle");
  const scoreEl = document.getElementById("score-val");

  const gameArea = document.getElementById("game-area");
  const player = document.getElementById("pixel-player");

  const hpProgress = document.getElementById("hp-progress");
  const hpText = document.getElementById("hp-text");

  const stageGame = document.getElementById("stage-game");
  const stageReward = document.getElementById("stage-reward");

  const audio = document.getElementById("main-audio");
  const playBtn = document.getElementById("play-btn");
  const musicFile = document.getElementById("music-file");

  const modal = document.getElementById("retro-modal");
  const modalMessage = document.getElementById("modal-message");
  const modalClose = document.getElementById("modal-close");

  const spinBtn = document.getElementById("btn-spin-gacha");
  const gachaScreen = document.getElementById("gacha-screen");
  const coinCount = document.getElementById("coin-count");

  titleEl.textContent = DATA.title || "RETRO ARCADE APOLOGY";
  subtitleEl.textContent = DATA.subtitle || "LOVE HP QUEST";
  player.textContent = DATA.playerEmoji || "🐻";

  document.getElementById("letter-box").innerText = DATA.letterText || "";

  if (audio && DATA.assets && DATA.assets.bgMusic) {
    audio.src = DATA.assets.bgMusic;
  }

  renderMemoryImages(DATA);

  function showModal(message) {
    modalMessage.innerHTML = message;
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  function movePlayer(direction) {
    if (!isGameRunning) return;

    if (direction === "left") {
      playerLeft -= 8;
    }

    if (direction === "right") {
      playerLeft += 8;
    }

    playerLeft = Math.max(7, Math.min(93, playerLeft));
    player.style.left = `${playerLeft}%`;
  }

  const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");

function bindMoveButton(button, direction) {
  if (!button) return;

  button.addEventListener("click", (event) => {
    event.preventDefault();
    movePlayer(direction);
  });

  button.addEventListener(
    "touchstart",
    (event) => {
      event.preventDefault();
      movePlayer(direction);
    },
    { passive: false }
  );
}

bindMoveButton(btnLeft, "left");
bindMoveButton(btnRight, "right");

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") movePlayer("left");
    if (event.key === "ArrowRight") movePlayer("right");
    if (event.key === "Escape") closeModal();
  });

  let touchStartX = null;

  gameArea.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  });

  gameArea.addEventListener("touchmove", (event) => {
    if (touchStartX === null) return;

    const touchX = event.touches[0].clientX;
    const diff = touchX - touchStartX;

    if (Math.abs(diff) > 18) {
      movePlayer(diff > 0 ? "right" : "left");
      touchStartX = touchX;
    }
  });

  function createFallingItem() {
    if (!isGameRunning) return;

    const item = document.createElement("div");
    item.className = "falling-item";

    const isGood = Math.random() > 0.35;

    const img = document.createElement("img");
    img.src = isGood
      ? DATA.assets.happyFace
      : DATA.assets.sadFace;

    img.alt = isGood ? "Senyum Manis" : "Mood Buruk";

    img.onerror = () => {
      item.innerHTML = isGood ? "😊" : "😡";
      item.classList.add("emoji-fallback");
    };

    item.appendChild(img);

    const left = Math.floor(Math.random() * 82) + 8;

    item.style.left = `${left}%`;
    item.style.top = "-70px";

    gameArea.appendChild(item);

    activeItems.push({
      element: item,
      top: -70,
      type: isGood ? "good" : "bad"
    });
  }

  function updateGame() {
    if (!isGameRunning) return;

    const gameRect = gameArea.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    for (let i = activeItems.length - 1; i >= 0; i--) {
      const item = activeItems[i];

      item.top += 4.8;
      item.element.style.top = `${item.top}px`;

      const itemRect = item.element.getBoundingClientRect();

      const hit =
        itemRect.left < playerRect.right &&
        itemRect.right > playerRect.left &&
        itemRect.top < playerRect.bottom &&
        itemRect.bottom > playerRect.top;

      if (hit) {
        if (item.type === "good") {
          updateHP(5);
          score += 100;
        } else {
          updateHP(-5);
          score = Math.max(0, score - 50);
          shakeScreen();
        }

        scoreEl.textContent = String(score).padStart(4, "0");

        item.element.remove();
        activeItems.splice(i, 1);
        continue;
      }

      if (itemRect.top > gameRect.bottom + 30) {
        item.element.remove();
        activeItems.splice(i, 1);
      }
    }
  }

  function updateHP(amount) {
    hpValue += amount;
    hpValue = Math.max(0, Math.min(100, hpValue));

    hpProgress.style.width = `${hpValue}%`;
    hpText.textContent = `${hpValue}%`;

    if (hpValue >= 100) {
      finishGame();
    }
  }

  function finishGame() {
    isGameRunning = false;

    clearInterval(spawnTimer);
    clearInterval(gameTimer);

    activeItems.forEach((item) => item.element.remove());
    activeItems = [];

    if (typeof confetti === "function") {
      confetti({
        particleCount: 160,
        spread: 80,
        origin: { y: 0.62 }
      });
    }

    showModal(DATA.messages.gameWin);

    setTimeout(() => {
      closeModal();
      stageGame.classList.add("hidden");
      stageReward.classList.remove("hidden");

      if (audio && audio.src) {
        audio.play().catch(() => {});
      }
    }, 1500);
  }

  function shakeScreen() {
    document.body.classList.add("shake");

    setTimeout(() => {
      document.body.classList.remove("shake");
    }, 240);
  }

  const spawnTimer = setInterval(createFallingItem, 850);
  const gameTimer = setInterval(updateGame, 30);

  playBtn.addEventListener("click", () => {
    if (!audio || !audio.src) return;

    if (audio.paused) {
      audio.play();
      playBtn.textContent = "PAUSE";
    } else {
      audio.pause();
      playBtn.textContent = "PLAY";
    }
  });

  musicFile.addEventListener("change", () => {
    if (!musicFile.files || !musicFile.files[0]) return;

    audio.src = URL.createObjectURL(musicFile.files[0]);
    audio.play().catch(() => {});
  });

  spinBtn.addEventListener("click", () => {
    if (coins <= 0) {
      showModal(DATA.messages.outOfCoins);
      return;
    }

    coins--;
    coinCount.textContent = coins;
    spinBtn.disabled = true;

    let spinCount = 0;

    const spinInterval = setInterval(() => {
      const randomVoucher =
        DATA.vouchers[Math.floor(Math.random() * DATA.vouchers.length)];

      gachaScreen.innerHTML = randomVoucher;

      spinCount++;

      if (spinCount >= 10) {
        clearInterval(spinInterval);

        const finalVoucher =
          DATA.vouchers[Math.floor(Math.random() * DATA.vouchers.length)];

        gachaScreen.innerHTML = `🎉 GOT:<br>${finalVoucher}`;

        claimedVoucher++;

        const slot = document.getElementById(`inv-${claimedVoucher}`);
        if (slot) {
          slot.textContent = finalVoucher;
          slot.classList.add("claimed");
        }

        if (typeof confetti === "function") {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.7 }
          });
        }

        spinBtn.disabled = false;
      }
    }, 120);
  });

  document.getElementById("btn-final").addEventListener("click", () => {
    showModal(DATA.messages.finalBaikan);

    if (typeof confetti === "function") {
      confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.65 }
      });
    }
  });

  let titleClick = 0;

  titleEl.addEventListener("click", () => {
    titleClick++;

    if (titleClick >= 5) {
      document.body.classList.toggle("admin-mode");
      showModal(DATA.messages.adminUnlock);
      titleClick = 0;
    }

    setTimeout(() => {
      titleClick = 0;
    }, 3000);
  });
});

function renderMemoryImages(DATA) {
  const grid = document.getElementById("memory-grid");
  if (!grid) return;

  const images = DATA.assets.memoryImages || [];

  grid.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    const frame = document.createElement("div");
    frame.className = "pixel-frame";

    const slot = document.createElement("div");
    slot.className = "img-slot";

    const img = document.createElement("img");
    img.id = `prev-p${i + 1}`;

    const placeholder = document.createElement("span");
    placeholder.textContent = "📁 LOAD_IMG";

    const imageSource = images[i];

    if (imageSource) {
      img.src = imageSource;
      img.style.display = "block";
      slot.classList.add("has-image");
      placeholder.style.display = "none";
    } else {
      img.style.display = "none";
      placeholder.style.display = "grid";
    }

    img.onerror = () => {
      img.style.display = "none";
      slot.classList.remove("has-image");
      placeholder.style.display = "grid";
    };

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.addEventListener("change", () => {
      handleImageUpload(input, img, placeholder, slot);
    });

    frame.addEventListener("click", () => {
      if (!document.body.classList.contains("admin-mode")) return;
      input.click();
    });

    slot.appendChild(img);
    slot.appendChild(placeholder);

    frame.appendChild(slot);
    frame.appendChild(input);

    grid.appendChild(frame);
  }
}

function handleImageUpload(input, img, placeholder, slot) {
  if (!input.files || !input.files[0]) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    img.src = event.target.result;
    img.style.display = "block";

    slot.classList.add("has-image");
    placeholder.style.display = "none";
  };

  reader.readAsDataURL(input.files[0]);
}