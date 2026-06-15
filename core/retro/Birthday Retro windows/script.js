// =====================================================
// FINAL SCRIPT.JS - Birthday Retro Template
// Fitur:
// - Data dari data.js
// - Window klik muncul satu per satu
// - Window bisa digeser
// - Galeri foto dari data.js
// - Foto bisa diklik dan diperbesar
// - Photo viewer bisa ditutup dengan X, klik area gelap, atau ESC
// - Bisa next/prev pakai tombol keyboard kiri/kanan
// =====================================================

const USER_DATA =
  window.BIRTHDAY_DATA ||
  (typeof BIRTHDAY_DATA !== "undefined" ? BIRTHDAY_DATA : {});

let zIndex = 10;
let currentPhotoIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  injectPhotoViewerHTML();
  injectPhotoViewerCSS();

  applyTemplateData();
  setupWindowControls();
  setupMusicPlayer();
  setupSurpriseSequence();
  setupPhotoViewer();
  enableDraggableWindows();
  updateClock();

  setInterval(updateClock, 1000);

  setTimeout(() => {
    const boot = document.getElementById("boot-screen");
    const desktop = document.getElementById("desktop");

    if (boot) boot.style.display = "none";
    if (desktop) desktop.style.display = "block";

    showDesktopHint();
  }, 2800);
});

// Safety fallback agar tidak stuck di loading
setTimeout(() => {
  const boot = document.getElementById("boot-screen");
  const desktop = document.getElementById("desktop");

  if (boot) boot.style.display = "none";
  if (desktop) desktop.style.display = "block";
}, 4500);

// =====================================================
// APPLY DATA DARI data.js
// =====================================================

function applyTemplateData() {
  document.title = USER_DATA.websiteTitle || "Birthday OS";

  document.querySelectorAll("[data-name]").forEach((el) => {
    el.textContent = USER_DATA.name || "Juju";
  });

  const welcomeTitle = document.querySelector("#welcome-window h2");
  if (welcomeTitle && USER_DATA.welcomeTitle) {
    welcomeTitle.innerHTML = USER_DATA.welcomeTitle;
  }

  const welcomeParagraphs = document.querySelectorAll("#welcome-window .welcome-body p");
  if (welcomeParagraphs[1] && USER_DATA.welcomeText) {
    welcomeParagraphs[1].innerHTML = USER_DATA.welcomeText;
  }

  const songTitle = document.querySelector(".song-title");
  if (songTitle && USER_DATA.songTitle) {
    songTitle.textContent = USER_DATA.songTitle;
  }

  const timeLabel = document.getElementById("time-label");
  if (timeLabel && USER_DATA.songTime) {
    timeLabel.textContent = USER_DATA.songTime;
  }

  const audio = document.getElementById("birthday-audio");
  if (audio && USER_DATA.musicFile) {
    audio.src = USER_DATA.musicFile;
  }

  const coverText = document.querySelector(".cover-text");
  if (coverText && USER_DATA.coverText) {
    coverText.textContent = USER_DATA.coverText;
  }

  const coverArt = document.querySelector(".cover-art");
  if (coverArt && USER_DATA.coverImage) {
    coverArt.style.backgroundImage = `url("${USER_DATA.coverImage}")`;
    coverArt.style.backgroundSize = "cover";
    coverArt.style.backgroundPosition = "center";
    coverArt.style.backgroundRepeat = "no-repeat";
  }

  renderParagraphList(document.querySelector(".scroll-content"), USER_DATA.musicMessage);
  renderParagraphList(document.querySelector("#message-window .notepad-body"), USER_DATA.noteMessage);
  renderParagraphList(document.querySelector("#about-window .notepad-body"), USER_DATA.aboutMessage);

  renderPhotos();

  const alertText = document.querySelector("#alert-window .alert-body p");
  if (alertText && USER_DATA.alertText) {
    alertText.innerHTML = USER_DATA.alertText;
  }

  const reminderText = document.querySelector("#reminder-window .alert-body p");
  if (reminderText && USER_DATA.reminderText) {
    reminderText.innerHTML = USER_DATA.reminderText;
  }

  const finalText = document.querySelector(
    "#surprise-window .surprise-body div:last-child p:nth-child(2)"
  );
  if (finalText && USER_DATA.finalBirthdayText) {
    finalText.innerHTML = USER_DATA.finalBirthdayText;
  }

  const finalSubtext = document.querySelector(
    "#surprise-window .surprise-body div:last-child p:nth-child(3)"
  );
  if (finalSubtext && USER_DATA.finalBirthdaySubtext) {
    finalSubtext.innerHTML = USER_DATA.finalBirthdaySubtext;
  }
}

