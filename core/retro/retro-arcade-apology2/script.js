document.addEventListener("DOMContentLoaded", () => {
  const DATA = window.ANNIVERSARY_DATA || ANNIVERSARY_DATA;

  const appTitle = document.getElementById("app-title");
  const appSubtitle = document.getElementById("app-subtitle");
  const coupleNames = document.getElementById("couple-names");
  const anniversaryDate = document.getElementById("anniversary-date");

  const memoryGrid = document.getElementById("memory-grid");
  const progressLabel = document.getElementById("progress-label");
  const progressText = document.getElementById("progress-text");
  const progressFill = document.getElementById("progress-fill");
  const scoreText = document.getElementById("score-text");

  const stageGame = document.getElementById("stage-game");
  const stageReward = document.getElementById("stage-reward");
  const screenCard = document.querySelector(".screen-card");

  const letterText = document.getElementById("letter-text");
  const timelineList = document.getElementById("timeline-list");
  const galleryGrid = document.getElementById("gallery-grid");

  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  const modalClose = document.getElementById("modal-close");

  const btnFinal = document.getElementById("btn-final");
  const btnClaimVoucher = document.getElementById("btn-claim-voucher");
  const voucherDisplay = document.getElementById("voucher-display");
  const voucherInventory = document.getElementById("voucher-inventory");
  const voucherCount = document.getElementById("voucher-count");

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchedPairs = 0;
  let score = 0;
  let titleClickCount = 0;

  let claimedVouchers = [];
  const maxVoucherClaim = 3;

  const totalPairs = DATA.cards.length;

  initPage();
  createMemoryCards();

  function initPage() {
    appTitle.textContent = DATA.title;
    appSubtitle.textContent = DATA.subtitle;
    coupleNames.textContent = DATA.coupleNames;
    anniversaryDate.textContent = DATA.anniversaryDate;
    progressLabel.textContent = DATA.progressLabel;
    progressText.textContent = `0/${totalPairs} PAIRS`;

    letterText.textContent = DATA.mainLetterText;

    renderTimeline();
    renderGallery();
    bindOpenWhenButtons();
    updateVoucherUI();
  }

  function duplicateAndShuffle(cards) {
    const result = [];

    cards.forEach((card) => {
      result.push({ ...card, pairKey: card.id, uniqueKey: `${card.id}-a` });
      result.push({ ...card, pairKey: card.id, uniqueKey: `${card.id}-b` });
    });

    for (let i = result.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
    }

    return result;
  }

  function createMemoryCards() {
    const cards = duplicateAndShuffle(DATA.cards);

    memoryGrid.innerHTML = "";

    cards.forEach((cardData) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "memory-card";
      card.dataset.pair = cardData.pairKey;
      card.dataset.unique = cardData.uniqueKey;
      card.setAttribute("aria-label", cardData.desc);

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-front">
            <div>
              <span class="card-symbol">${cardData.icon}</span>
              <span class="card-label">${cardData.label}</span>
            </div>
          </div>

          <div class="card-face card-back">
            <div class="card-back-content">
              <span class="card-back-icon">♡</span>
              <span class="card-back-text">MEMORY</span>
            </div>
          </div>
        </div>
      `;

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
    } else {
      handleMismatch();
    }
  }

  function handleMatch() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matchedPairs++;
    score += 200;

    updateProgress();
    resetBoard();

    if (matchedPairs >= totalPairs) {
      setTimeout(showReward, 850);
    }
  }

  function handleMismatch() {
    lockBoard = true;
    score = Math.max(0, score - 50);
    updateScore();

    screenCard.classList.add("screen-shake");

    setTimeout(() => {
      screenCard.classList.remove("screen-shake");
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
    const percent = (matchedPairs / totalPairs) * 100;

    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${matchedPairs}/${totalPairs} PAIRS`;

    updateScore();
  }

  function updateScore() {
    scoreText.textContent = String(score).padStart(4, "0");
  }

  function showReward() {
    stageGame.classList.add("hidden");
    stageReward.classList.remove("hidden");
    screenCard.scrollTop = 0;

    showModal(DATA.winMessage);

    if (typeof confetti === "function") {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.65 }
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

      const imageSource = savedGallery[index] || item.image;

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
        "anniversaryMemoryGallery",
        JSON.stringify(savedGallery)
      );
    });
  }

  function loadSavedGallery() {
    try {
      const saved = localStorage.getItem("anniversaryMemoryGallery");
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
        const message = DATA.openWhenLetters[type];

        showModal(message || "Pesan belum tersedia.");
      });
    });
  }

  function claimVoucher() {
    if (claimedVouchers.length >= maxVoucherClaim) {
      showModal("🎟️ Semua love voucher sudah berhasil diklaim.");
      return;
    }

    const available = DATA.vouchers.filter((voucher) => {
      return !claimedVouchers.some((claimed) => claimed.title === voucher.title);
    });

    if (available.length === 0) {
      showModal("Voucher sudah habis.");
      return;
    }

    const randomVoucher = available[Math.floor(Math.random() * available.length)];

    claimedVouchers.push(randomVoucher);
    updateVoucherUI(randomVoucher);

    if (typeof confetti === "function") {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.72 }
      });
    }
  }

  function updateVoucherUI(latestVoucher = null) {
    voucherCount.textContent = `${claimedVouchers.length}/${maxVoucherClaim} CLAIMED`;

    if (latestVoucher) {
      voucherDisplay.innerHTML = `
        <div class="voucher-result">
          <strong>${latestVoucher.icon}</strong>
          <h3>${latestVoucher.title}</h3>
          <p>${latestVoucher.desc}</p>
        </div>
      `;
    }

    voucherInventory.innerHTML = "";

    claimedVouchers.forEach((voucher, index) => {
      const item = document.createElement("div");
      item.className = "voucher-item";
      item.textContent = `${index + 1}. ${voucher.icon} ${voucher.title}`;

      voucherInventory.appendChild(item);
    });

    if (claimedVouchers.length >= maxVoucherClaim) {
      btnClaimVoucher.disabled = true;
      btnClaimVoucher.textContent = "ALL VOUCHERS CLAIMED";
    }
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
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  btnClaimVoucher.addEventListener("click", claimVoucher);

  btnFinal.addEventListener("click", () => {
    screenCard.classList.add("screen-shake");

    setTimeout(() => {
      screenCard.classList.remove("screen-shake");
    }, 350);

    showModal(DATA.finalMessage);

    btnFinal.textContent = "🔒 ANNIVERSARY PROMISE LOCKED";
    btnFinal.disabled = true;

    if (typeof confetti === "function") {
      confetti({
        particleCount: 170,
        spread: 100,
        origin: { y: 0.7 }
      });
    }
  });

  appTitle.addEventListener("click", () => {
    titleClickCount++;

    if (titleClickCount >= 5) {
      document.body.classList.toggle("admin-mode");

      showModal(
        document.body.classList.contains("admin-mode")
          ? "ADMIN MODE ACTIVE\n\nKlik foto gallery untuk upload sementara. Foto tersimpan di browser ini."
          : "ADMIN MODE OFF"
      );

      titleClickCount = 0;
    }

    setTimeout(() => {
      titleClickCount = 0;
    }, 3000);
  });
});