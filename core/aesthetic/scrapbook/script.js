const DATA = window.ATELIER_DATA || {};

let currentPhotoIndex = 0;
let progressValue = 0;
let accessGranted = false;

document.addEventListener("DOMContentLoaded", () => {
  applyData();
  setupCover();
  setupNavigation();
  setupAccessGate();
  renderGallery();
  renderTimeline();
  renderLetter();
  setupMusic();
  setupPhotoModal();
  setupFinish();
  setupPremiumEffects();
  updateProgress(0);
});

function applyData() {
  document.title = DATA.siteTitle || "Luxe Scrapbook Atelier";

  document.querySelectorAll("[data-text]").forEach((el) => {
    const key = el.dataset.text;

    if (DATA[key] !== undefined) {
      el.innerHTML = DATA[key];
    }
  });

  const mainPhoto = document.getElementById("main-photo");

  if (mainPhoto) {
    mainPhoto.src = DATA.mainPhoto || "assets/images/foto1.jpg";

    mainPhoto.onerror = () => {
      mainPhoto.style.display = "none";

      const parent = mainPhoto.closest(".main-polaroid");
      if (parent) parent.classList.add("no-photo");
    };
  }

  const audio = document.getElementById("audio");

  if (audio && DATA.musicFile) {
    audio.src = DATA.musicFile;
  }
}

function setupCover() {
  const btn = document.getElementById("open-btn");
  const cover = document.getElementById("cover-screen");
  const atelier = document.getElementById("atelier");

  if (!btn || !cover || !atelier) return;

  btn.addEventListener("click", () => {
    cover.classList.add("opening");

    setTimeout(() => {
      cover.classList.remove("active");
      atelier.classList.add("active");
      showPage("home");
      updateProgress(10);
    }, 800);
  });
}

function setupNavigation() {
  document.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showPage(btn.dataset.page);
    });
  });
}

function showPage(name) {
  const lockedPages = ["gallery", "timeline", "music", "letter", "ending"];

  if (lockedPages.includes(name) && !accessGranted) {
    name = "quiz";

    const status = document.getElementById("access-status");

    if (status) {
      status.textContent =
        "Masukkan kode akses terlebih dahulu untuk membuka halaman ini.";
      status.className = "access-status error";
    }
  }

  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  const target = document.getElementById(`page-${name}`);
  if (target) target.classList.add("active");

  document.querySelectorAll("[data-page]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === name);
  });

  const progressMap = {
    home: 10,
    quiz: 25,
    gallery: 45,
    timeline: 65,
    music: 85,
    letter: 95,
    ending: 100
  };

  updateProgress(progressMap[name] || progressValue);
}

function updateProgress(value) {
  progressValue = Math.max(progressValue, value);

  const number = document.getElementById("progress-number");
  const fill = document.getElementById("progress-fill");

  if (number) number.textContent = `${progressValue}%`;
  if (fill) fill.style.width = `${progressValue}%`;
}

/* ACCESS CODE */

function setupAccessGate() {
  const input = document.getElementById("access-input");
  const button = document.getElementById("access-btn");
  const status = document.getElementById("access-status");

  if (!input || !button) return;

  button.addEventListener("click", checkAccessCode);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkAccessCode();
    }
  });

  function checkAccessCode() {
    const userCode = normalizeCode(input.value);
    const correctCode = normalizeCode(DATA.accessCode || "");

    if (!userCode) {
      if (status) {
        status.textContent = "Kode akses belum diisi.";
        status.className = "access-status error";
      }

      input.classList.add("shake");
      setTimeout(() => input.classList.remove("shake"), 400);
      return;
    }

    if (userCode === correctCode) {
      accessGranted = true;

      if (status) {
        status.textContent =
          DATA.accessSuccess || "Kode benar. Halaman kenangan berhasil dibuka ✨";
        status.className = "access-status success";
      }

      button.textContent = "Unlocked ✨";
      input.disabled = true;
      button.disabled = true;

      makeConfetti();

      setTimeout(() => {
        showPage("gallery");
      }, 850);
    } else {
      accessGranted = false;

      if (status) {
        status.textContent =
          DATA.accessError || "Kode belum cocok. Coba masukkan tanggal yang benar.";
        status.className = "access-status error";
      }

      input.classList.add("shake");
      setTimeout(() => input.classList.remove("shake"), 400);
    }
  }
}

function normalizeCode(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function resetAccessGate() {
  accessGranted = false;

  const input = document.getElementById("access-input");
  const button = document.getElementById("access-btn");
  const status = document.getElementById("access-status");

  if (input) {
    input.value = "";
    input.disabled = false;
  }

  if (button) {
    button.disabled = false;
    button.textContent = "Unlock Memory";
  }

  if (status) {
    status.textContent = "";
    status.className = "access-status";
  }
}

/* GALLERY */

function getPhotos() {
  return Array.isArray(DATA.photos) ? DATA.photos.filter(Boolean) : [];
}

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const photos = getPhotos();
  grid.innerHTML = "";

  if (photos.length === 0) {
    grid.innerHTML =
      `<div class="empty-box">Belum ada foto. Masukkan foto ke assets/images.</div>`;
    return;
  }

  photos.forEach((src, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gallery-card";
    card.style.setProperty("--rotate", getRotate(index));

    card.innerHTML = `
      <div class="photo-label">No. ${String(index + 1).padStart(2, "0")}</div>
      <img src="${src}" alt="Memory ${index + 1}">
      <span>curated memory</span>
    `;

    const img = card.querySelector("img");

    img.onerror = () => {
      card.innerHTML = `
        <div class="photo-label">No. ${String(index + 1).padStart(2, "0")}</div>
        <div class="photo-placeholder">PHOTO</div>
        <span>foto tidak ditemukan</span>
      `;
    };

    card.addEventListener("click", () => openPhoto(index));
    grid.appendChild(card);
  });
}