function renderParagraphList(container, items) {
  if (!container || !Array.isArray(items)) return;

  container.innerHTML = items
    .map((item) => {
      const className = item.pink ? ' class="pink"' : "";
      return `<p${className}>${item.text}</p>`;
    })
    .join("");
}

// =====================================================
// GALERI FOTO
// =====================================================

function getPhotos() {
  if (!Array.isArray(USER_DATA.photos)) return [];
  return USER_DATA.photos.filter((photo) => photo && photo.trim() !== "");
}

function renderPhotos() {
  const photosBody = document.querySelector(".photos-body");
  const statusBar = document.querySelector("#photos-window .status-bar");

  if (!photosBody) return;

  const photos = getPhotos();

  photosBody.innerHTML = "";

  if (photos.length === 0) {
    for (let i = 0; i < 6; i++) {
      const emptyCard = document.createElement("div");
      emptyCard.className = "photo-card empty-photo";
      emptyCard.innerHTML = "<span>Photo</span>";
      photosBody.appendChild(emptyCard);
    }

    if (statusBar) {
      statusBar.textContent = "0 item(s)";
    }

    return;
  }

  photos.forEach((photo, index) => {
    const card = document.createElement("button");

    card.type = "button";
    card.className = "photo-card";
    card.dataset.index = String(index);
    card.dataset.photo = photo;

    card.style.backgroundImage = `url("${photo}")`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
    card.style.backgroundRepeat = "no-repeat";

    card.innerHTML = `<span class="photo-zoom-label">View</span>`;

    card.addEventListener("click", () => {
      openPhotoViewer(index);
    });

    photosBody.appendChild(card);
  });

  while (photosBody.children.length < 6) {
    const emptyCard = document.createElement("div");
    emptyCard.className = "photo-card empty-photo";
    emptyCard.innerHTML = "<span>Photo</span>";
    photosBody.appendChild(emptyCard);
  }

  if (statusBar) {
    statusBar.textContent = `${photos.length} item(s) • Klik foto untuk memperbesar`;
  }
}

// =====================================================
// PHOTO VIEWER
// =====================================================

function injectPhotoViewerHTML() {
  if (document.getElementById("photo-viewer-window")) return;

  const desktop = document.getElementById("desktop");
  if (!desktop) return;

  const overlay = document.createElement("div");
  overlay.className = "photo-viewer-overlay";
  overlay.id = "photo-viewer-overlay";

  const viewer = document.createElement("section");
  viewer.className = "window photo-viewer-window";
  viewer.id = "photo-viewer-window";
  viewer.style.left = "50%";
  viewer.style.top = "50%";
  viewer.style.width = "680px";
  viewer.style.zIndex = "60";
  viewer.style.transform = "translate(-50%, -50%)";

  viewer.innerHTML = `
    <div class="titlebar">
      <strong>Photo Viewer</strong>
      <button id="photo-viewer-close">×</button>
    </div>

    <div class="window-body photo-viewer-body">
      <div class="photo-viewer-frame">
        <img id="photo-viewer-image" src="" alt="Preview photo" />
      </div>
    </div>

    <div class="status-bar" id="photo-viewer-caption">Photo preview</div>
  `;

  desktop.appendChild(overlay);
  desktop.appendChild(viewer);
}

