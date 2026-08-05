// =====================================================
// FINAL SCRIPT.JS - Birthday Retro Windows
// Flow:
// Boot -> Welcome otomatis -> OK -> Music jalan -> Our Photos 2x2
// Semua window bisa dibuka dan ditutup.
// Surprise: Alert -> Reminder -> Surprise.
// =====================================================

const USER_DATA =
  window.BIRTHDAY_DATA ||
  (typeof BIRTHDAY_DATA !== "undefined" ? BIRTHDAY_DATA : {});

let zIndex = 20;
let currentPhotoIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  applyTemplateData();
  setupWindowControls();
  setupPhotoViewer();
  enableDraggableWindows();
  updateClock();

  setInterval(updateClock, 1000);

  setTimeout(() => {
    showDesktop();
    closeAllWindows();
    openWindow("welcome-window");
  }, 2800);

  setTimeout(() => {
    const desktop = document.getElementById("desktop");
    const welcome = document.getElementById("welcome-window");

    if (desktop && desktop.style.display !== "block") {
      showDesktop();
    }

    if (welcome && !welcome.classList.contains("active")) {
      closeAllWindows();
      openWindow("welcome-window");
    }
  }, 4500);
});

// =====================================================
// BOOT
// =====================================================

function showDesktop() {
  const boot = document.getElementById("boot-screen");
  const desktop = document.getElementById("desktop");

  if (boot) boot.style.display = "none";
  if (desktop) desktop.style.display = "block";
}

// =====================================================
// APPLY DATA
// =====================================================