function getRotate(index) {
  const list = ["-1.4deg", "1deg", "-.7deg", "1.4deg", "-1deg", ".8deg"];
  return list[index % list.length];
}

/* TIMELINE */

function renderTimeline() {
  const list = document.getElementById("timeline-list");
  if (!list) return;

  const timeline = Array.isArray(DATA.timeline) ? DATA.timeline : [];

  list.innerHTML = timeline
    .map((item, index) => {
      return `
        <article class="timeline-item" style="animation-delay:${index * 0.12}s">
          <small>${item.label}</small>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `;
    })
    .join("");
}

/* LETTER */

function renderLetter() {
  const box = document.getElementById("letter-content");
  if (!box) return;

  const letter = Array.isArray(DATA.letter) ? DATA.letter : [];

  box.innerHTML = letter
    .map((item) => {
      return `<p class="${item.highlight ? "highlight" : ""}">${item.text}</p>`;
    })
    .join("");
}

/* MUSIC */

function setupMusic() {
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("play-btn");
  const disc = document.querySelector(".album-disc");

  if (!audio || !playBtn) return;

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          playBtn.textContent = "Ⅱ";
          if (disc) disc.classList.add("playing");
        })
        .catch(() => {
          alert("File musik belum ditemukan. Masukkan lagu ke assets/music/song.mp3");
        });
    } else {
      audio.pause();
      playBtn.textContent = "▶";
      if (disc) disc.classList.remove("playing");
    }
  });

  audio.addEventListener("ended", () => {
    playBtn.textContent = "▶";
    if (disc) disc.classList.remove("playing");
  });
}

/* PHOTO MODAL */

function setupPhotoModal() {
  const bg = document.getElementById("modal-bg");

  if (bg) bg.addEventListener("click", closeModal);

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();

    const modal = document.getElementById("photo-modal");
    if (!modal || !modal.classList.contains("active")) return;

    const photos = getPhotos();
    if (photos.length === 0) return;

    if (event.key === "ArrowRight") {
      currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
      openPhoto(currentPhotoIndex);
    }

    if (event.key === "ArrowLeft") {
      currentPhotoIndex =
        (currentPhotoIndex - 1 + photos.length) % photos.length;
      openPhoto(currentPhotoIndex);
    }
  });
}

function openPhoto(index) {
  const photos = getPhotos();
  if (!photos[index]) return;

  currentPhotoIndex = index;

  const bg = document.getElementById("modal-bg");
  const modal = document.getElementById("photo-modal");
  const preview = document.getElementById("photo-preview");
  const title = document.getElementById("photo-title");

  if (preview) preview.src = photos[index];
  if (title) title.textContent = `Memory ${index + 1} of ${photos.length}`;

  if (bg) bg.classList.add("active");
  if (modal) modal.classList.add("active");
}

function closeModal() {
  document.querySelectorAll(".photo-modal").forEach((modal) => {
    modal.classList.remove("active");
  });

  const bg = document.getElementById("modal-bg");
  if (bg) bg.classList.remove("active");
}

/* FINISH */

function setupFinish() {
  const finishBtn = document.getElementById("finish-btn");
  const restartBtn = document.getElementById("restart-btn");

  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      showPage("ending");
      updateProgress(100);
      makeConfetti();
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      progressValue = 0;
      resetAccessGate();
      showPage("home");
      updateProgress(10);
    });
  }
}

/* EFFECT */

function setupPremiumEffects() {
  document.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;

    document.body.style.setProperty("--mx", `${x}%`);
    document.body.style.setProperty("--my", `${y}%`);
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button, .gallery-card");
    if (!target) return;

    for (let i = 0; i < 7; i++) {
      createParticle(event.clientX, event.clientY);
    }
  });
}

function createParticle(x, y) {
  const particle = document.createElement("span");
  particle.className = "magic-particle";

  const angle = Math.random() * Math.PI * 2;
  const distance = 38 + Math.random() * 68;

  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
  particle.style.setProperty("--y", `${Math.sin(angle) * distance}px`);

  document.body.appendChild(particle);

  setTimeout(() => particle.remove(), 1000);
}

function makeConfetti() {
  const layer = document.getElementById("confetti");
  if (!layer) return;

  const colors = ["#c9a86a", "#d9a7a7", "#ffffff", "#2d2520", "#f5eadc"];

  for (let i = 0; i < 90; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = "-20px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.8 + "s";
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    layer.appendChild(piece);

    setTimeout(() => piece.remove(), 3300);
  }
}