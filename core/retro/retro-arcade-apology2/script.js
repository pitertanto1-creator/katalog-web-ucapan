document.addEventListener("DOMContentLoaded", () => {
  const DATA = window.MEMORY_CAPSULE_DATA || MEMORY_CAPSULE_DATA;

  const titleEl = document.getElementById("app-title");
  const subtitleEl = document.getElementById("app-subtitle");
  const progressLabel = document.getElementById("progress-label");

  const memoryGrid = document.getElementById("memory-grid");
  const hpFill = document.getElementById("hp-progress");
  const hpText = document.getElementById("hp-text");
  const scoreText = document.getElementById("score-text");

  const stageGame = document.getElementById("stage-game");
  const stageReward = document.getElementById("stage-reward");
  const machineScreen = document.querySelector(".machine-screen");

  const letterText = document.getElementById("letter-text");
  const timelineList = document.getElementById("timeline-list");
  const galleryGrid = document.getElementById("gallery-grid");

  const modal = document.getElementById("retro-modal");
  const modalMessage = document.getElementById("modal-message");
  const modalClose = document.getElementById("modal-close");

  const lockPeaceBtn = document.getElementById("btn-lock-peace");

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchedPairs = 0;
  let score = 0;
  let titleClickCount = 0;

  const totalPairs = DATA.cards.length;

  initContent();
  createMemoryCards();

  function initContent() {
    titleEl.textContent = DATA.title;
    subtitleEl.textContent = DATA.subtitle;
    progressLabel.textContent = DATA.progressLabel;
    hpText.textContent = `0/${totalPairs} PAIRS`;
    letterText.textContent = DATA.mainLetterText;

    renderTimeline();
    renderGallery();
    bindOpenWhenButtons();
  }

  function duplicateAndShuffleCards(cards) {
    const duplicated = [];

    cards.forEach((card) => {
      duplicated.push({ ...card, pairKey: card.id, uniqueKey: `${card.id}-a` });
      duplicated.push({ ...card, pairKey: card.id, uniqueKey: `${card.id}-b` });
    });

    for (let i = duplicated.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [duplicated[i], duplicated[randomIndex]] = [
        duplicated[randomIndex],
        duplicated[i]
      ];
    }

    return duplicated;
  }

  function createMemoryCards() {
    const cards = duplicateAndShuffleCards(DATA.cards);

    memoryGrid.innerHTML = "";

    cards.forEach((cardData) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "memory-card";
      card.dataset.pair = cardData.pairKey;
      card.dataset.unique = cardData.uniqueKey;
      card.setAttribute("aria-label", `Open ${cardData.code}`);

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <img src="${cardData.image}" alt="${cardData.alt}" />
            <span class="card-code">${cardData.code}</span>
          </div>
          <div class="card-back">
            <span class="card-back-symbol">💠</span>
          </div>
        </div>
      `;

      const img = card.querySelector("img");

      img.onerror = () => {
        img.style.display = "none";
        const front = card.querySelector(".card-front");
        front.innerHTML = `<span class="card-code">${cardData.code}</span>`;
        front.style.display = "grid";
        front.style.placeItems = "center";
      };

      card.addEventListener("click", () => flipCard(card));

      memoryGrid.appendChild(card);
    });
  }

  function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains("matched")) return;

    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    checkMatch();
  }

  function checkMatch() {
    const isMatch = firstCard.dataset.pair === secondCard.dataset.pair;

    if (isMatch) {
      handleMatch();
      return;
    }

    handleMismatch();
  }

  function handleMatch() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matchedPairs++;
    score += 250;

    updateProgress();
    resetBoard();

    if (matchedPairs >= totalPairs) {
      setTimeout(showRewardStage, 800);
    }
  }

  function handleMismatch() {
    lockBoard = true;
    score = Math.max(0, score - 50);
    updateScore();

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 850);
  }

  function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function updateProgress() {
    const progressPercent = (matchedPairs / totalPairs) * 100;

    hpFill.style.width = `${progressPercent}%`;
    hpText.textContent = `${matchedPairs}/${totalPairs} PAIRS`;

    updateScore();
  }

  function updateScore() {
    scoreText.textContent = `SCORE: ${String(score).padStart(4, "0")}`;
  }

  function showRewardStage() {
    showModal(DATA.winMessage);

    stageGame.classList.add("hidden");
    stageReward.classList.remove("hidden");

    machineScreen.scrollTop = 0;

    if (typeof confetti === "function") {
      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.62 }
      });
    }
  }

  function renderTimeline() {
    timelineList.innerHTML = "";

    DATA.timeline.forEach((item) => {
      const row = document.createElement("div");
      row.className = "timeline-item";

      row.innerHTML = `
        <span class="timeline-date">${item.date}</span>
        <p class="timeline-desc">${item.desc}</p>
      `;

      timelineList.appendChild(row);
    });
  }

  function renderGallery() {
    galleryGrid.innerHTML = "";

    const savedGallery = loadSavedGallery();

    DATA.gallery.forEach((item, index) => {
      const frame = document.createElement("div");
      frame.className = "gallery-frame";

      const slot = document.createElement("div");
      slot.className = "gallery-slot";

      const img = document.createElement("img");
      img.alt = item.label;

      const placeholder = document.createElement("div");
      placeholder.className = "gallery-placeholder";
      placeholder.innerHTML = `
        <div>
          <strong>+</strong>
          <span>${item.label}</span>
        </div>
      `;

      const savedImage = savedGallery[index];
      const imageSource = savedImage || item.image;

      if (imageSource) {
        img.src = imageSource;
        img.style.display = "block";
        slot.classList.add("has-image");
      } else {
        img.style.display = "none";
      }

      img.onerror = () => {
        img.style.display = "none";
        slot.classList.remove("has-image");
      };

      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.addEventListener("change", () => {
        handleGalleryUpload(input, img, slot, index);
      });

      frame.addEventListener("click", () => {
        if (!document.body.classList.contains("admin-mode")) return;
        input.click();
      });

      slot.appendChild(img);
      slot.appendChild(placeholder);
      frame.appendChild(slot);
      frame.appendChild(input);

      galleryGrid.appendChild(frame);
    });
  }

  function handleGalleryUpload(input, img, slot, index) {
    if (!input.files || !input.files[0]) return;

    resizeImageToBase64(input.files[0], 1200, 0.86, (base64Image) => {
      img.src = base64Image;
      img.style.display = "block";
      slot.classList.add("has-image");

      const savedGallery = loadSavedGallery();
      savedGallery[index] = base64Image;

      localStorage.setItem(
        "midnightMemoryCapsuleGallery",
        JSON.stringify(savedGallery)
      );
    });
  }

  function loadSavedGallery() {
    try {
      const saved = localStorage.getItem("midnightMemoryCapsuleGallery");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  }

  function resizeImageToBase64(file, maxSize, quality, callback) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > width && height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        } else if (width === height && width > maxSize) {
          width = maxSize;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, width, height);

        callback(canvas.toDataURL("image/jpeg", quality));
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  }

  function bindOpenWhenButtons() {
    const buttons = document.querySelectorAll("[data-letter]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const type = button.dataset.letter;
        const message = DATA.emergencyLetters[type];

        showModal(message || "Memory chip belum tersedia.");
      });
    });
  }

  function showModal(message) {
    modalMessage.textContent = message;
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  lockPeaceBtn.addEventListener("click", () => {
    machineScreen.classList.add("screen-shake");

    setTimeout(() => {
      machineScreen.classList.remove("screen-shake");
    }, 350);

    showModal(DATA.lockPeaceMessage);

    lockPeaceBtn.textContent = "🔒 PEACE LOCKED & SECURED";
    lockPeaceBtn.disabled = true;

    if (typeof confetti === "function") {
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.7 }
      });
    }
  });

  titleEl.addEventListener("click", () => {
    titleClickCount++;

    if (titleClickCount >= 5) {
      document.body.classList.toggle("admin-mode");
      showModal(
        document.body.classList.contains("admin-mode")
          ? "⚙️ ADMIN MODE ACTIVE\n\nKlik foto gallery untuk upload sementara. Foto akan tersimpan di browser ini."
          : "⚙️ ADMIN MODE OFF"
      );
      titleClickCount = 0;
    }

    setTimeout(() => {
      titleClickCount = 0;
    }, 3000);
  });
});