function applyTemplateData() {
  document.title = USER_DATA.websiteTitle || "Birthday Surprise";

  document.querySelectorAll("[data-name]").forEach((el) => {
    el.textContent = USER_DATA.name || "Someone Special";
  });

  const welcomeTitle = document.querySelector("#welcome-window h2");
  if (welcomeTitle && USER_DATA.welcomeTitle) {
    welcomeTitle.innerHTML = USER_DATA.welcomeTitle;
  }

  const welcomeParagraphs = document.querySelectorAll(
    "#welcome-window .welcome-body p"
  );

  if (welcomeParagraphs[0]) {
    welcomeParagraphs[0].innerHTML = `Dear <b class="pink" data-name>${
      USER_DATA.name || "Someone Special"
    }</b>,`;
  }

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

  renderParagraphList(
    document.querySelector(".scroll-content"),
    USER_DATA.musicMessage
  );

  renderParagraphList(
    document.querySelector("#message-window .notepad-body"),
    USER_DATA.noteMessage
  );

  renderParagraphList(
    document.querySelector("#about-window .notepad-body"),
    USER_DATA.aboutMessage
  );

  renderPhotos();

  const alertText = document.querySelector("#alert-window .alert-body p");
  if (alertText && USER_DATA.alertText) {
    alertText.innerHTML = USER_DATA.alertText;
  }

  const reminderText = document.querySelector("#reminder-window .alert-body p");
  if (reminderText && USER_DATA.reminderText) {
    reminderText.innerHTML = USER_DATA.reminderText;
  }

  const surpriseName = document.querySelector("#surprise-window [data-name]");
  if (surpriseName) {
    surpriseName.textContent = USER_DATA.name || "Someone Special";
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
// WINDOWS
// =====================================================

function openWindow(id) {
  const win = document.getElementById(id);
  const startMenu = document.getElementById("start-menu");

  if (!win) return;

  win.classList.add("active", "opening");
  win.style.display = "block";

  bringToFront(win);
  markTask(id, true);
  markIcon(id, true);

  if (startMenu) startMenu.classList.remove("open");

  if (id === "photos-window") {
    renderPhotos();
  }

  setTimeout(() => {
    win.classList.remove("opening");
  }, 220);
}

function closeWindow(win) {
  if (!win) return;

  win.classList.remove("active");
  win.style.display = "none";

  markTask(win.id, false);

  if (win.id === "photo-viewer-window") {
    closePhotoViewer();
  }
}

function closeWindowById(id) {
  const win = document.getElementById(id);
  closeWindow(win);
}

function closeAllWindows(exceptId = null) {
  document.querySelectorAll(".window").forEach((win) => {
    if (win.id !== exceptId && win.id !== "photo-viewer-window") {
      closeWindow(win);
    }
  });
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
  document
    .querySelectorAll(`.desktop-icon[data-open="${windowId}"]`)
    .forEach((icon) => {
      icon.classList.toggle("opened", isOpened);
    });
}

// =====================================================
// CONTROLS
// =====================================================

function setupWindowControls() {
  document.addEventListener("click", (event) => {
    const closeBtn = event.target.closest("[data-close]");
    if (closeBtn) {
      event.preventDefault();

      const win = closeBtn.closest(".window");
      closeWindow(win);
      return;
    }

    if (event.target.id === "photo-viewer-close") {
      event.preventDefault();
      closePhotoViewer();
      return;
    }

    const opener = event.target.closest("[data-open]");
    if (opener) {
      event.preventDefault();

      const targetId = opener.dataset.open;
      if (!targetId) return;

      if (targetId === "surprise-window") {
        startSurpriseSequence();
        return;
      }

      openWindow(targetId);
    }
  });

  const welcomeOkBtn = document.getElementById("welcome-ok-btn");
  if (welcomeOkBtn) {
    welcomeOkBtn.addEventListener("click", (event) => {
      event.preventDefault();

      closeWindowById("welcome-window");
      playBirthdayAudio();

      setTimeout(() => {
        openWindow("photos-window");
      }, 180);
    });
  }

  const alertOkButton = document.querySelector(
    "#alert-window .win-button[data-close]"
  );

  if (alertOkButton) {
    alertOkButton.addEventListener("click", () => {
      setTimeout(() => {
        openWindow("reminder-window");
      }, 180);
    });
  }

  const reminderOkButton = document.querySelector(
    "#reminder-window .win-button[data-close]"
  );

  if (reminderOkButton) {
    reminderOkButton.addEventListener("click", () => {
      setTimeout(() => {
        openWindow("surprise-window");
      }, 180);
    });
  }

  const confettiBtn = document.getElementById("confetti-btn");
  if (confettiBtn) {
    confettiBtn.addEventListener("click", makeConfetti);
  }

  const startButton = document.getElementById("start-button");
  const startMenu = document.getElementById("start-menu");

  if (startButton && startMenu) {
    startButton.addEventListener("click", () => {
      startMenu.classList.toggle("open");
    });
  }

  document.querySelectorAll(".window").forEach((win) => {
    win.addEventListener("mousedown", () => bringToFront(win));
  });
}

// =====================================================
// MUSIC
// =====================================================

function playBirthdayAudio() {
  const audio = document.getElementById("birthday-audio");

  if (!audio) return;

  audio.volume = 0.65;
  audio.loop = true;

  audio.play().catch(() => {
    console.log("Audio akan berjalan setelah interaksi user.");
  });
}

// =====================================================
// PHOTOS
// =====================================================

function getPhotos() {
  if (!Array.isArray(USER_DATA.photos)) return [];

  return USER_DATA.photos
    .filter((photo) => photo && photo.trim() !== "")
    .slice(0, 4);
}

function renderPhotos() {
  const photosBody = document.querySelector(".photos-body");
  const statusBar = document.querySelector("#photos-window .status-bar");

  if (!photosBody) return;

  const photos = getPhotos();

  photosBody.innerHTML = "";

  if (photos.length === 0) {
    for (let i = 0; i < 4; i++) {
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

  while (photosBody.children.length < 4) {
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
      currentPhotoIndex =
        (currentPhotoIndex - 1 + photos.length) % photos.length;
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
  overlay.style.display = "block";

  viewer.classList.add("active");
  viewer.style.display = "block";

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

  if (viewer) {
    viewer.classList.remove("active");
    viewer.style.display = "none";
  }

  if (overlay) {
    overlay.classList.remove("active");
    overlay.style.display = "none";
  }
}

// =====================================================
// SURPRISE
// =====================================================

function startSurpriseSequence() {
  closeAllWindows();

  setTimeout(() => {
    openWindow("alert-window");
  }, 120);
}

function makeConfetti() {
  const layer = document.getElementById("confetti-layer");
  if (!layer) return;

  const colors = [
    "#ff1493",
    "#ffd700",
    "#00bfff",
    "#7fff00",
    "#ff6347",
    "#ffffff"
  ];

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
// DRAGGABLE
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
        const maxTop =
          desktopArea.clientHeight - currentRect.height - taskbarHeight;

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
// FINAL SURPRISE FLOW FIX
// Surprise: Alert -> Reminder -> Birthday Window -> Confetti
// =====================================================

(function finalSurpriseFlowFix() {
  function showWin(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.classList.add("active");
    win.style.display = "block";

    if (typeof bringToFront === "function") {
      bringToFront(win);
    } else {
      win.style.zIndex = "99";
    }

    document
      .querySelectorAll(`.task[data-open="${id}"]`)
      .forEach((task) => task.classList.add("active"));
  }

  function hideWin(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.classList.remove("active");
    win.style.display = "none";

    document
      .querySelectorAll(`.task[data-open="${id}"]`)
      .forEach((task) => task.classList.remove("active"));
  }

  function hideNormalWindows() {
    document.querySelectorAll(".window").forEach((win) => {
      if (win.id !== "photo-viewer-window") {
        win.classList.remove("active");
        win.style.display = "none";
      }
    });

    document.querySelectorAll(".task").forEach((task) => {
      task.classList.remove("active");
    });
  }

  function runConfettiFinal() {
    if (typeof makeConfetti === "function") {
      makeConfetti();
      return;
    }

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

  document.addEventListener(
    "click",
    function (event) {
      const surpriseIcon = event.target.closest('[data-open="surprise-window"]');

      if (surpriseIcon) {
        event.preventDefault();
        event.stopImmediatePropagation();

        hideNormalWindows();

        setTimeout(() => {
          showWin("alert-window");
        }, 120);

        return;
      }

      const alertOk = event.target.closest("#alert-window .win-button");

      if (alertOk) {
        event.preventDefault();
        event.stopImmediatePropagation();

        hideWin("alert-window");

        setTimeout(() => {
          showWin("reminder-window");
        }, 180);

        return;
      }

      const reminderOk = event.target.closest("#reminder-window .win-button");

      if (reminderOk) {
        event.preventDefault();
        event.stopImmediatePropagation();

        hideWin("reminder-window");

        setTimeout(() => {
          showWin("surprise-window");
        }, 180);

        return;
      }

      const finalOk = event.target.closest("#confetti-btn");

      if (finalOk) {
        event.preventDefault();
        event.stopImmediatePropagation();

        runConfettiFinal();

        setTimeout(() => {
          hideWin("surprise-window");
        }, 900);

        return;
      }
    },
    true
  );
})();