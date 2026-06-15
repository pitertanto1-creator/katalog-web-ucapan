const DATA = window.BIRTHDAY_DATA || {};
let currentPhotoIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  applyData();
  renderPhotos();
  renderTextList("message-box", DATA.message);
  renderTextList("about-box", DATA.about);
  setupNavigation();
  setupMusic();
  setupModal();
  setupSurprise();
});

function applyData() {
  document.title = DATA.gameTitle || "Birthday Quest";

  document.querySelectorAll("[data-text]").forEach((el) => {
    const key = el.dataset.text;
    if (DATA[key] !== undefined) el.innerHTML = DATA[key];
  });

  const avatar = document.getElementById("avatar-img");
  if (avatar && DATA.avatar) {
    avatar.src = DATA.avatar;
    avatar.onerror = () => avatar.removeAttribute("src");
  }

  const audio = document.getElementById("audio");
  if (audio && DATA.musicFile) audio.src = DATA.musicFile;
}

function getPhotos() {
  return Array.isArray(DATA.photos) ? DATA.photos.filter(Boolean) : [];
}

function tapeColor(index) {
  return ["#ff9ec2", "#ffc56d", "#83c5ff", "#ffb3d0", "#ff96bf", "#c58cff"][index % 6];
}

function createPhotoCard(src, index) {
  const card = document.createElement("div");
  card.className = "photo-card";
  card.style.setProperty("--tape", tapeColor(index));

  const img = document.createElement("img");
  img.src = src;
  img.alt = `Photo ${index + 1}`;
  img.onerror = () => {
    card.innerHTML = '<div class="placeholder">📷</div>';
  };

  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", `Open photo ${index + 1}`);
  btn.addEventListener("click", () => openPhoto(index));

  card.appendChild(img);
  card.appendChild(btn);
  return card;
}

function renderPhotos() {
  const photos = getPhotos();
  const small = document.getElementById("small-gallery");
  const large = document.getElementById("large-gallery");
  const count = document.getElementById("photo-count");

  if (small) small.innerHTML = "";
  if (large) large.innerHTML = "";

  photos.forEach((src, index) => {
    if (small) small.appendChild(createPhotoCard(src, index));
    if (large) large.appendChild(createPhotoCard(src, index));
  });

  for (let i = photos.length; i < 6; i++) {
    const empty = document.createElement("div");
    empty.className = "photo-card";
    empty.innerHTML = '<div class="placeholder">📷</div>';
    if (small) small.appendChild(empty);
  }

  if (count) count.textContent = `${photos.length} / 6 ♥`;

  if (photos.length === 0 && large) {
    large.innerHTML = '<div class="text-card"><p>Masukkan foto ke folder <b>assets/images</b>, lalu edit daftar foto di <b>data.js</b>.</p></div>';
  }
}

function renderTextList(id, list) {
  const box = document.getElementById(id);
  if (!box || !Array.isArray(list)) return;

  box.innerHTML = list.map((item) => {
    const cls = item.pink ? ' class="pink-text"' : "";
    return `<p${cls}>${item.text}</p>`;
  }).join("");
}

function setupNavigation() {
  document.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
  });

  const start = document.getElementById("start-btn");
  if (start) start.addEventListener("click", () => showPage("gallery"));

  const gift = document.getElementById("gift-btn");
  if (gift) gift.addEventListener("click", openSurprise);

  const navGift = document.getElementById("surprise-nav");
  if (navGift) navGift.addEventListener("click", openSurprise);
}

function showPage(name) {
  document.querySelectorAll(".screen-page").forEach((page) => page.classList.remove("active"));
  const target = document.getElementById(`page-${name}`);
  if (target) target.classList.add("active");

  document.querySelectorAll(".bottom-nav button").forEach((btn) => btn.classList.remove("active"));
  document.querySelectorAll(`.bottom-nav button[data-page="${name}"]`).forEach((btn) => btn.classList.add("active"));

  if (name === "message") {
    const status = document.getElementById("message-status");
    if (status) status.textContent = "1 / 1";
  }
}

function setupMusic() {
  const audio = document.getElementById("audio");
  const play = document.getElementById("play-btn");
  if (!audio || !play) return;

  play.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => alert("File musik belum ditemukan. Masukkan ke assets/music/birthday-song.mp3"));
      play.textContent = "Ⅱ";
    } else {
      audio.pause();
      play.textContent = "▶";
    }
  });
}

function setupModal() {
  const bg = document.getElementById("modal-bg");
  if (bg) bg.addEventListener("click", closeModal);

  document.querySelectorAll("[data-close-modal]").forEach((btn) => btn.addEventListener("click", closeModal));

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
  const modal = document.getElementById("photo-modal");
  const bg = document.getElementById("modal-bg");
  const img = document.getElementById("photo-preview");
  const title = document.getElementById("photo-title");

  if (!photos[index] || !modal || !img) return;

  currentPhotoIndex = index;
  img.src = photos[index];
  if (title) title.textContent = `Photo ${index + 1} of ${photos.length}`;

  if (bg) bg.classList.add("active");
  modal.classList.add("active");
}

function openSurprise() {
  const modal = document.getElementById("surprise-modal");
  const bg = document.getElementById("modal-bg");
  const status = document.getElementById("gift-status");

  if (status) status.textContent = "1 / 1";
  if (bg) bg.classList.add("active");
  if (modal) modal.classList.add("active");
}

function closeModal() {
  document.querySelectorAll(".modal").forEach((modal) => modal.classList.remove("active"));
  const bg = document.getElementById("modal-bg");
  if (bg) bg.classList.remove("active");
}

function setupSurprise() {
  const btn = document.getElementById("confetti-btn");
  if (btn) btn.addEventListener("click", makeConfetti);
}

function makeConfetti() {
  const layer = document.getElementById("confetti");
  if (!layer) return;

  const colors = ["#ff4fa3", "#ffd166", "#8ec5ff", "#c58cff", "#ffffff", "#7ee081"];

  for (let i = 0; i < 110; i++) {
    const p = document.createElement("span");
    p.className = "confetti";
    p.style.left = Math.random() * 100 + "vw";
    p.style.top = "-20px";
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = Math.random() * 0.75 + "s";
    p.style.transform = `rotate(${Math.random() * 180}deg)`;
    layer.appendChild(p);
    setTimeout(() => p.remove(), 3300);
  }
}