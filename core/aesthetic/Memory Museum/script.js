const DATA = window.SCRAPBOOK_DATA || {};

let currentQuizIndex = 0;
let currentPhotoIndex = 0;
let progressValue = 0;

document.addEventListener("DOMContentLoaded", () => {
  applyData();
  renderQuiz();
  renderGallery();
  renderTimeline();
  renderLetter();
  setupCover();
  setupNavigation();
  setupMusic();
  setupPhotoModal();
  setupFinish();
  setupWowEffects();
  updateProgress(0);
});

function applyData() {
  document.title = DATA.siteTitle || "Scrapbook Memory Quest";

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
      const card = mainPhoto.closest(".profile-polaroid");
      if (card) card.classList.add("no-photo");
    };
  }

  const audio = document.getElementById("audio");
  if (audio && DATA.musicFile) {
    audio.src = DATA.musicFile;
  }
}

function setupCover() {
  const btn = document.getElementById("open-book-btn");
  const cover = document.getElementById("cover-screen");
  const scrapbook = document.getElementById("scrapbook");

  if (!btn || !cover || !scrapbook) return;

  btn.addEventListener("click", () => {
    cover.classList.add("open");
    setTimeout(() => {
      cover.classList.remove("active");
      scrapbook.classList.add("active");
      showPage("intro");
      updateProgress(10);
    }, 850);
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
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  const target = document.getElementById(`page-${name}`);
  if (target) target.classList.add("active");

  document.querySelectorAll("[data-page]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === name);
  });

  const map = {
    intro: 10,
    quiz: 25,
    gallery: 45,
    timeline: 65,
    music: 85,
    letter: 95,
    ending: 100
  };

  updateProgress(map[name] || progressValue);
}

function updateProgress(value) {
  progressValue = Math.max(progressValue, value);

  const number = document.getElementById("progress-number");
  const fill = document.getElementById("progress-fill");

  if (number) number.textContent = `${progressValue}%`;
  if (fill) fill.style.width = `${progressValue}%`;
}

function getQuiz() {
  return Array.isArray(DATA.quiz) ? DATA.quiz : [];
}

function renderQuiz() {
  const quiz = getQuiz();
  const counter = document.getElementById("quiz-counter");
  const question = document.getElementById("quiz-question");
  const options = document.getElementById("quiz-options");
  const hint = document.getElementById("quiz-hint");

  if (!counter || !question || !options || quiz.length === 0) return;

  const item = quiz[currentQuizIndex];

  counter.textContent = `Question ${currentQuizIndex + 1} / ${quiz.length}`;
  question.textContent = item.question;
  options.innerHTML = "";

  item.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = option;

    btn.addEventListener("click", () => {
      const correct = option === item.answer;
      btn.classList.add(correct ? "correct" : "selected");

      if (hint) {
        hint.textContent = correct
          ? "Correct. Scrapbook key collected ✨"
          : "Tidak apa-apa. Scrapbook tetap terbuka untukmu ✨";
      }

      setTimeout(() => {
        currentQuizIndex++;

        if (currentQuizIndex >= quiz.length) {
          currentQuizIndex = 0;
          renderQuiz();
          showPage("gallery");
          makeConfetti();
        } else {
          renderQuiz();
        }
      }, 700);
    });

    options.appendChild(btn);
  });
}

function getPhotos() {
  return Array.isArray(DATA.photos) ? DATA.photos.filter(Boolean) : [];
}

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const photos = getPhotos();
  grid.innerHTML = "";

  if (photos.length === 0) {
    grid.innerHTML = `<div class="empty-box">Belum ada foto. Masukkan foto ke assets/images.</div>`;
    return;
  }

  photos.forEach((src, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gallery-item";
    btn.style.setProperty("--rot", getRotation(index));

    btn.innerHTML = `
      <div class="photo-tape"></div>
      <img src="${src}" alt="Memory ${index + 1}">
      <span>memory ${index + 1}</span>
    `;

    const img = btn.querySelector("img");
    img.onerror = () => {
      btn.innerHTML = `
        <div class="photo-tape"></div>
        <div class="photo-placeholder">📷</div>
        <span>foto tidak ditemukan</span>
      `;
    };

    btn.addEventListener("click", () => openPhoto(index));
    grid.appendChild(btn);
  });
}

function getRotation(index) {
  const rotations = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg"];
  return rotations[index % rotations.length];
}

function renderTimeline() {
  const list = document.getElementById("timeline-list");
  if (!list) return;

  const timeline = Array.isArray(DATA.timeline) ? DATA.timeline : [];

  list.innerHTML = timeline.map((item, index) => {
    return `
      <article class="timeline-item" style="animation-delay:${index * 0.12}s">
        <small>${item.tag}</small>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `;
  }).join("");
}

function renderLetter() {
  const box = document.getElementById("letter-content");
  if (!box) return;

  const letter = Array.isArray(DATA.letter) ? DATA.letter : [];

  box.innerHTML = letter.map((item) => {
    return `<p class="${item.highlight ? "highlight" : ""}">${item.text}</p>`;
  }).join("");
}

function setupMusic() {
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("play-btn");
  const cassette = document.querySelector(".cassette");

  if (!audio || !playBtn) return;

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play()
        .then(() => {
          playBtn.textContent = "Ⅱ";
          if (cassette) cassette.classList.add("playing");
        })
        .catch(() => {
          alert("File musik belum ditemukan. Masukkan lagu ke assets/music/song.mp3");
        });
    } else {
      audio.pause();
      playBtn.textContent = "▶";
      if (cassette) cassette.classList.remove("playing");
    }
  });

  audio.addEventListener("ended", () => {
    playBtn.textContent = "▶";
    if (cassette) cassette.classList.remove("playing");
  });
}

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
      currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
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
      currentQuizIndex = 0;
      renderQuiz();
      showPage("intro");
      updateProgress(10);
    });
  }
}

function makeConfetti() {
  const layer = document.getElementById("confetti");
  if (!layer) return;

  const colors = ["#ffb7c5", "#f7d774", "#ffffff", "#9b6b43", "#b9d8ff"];

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

function setupWowEffects() {
  document.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    document.body.style.setProperty("--mx", `${x}%`);
    document.body.style.setProperty("--my", `${y}%`);
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button, .gallery-item");
    if (!target) return;

    for (let i = 0; i < 7; i++) {
      createParticle(event.clientX, event.clientY);
    }
  });
}

function createParticle(x, y) {
  const p = document.createElement("span");
  p.className = "magic-particle";

  const angle = Math.random() * Math.PI * 2;
  const distance = 35 + Math.random() * 70;

  p.style.left = `${x}px`;
  p.style.top = `${y}px`;
  p.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
  p.style.setProperty("--y", `${Math.sin(angle) * distance}px`);

  document.body.appendChild(p);

  setTimeout(() => p.remove(), 1000);
}
/* =====================================================
   EXTRA VISUAL FLOAT EFFECT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const decorItems = document.querySelectorAll(".decor-item");

  decorItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.18}s`;
  });
});