function setupPhotoViewer() {
  const overlay = document.getElementById("photo-viewer-overlay");
  const closeBtn = document.getElementById("photo-viewer-close");

  if (overlay) {
    overlay.addEventListener("click", closePhotoViewer);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closePhotoViewer);
  }

  document.addEventListener("keydown", (event) => {
    const viewer = document.getElementById("photo-viewer-window");

    if (event.key === "Escape") {
      closePhotoViewer();
    }

    if (!viewer || !viewer.classList.contains("active")) return;

    const photos = getPhotos();
    if (photos.length === 0) return;

    if (event.key === "ArrowRight") {
      currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
      openPhotoViewer(currentPhotoIndex);
    }

    if (event.key === "ArrowLeft") {
      currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
      openPhotoViewer(currentPhotoIndex);
    }
  });
}

function openPhotoViewer(index) {
  const photos = getPhotos();

  const viewer = document.getElementById("photo-viewer-window");
  const overlay = document.getElementById("photo-viewer-overlay");
  const image = document.getElementById("photo-viewer-image");
  const caption = document.getElementById("photo-viewer-caption");

  if (!viewer || !overlay || !image || !photos[index]) return;

  currentPhotoIndex = index;

  image.src = photos[index];
  image.alt = `Photo ${index + 1}`;

  if (caption) {
    caption.textContent = `Photo ${index + 1} of ${photos.length} • ESC untuk menutup`;
  }

  overlay.classList.add("active");
  viewer.classList.add("active");

if (window.innerWidth <= 768) {
  viewer.style.left = "4vw";
  viewer.style.top = "10vh";
  viewer.style.right = "auto";
  viewer.style.bottom = "auto";
  viewer.style.transform = "none";
} else {
  viewer.style.left = "50%";
  viewer.style.top = "50%";
  viewer.style.right = "auto";
  viewer.style.bottom = "auto";
  viewer.style.transform = "translate(-50%, -50%)";
}

  bringToFront(viewer);
}

function closePhotoViewer() {
  const viewer = document.getElementById("photo-viewer-window");
  const overlay = document.getElementById("photo-viewer-overlay");

  if (viewer) viewer.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
}

// =====================================================
// WINDOW CONTROL
// =====================================================

function setupWindowControls() {
  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.open;

      if (targetId === "surprise-window") {
        startSurpriseSequence();
        return;
      }

      openWindow(targetId);
    });
  });

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const win = btn.closest(".window");
      closeWindow(win);
    });
  });

  document.querySelectorAll(".window").forEach((win) => {
    win.addEventListener("mousedown", () => bringToFront(win));
  });

  const startButton = document.getElementById("start-button");
  const startMenu = document.getElementById("start-menu");

  if (startButton && startMenu) {
    startButton.addEventListener("click", () => {
      startMenu.classList.toggle("open");
    });
  }
}

function openWindow(id) {
  const win = document.getElementById(id);
  const startMenu = document.getElementById("start-menu");

  if (!win) return;

  win.classList.add("active", "opening");
  bringToFront(win);
  markTask(id, true);
  markIcon(id, true);

  if (startMenu) startMenu.classList.remove("open");

  setTimeout(() => {
    win.classList.remove("opening");
  }, 220);
}

function closeWindow(win) {
  if (!win) return;

  win.classList.remove("active");
  markTask(win.id, false);

  if (win.id === "photo-viewer-window") {
    closePhotoViewer();
  }
}

function bringToFront(win) {
  if (!win) return;

  zIndex += 1;
  win.style.zIndex = zIndex;
}

function markTask(windowId, isActive) {
  document.querySelectorAll(`.task[data-open="${windowId}"]`).forEach((task) => {
    task.classList.toggle("active", isActive);
  });
}

function markIcon(windowId, isOpened) {
  document.querySelectorAll(`.desktop-icon[data-open="${windowId}"]`).forEach((icon) => {
    icon.classList.toggle("opened", isOpened);
  });
}

// =====================================================
// MUSIC PLAYER
// =====================================================

function setupMusicPlayer() {
  const audio = document.getElementById("birthday-audio");
  const playBtn = document.getElementById("play-btn");

  if (!audio || !playBtn) return;

  playBtn.addEventListener("click", () => {
    if (!audio.src) return;

    if (audio.paused) {
      audio.play().catch(() => {
        alert("File musik belum ditemukan. Cek folder assets/music/");
      });

      playBtn.textContent = "Ⅱ";
    } else {
      audio.pause();
      playBtn.textContent = "▶";
    }
  });
}

