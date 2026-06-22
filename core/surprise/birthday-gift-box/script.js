/* ===============================
   Secret Birthday Box - script.js
   Vanilla JavaScript only
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const MAX_TAP = 10;

  let tapCount = 0;
  let currentSlide = 0;
  let isUnlocked = false;

  const $ = (selector) => document.querySelector(selector);

  const openingStage = $("#openingStage");
  const revealStage = $("#revealStage");

  const openingSubtitle = $("#openingSubtitle");
  const giftButton = $("#giftButton");
  const giftImage = $("#giftImage");
  const tapCounter = $("#tapCounter");
  const progressFill = $("#progressFill");
  const tapLine = $("#tapLine");

  const revealTitle = $("#revealTitle");
  const revealSubtitle = $("#revealSubtitle");
  const letterContent = $("#letterContent");

  const galleryImage = $("#galleryImage");
  const galleryCaption = $("#galleryCaption");
  const galleryDots = $("#galleryDots");
  const prevSlide = $("#prevSlide");
  const nextSlide = $("#nextSlide");

  const musicCover = $("#musicCover");
  const musicTitle = $("#musicTitle");
  const musicArtist = $("#musicArtist");
  const birthdayAudio = $("#birthdayAudio");
  const playPauseBtn = $("#playPauseBtn");
  const musicProgress = $("#musicProgress");
  const currentTime = $("#currentTime");
  const durationTime = $("#durationTime");

  const openVoucherBtn = $("#openVoucherBtn");
  const voucherBannerTitle = $("#voucherBannerTitle");
  const voucherModal = $("#voucherModal");
  const voucherTitle = $("#voucherTitle");
  const voucherDescription = $("#voucherDescription");
  const voucherFor = $("#voucherFor");
  const voucherCode = $("#voucherCode");
  const claimVoucherBtn = $("#claimVoucherBtn");
  const claimMessage = $("#claimMessage");

  function safeData() {
    if (typeof DATA === "undefined") {
      console.error("DATA tidak ditemukan. Pastikan data.js dimuat sebelum script.js.");
      return null;
    }

    return DATA;
  }

  function init() {
    const data = safeData();
    if (!data) return;

    renderOpening(data);
    renderReveal(data);
    setupGiftFallback();
    setupOpeningTap(data);
    setupGallery(data.gallery || []);
    setupMusic(data.music || {});
    setupVoucher(data.voucher || {});
  }

  /* ===============================
     Render data
  ================================ */

  function renderOpening(data) {
    openingSubtitle.textContent = data.openingSubtitle || "";
    tapLine.textContent = "Tap kadonya dulu ya...";
    updateTapProgress();
  }

  function renderReveal(data) {
    revealTitle.textContent = data.revealTitle || "Happy Birthday!";
    revealSubtitle.textContent = data.revealSubtitle || "";

    letterContent.innerHTML = "";

    const letter = Array.isArray(data.letter) ? data.letter : [];

    if (!letter.length) {
      const emptyText = document.createElement("p");
      emptyText.textContent = "Surat ulang tahun belum diisi.";
      letterContent.appendChild(emptyText);
      return;
    }

    letter.forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      letterContent.appendChild(p);
    });
  }

  /* ===============================
     Opening gift interaction
  ================================ */

  function setupGiftFallback() {
    if (!giftImage) return;

    giftImage.addEventListener("error", () => {
      giftButton.classList.add("use-fallback");
    });
  }

  function setupOpeningTap(data) {
    giftButton.addEventListener("click", () => {
      if (isUnlocked) return;

      tapCount = Math.min(tapCount + 1, MAX_TAP);

      const intensity = 2 + tapCount * 1.3;
      const rotate = 2 + tapCount * 0.7;

      giftButton.style.setProperty("--shake-x", `${intensity}px`);
      giftButton.style.setProperty("--shake-r", `${rotate}deg`);

      giftButton.classList.remove("is-shaking");
      void giftButton.offsetWidth;
      giftButton.classList.add("is-shaking");

      const lines = Array.isArray(data.tapLines) ? data.tapLines : [];
      tapLine.textContent = lines[tapCount - 1] || `Tap ke-${tapCount}!`;

      updateTapProgress();

      if (tapCount >= MAX_TAP) {
        unlockGift();
      }
    });

    giftButton.addEventListener("animationend", () => {
      giftButton.classList.remove("is-shaking");
    });
  }

  function updateTapProgress() {
    const percent = (tapCount / MAX_TAP) * 100;
    tapCounter.textContent = `${tapCount}/${MAX_TAP}`;
    progressFill.style.width = `${percent}%`;
  }

  function unlockGift() {
    isUnlocked = true;
    giftButton.classList.remove("is-shaking");
    giftButton.classList.add("is-final");
    giftButton.setAttribute("aria-disabled", "true");

    fireConfetti();

    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      switchToRevealStage();
    }, 2000);
  }

  function fireConfetti() {
    if (typeof confetti !== "function") return;

    const end = Date.now() + 1300;

    const colors = ["#ff5fa2", "#ffc857", "#7c4dff", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors
      });

      confetti({
        particleCount: 5,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    confetti({
      particleCount: 110,
      spread: 90,
      startVelocity: 36,
      origin: { y: 0.62 },
      colors
    });
  }

  function switchToRevealStage() {
    openingStage.classList.add("is-leaving");

    window.setTimeout(() => {
      openingStage.classList.remove("is-active", "is-leaving");
      revealStage.classList.add("is-active");
      revealStage.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 420);
  }

  /* ===============================
     Gallery Slider
  ================================ */

  function setupGallery(gallery) {
    if (!Array.isArray(gallery) || gallery.length === 0) {
      galleryImage.alt = "Belum ada foto";
      galleryCaption.textContent = "Galeri foto belum diisi.";
      prevSlide.disabled = true;
      nextSlide.disabled = true;
      return;
    }

    renderDots(gallery.length);
    showSlide(0, gallery);

    prevSlide.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + gallery.length) % gallery.length;
      showSlide(currentSlide, gallery);
    });

    nextSlide.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % gallery.length;
      showSlide(currentSlide, gallery);
    });
  }

  function renderDots(total) {
    galleryDots.innerHTML = "";

    for (let i = 0; i < total; i += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-dot";
      dot.setAttribute("aria-label", `Tampilkan foto ${i + 1}`);

      dot.addEventListener("click", () => {
        const data = safeData();
        if (!data || !Array.isArray(data.gallery)) return;

        currentSlide = i;
        showSlide(currentSlide, data.gallery);
      });

      galleryDots.appendChild(dot);
    }
  }

  function showSlide(index, gallery) {
    const item = gallery[index];
    if (!item) return;

    galleryImage.classList.add("is-changing");

    window.setTimeout(() => {
      galleryImage.src = item.src || "";
      galleryImage.alt = item.caption || `Foto ${index + 1}`;
      galleryCaption.textContent = item.caption || "";

      const dots = galleryDots.querySelectorAll(".gallery-dot");
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === index);
      });

      galleryImage.classList.remove("is-changing");
    }, 170);
  }

  /* ===============================
     Music Player
  ================================ */

  function setupMusic(music) {
    musicTitle.textContent = music.title || "Birthday Song";
    musicArtist.textContent = music.artist || "Unknown Artist";
    musicCover.src = music.cover || "";
    birthdayAudio.src = music.src || "";

    musicCover.addEventListener("error", () => {
      musicCover.style.display = "none";
    });

    playPauseBtn.addEventListener("click", toggleMusic);

    birthdayAudio.addEventListener("loadedmetadata", () => {
      durationTime.textContent = formatTime(birthdayAudio.duration);
    });

    birthdayAudio.addEventListener("timeupdate", () => {
      if (!Number.isFinite(birthdayAudio.duration) || birthdayAudio.duration <= 0) return;

      const percent = (birthdayAudio.currentTime / birthdayAudio.duration) * 100;
      musicProgress.value = String(percent);
      currentTime.textContent = formatTime(birthdayAudio.currentTime);
    });

    birthdayAudio.addEventListener("ended", () => {
      playPauseBtn.textContent = "▶";
      musicProgress.value = "0";
      currentTime.textContent = "0:00";
    });

    musicProgress.addEventListener("input", () => {
      if (!Number.isFinite(birthdayAudio.duration) || birthdayAudio.duration <= 0) return;

      const nextTime = (Number(musicProgress.value) / 100) * birthdayAudio.duration;
      birthdayAudio.currentTime = nextTime;
    });
  }

  function toggleMusic() {
    if (!birthdayAudio.src) return;

    if (birthdayAudio.paused) {
      birthdayAudio
        .play()
        .then(() => {
          playPauseBtn.textContent = "❚❚";
        })
        .catch(() => {
          playPauseBtn.textContent = "▶";
          alert("Musik belum bisa diputar. Pastikan file audio tersedia di folder assets.");
        });
    } else {
      birthdayAudio.pause();
      playPauseBtn.textContent = "▶";
    }
  }

  function formatTime(time) {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  }

  /* ===============================
     Voucher Modal
  ================================ */

  function setupVoucher(voucher) {
    voucherBannerTitle.textContent = voucher.title || "Buka Voucher";
    voucherTitle.textContent = voucher.title || "Voucher Hadiah";
    voucherDescription.textContent = voucher.description || "";
    voucherFor.textContent = voucher.for || "Hadiah spesial";
    voucherCode.textContent = voucher.code || "BDAY-SECRET";
    claimMessage.textContent = "";

    openVoucherBtn.addEventListener("click", openVoucherModal);

    document.querySelectorAll("[data-close-modal]").forEach((element) => {
      element.addEventListener("click", closeVoucherModal);
    });

    claimVoucherBtn.addEventListener("click", () => {
      claimVoucherBtn.classList.add("is-claimed");
      claimVoucherBtn.textContent = "Sudah Di-claim";
      claimVoucherBtn.disabled = true;
      claimMessage.textContent = voucher.claimMessage || "Voucher berhasil di-claim!";
      fireSmallConfetti();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && voucherModal.classList.contains("is-open")) {
        closeVoucherModal();
      }
    });
  }

  function openVoucherModal() {
    voucherModal.classList.add("is-open");
    voucherModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeVoucherModal() {
    voucherModal.classList.remove("is-open");
    voucherModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function fireSmallConfetti() {
    if (typeof confetti !== "function") return;

    confetti({
      particleCount: 70,
      spread: 72,
      origin: { y: 0.76 },
      colors: ["#ff5fa2", "#ffc857", "#7c4dff", "#ffffff"]
    });
  }

  init();
});