// =====================================================
// SURPRISE BERTAHAP
// =====================================================

function setupSurpriseSequence() {
  const alertOkButton = document.querySelector("#alert-window .win-button[data-close]");
  const reminderOkButton = document.querySelector("#reminder-window .win-button[data-close]");
  const confettiBtn = document.getElementById("confetti-btn");

  if (alertOkButton) {
    alertOkButton.addEventListener("click", () => {
      setTimeout(() => openWindow("reminder-window"), 180);
    });
  }

  if (reminderOkButton) {
    reminderOkButton.addEventListener("click", () => {
      setTimeout(() => openWindow("surprise-window"), 180);
    });
  }

  if (confettiBtn) {
    confettiBtn.addEventListener("click", makeConfetti);
  }
}

function startSurpriseSequence() {
  closeWindow(document.getElementById("reminder-window"));
  closeWindow(document.getElementById("surprise-window"));
  openWindow("alert-window");
}

function makeConfetti() {
  const layer = document.getElementById("confetti-layer");
  if (!layer) return;

  const colors = ["#ff1493", "#ffd700", "#00bfff", "#7fff00", "#ff6347", "#ffffff"];

  for (let i = 0; i < 90; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = "-20px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.6 + "s";
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;

    layer.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 3100);
  }
}

// =====================================================
// CLOCK
// =====================================================

function updateClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;

  const now = new Date();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  clock.textContent = `${hours}:${minutes} ${ampm}`;
}

// =====================================================
// HINT
// =====================================================

function showDesktopHint() {
  const desktop = document.getElementById("desktop");
  if (!desktop) return;

  const hint = document.createElement("div");

  hint.className = "desktop-hint";
  hint.textContent = "Klik icon di desktop untuk membuka kejutan satu per satu ✨";

  desktop.appendChild(hint);

  setTimeout(() => {
    hint.remove();
  }, 5200);
}

// =====================================================
// DRAGGABLE WINDOWS
// =====================================================

function enableDraggableWindows() {
  const desktopArea = document.getElementById("desktop");
  const taskbarHeight = 42;

  if (!desktopArea) return;

  document.querySelectorAll(".window").forEach((win) => {
    const titlebar = win.querySelector(".titlebar");

    if (!titlebar) return;

    titlebar.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;

      bringToFront(win);
      win.classList.add("dragging");

      titlebar.setPointerCapture(event.pointerId);

      const winRect = win.getBoundingClientRect();
      const desktopRect = desktopArea.getBoundingClientRect();

      win.style.left = `${winRect.left - desktopRect.left}px`;
      win.style.top = `${winRect.top - desktopRect.top}px`;
      win.style.right = "auto";
      win.style.bottom = "auto";
      win.style.transform = "none";

      const offsetX = event.clientX - winRect.left;
      const offsetY = event.clientY - winRect.top;

      function moveWindow(moveEvent) {
        const currentRect = win.getBoundingClientRect();

        let nextLeft = moveEvent.clientX - desktopRect.left - offsetX;
        let nextTop = moveEvent.clientY - desktopRect.top - offsetY;

        const maxLeft = desktopArea.clientWidth - currentRect.width;
        const maxTop = desktopArea.clientHeight - currentRect.height - taskbarHeight;

        nextLeft = Math.max(0, Math.min(nextLeft, Math.max(0, maxLeft)));
        nextTop = Math.max(0, Math.min(nextTop, Math.max(0, maxTop)));

        win.style.left = `${nextLeft}px`;
        win.style.top = `${nextTop}px`;
      }

      function stopDrag() {
        win.classList.remove("dragging");

        titlebar.removeEventListener("pointermove", moveWindow);
        titlebar.removeEventListener("pointerup", stopDrag);
        titlebar.removeEventListener("pointercancel", stopDrag);
      }

      titlebar.addEventListener("pointermove", moveWindow);
      titlebar.addEventListener("pointerup", stopDrag);
      titlebar.addEventListener("pointercancel", stopDrag);
    });
  });
}

// =====================================================
// CSS TAMBAHAN OTOMATIS DARI JS
// Jadi tidak wajib edit style.css
// =====================================================

function injectPhotoViewerCSS() {
  if (document.getElementById("photo-viewer-style")) return;

  const style = document.createElement("style");

  style.id = "photo-viewer-style";
  style.innerHTML = `
    .desktop-icon.opened {
      background: rgba(255,255,255,.08);
      border: 1px dotted #fff;
    }

    .task.active {
      background: #efefef;
      border-top: 2px solid #808080;
      border-left: 2px solid #808080;
      border-right: 2px solid #fff;
      border-bottom: 2px solid #fff;
    }

    .window.opening {
      animation: popWin .22s ease-out;
    }

    @keyframes popWin {
      from {
        opacity: .6;
      }
      to {
        opacity: 1;
      }
    }

    .photos-body {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 12px !important;
      padding: 14px !important;
      background: #dcdcdc !important;
    }

    .photo-card {
      position: relative !important;
      display: block !important;
      width: 100% !important;
      height: 118px !important;
      border: 4px solid #ececec !important;
      box-shadow:
        inset 0 0 0 2px #7a7a7a,
        inset 0 0 0 6px rgba(255,255,255,.42),
        3px 3px 0 rgba(0,0,0,.18) !important;
      cursor: pointer !important;
      overflow: hidden !important;
      transition: transform .15s ease, box-shadow .15s ease !important;
      appearance: none !important;
      background-color: #c9c9c9 !important;
    }

    .photo-card:hover {
      transform: translateY(-2px);
      box-shadow:
        inset 0 0 0 2px #7a7a7a,
        inset 0 0 0 6px rgba(255,255,255,.42),
        5px 5px 0 rgba(0,0,0,.22) !important;
    }

    .photo-card.empty-photo {
      cursor: default !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: linear-gradient(145deg,#d9d9d9,#c0c0c0) !important;
      color: #666 !important;
      font-family: Arial, sans-serif !important;
      font-weight: 700 !important;
    }

    .photo-zoom-label {
      position: absolute;
      right: 8px;
      bottom: 8px;
      padding: 4px 8px;
      background: rgba(0,0,128,.86);
      color: #fff;
      font-family: Arial, sans-serif;
      font-size: 12px;
      border: 1px solid rgba(255,255,255,.55);
      opacity: 0;
      transition: opacity .15s ease;
    }

    .photo-card:hover .photo-zoom-label {
      opacity: 1;
    }

    .photo-viewer-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,.45);
      display: none;
      z-index: 55;
    }

    .photo-viewer-overlay.active {
      display: block;
    }

    .photo-viewer-window {
      display: none;
      max-width: min(680px, 80vw);
    }

    .photo-viewer-window.active {
      display: block;
    }

    .photo-viewer-body {
      padding: 16px;
      background: #d8d8d8;
    }

    .photo-viewer-frame {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 260px;
      max-height: 68vh;
      padding: 12px;
      background: #ececec;
      border-top: 2px solid #808080;
      border-left: 2px solid #808080;
      border-right: 2px solid #fff;
      border-bottom: 2px solid #fff;
    }

    #photo-viewer-image {
      display: block;
      width: auto;
      max-width: 100%;
      max-height: 62vh;
      object-fit: contain;
      box-shadow: 0 0 0 2px #fff, 0 0 0 4px #666;
    }

    #photo-viewer-caption {
      font-family: Arial, sans-serif;
      font-size: 14px;
    }

    .desktop-hint {
      position: absolute;
      left: 120px;
      top: 22px;
      padding: 10px 14px;
      background: rgba(255,255,255,.92);
      border-top: 2px solid #fff;
      border-left: 2px solid #fff;
      border-right: 2px solid #555;
      border-bottom: 2px solid #555;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 3px 3px 0 rgba(0,0,0,.25);
      z-index: 25;
    }
  `;

  document.head.appendChild(style);
}