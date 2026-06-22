// script.js
// =========================================================
// Versi final tanpa mode admin.
// Foto, GIF, teks, dan lagu diatur manual dari data.js.
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    const byId = (id) => document.getElementById(id);

    const setText = (id, value = "") => {
        const el = byId(id);
        if (el) el.innerText = value;
    };

    const setHTML = (id, value = "") => {
        const el = byId(id);
        if (el) el.innerHTML = value;
    };

    const setImage = (id, src, fallback = "assets/placeholder-photo.svg") => {
        const img = byId(id);
        if (!img) return;

        img.src = src || fallback;
        img.onerror = () => {
            img.onerror = null;
            img.src = fallback;
        };
    };

    // Render teks utama dari data.js
    setText("hero-title", apologyData.hero.title);
    setHTML("hero-subtitle", apologyData.hero.subtitle);
    setText("intro-title", apologyData.intro.title);
    setText("intro-subtitle", apologyData.intro.subtitle);
    setText("gallery-heading", apologyData.gallery.heading);
    setText("gallery-subtitle", apologyData.gallery.subtitle);
    setText("notes-main-title", apologyData.notesTitle);
    setText("editable-letter", apologyData.letterDefault);
    setText("closing-title", apologyData.closing.title);
    setText("btn-baikan", apologyData.closing.yesButton);
    setText("btn-butuh-waktu", apologyData.closing.waitButton);

    // Render ilustrasi beruang
    setImage("img-bear-hero", apologyData.images.heroBear, "assets/bear-hero.svg");
    setImage("img-bear-intro", apologyData.images.introBear, "assets/bear-intro.svg");
    setImage("img-bear-closing", apologyData.images.closingBear, "assets/bear-closing.svg");

    // Render caption polaroid
    apologyData.galleryCaptions.forEach((caption, index) => {
        setText(`cap-${index}`, caption);
    });

    // Render foto galeri manual dari data.js
    const galleryMap = {
        p1: "prev-p1",
        p2: "prev-p2",
        p3: "prev-p3",
        p4: "prev-p4",
        f1: "prev-f1",
        f2: "prev-f2",
        f3: "prev-f3"
    };

    Object.keys(galleryMap).forEach((key) => {
        setImage(galleryMap[key], apologyData.galleryImages[key], "assets/placeholder-photo.svg");
    });

    // Render notes/janji
    const notesContainer = byId("notes-container");
    if (notesContainer) {
        notesContainer.innerHTML = "";
        apologyData.notes.forEach((noteText) => {
            const noteDiv = document.createElement("div");
            noteDiv.className = "note-item";
            noteDiv.innerText = noteText;
            notesContainer.appendChild(noteDiv);
        });
    }

    // Modal custom
    const cuteModal = byId("cute-modal");
    const modalMessage = byId("modal-message");
    const modalCloseBtn = byId("modal-close-btn");
    let activeCallback = null;

    function showCuteAlert(message, callback = null) {
        if (!cuteModal || !modalMessage) return;
        modalMessage.innerHTML = message;
        cuteModal.classList.remove("hidden");
        activeCallback = callback;
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", () => {
            cuteModal.classList.add("hidden");
            if (typeof activeCallback === "function") {
                activeCallback();
                activeCallback = null;
            }
        });
    }

    if (cuteModal) {
        cuteModal.addEventListener("click", (event) => {
            if (event.target === cuteModal) {
                cuteModal.classList.add("hidden");
                activeCallback = null;
            }
        });
    }

    // Helper untuk membuka step berikutnya
    function revealAndScroll(nextWrapperId) {
        const nextTarget = byId(nextWrapperId);
        if (!nextTarget) return;

        nextTarget.classList.remove("hidden");
        setTimeout(() => {
            nextTarget.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
    }

    // Navigasi step
    const btnMaaf = byId("btn-maaf");
    const btnKesempatan = byId("btn-kesempatan");
    const btnStep3 = byId("btn-to-step3");
    const btnStep4 = byId("btn-to-step4");
    const btnStep5 = byId("btn-to-step5");
    const btnStep6 = byId("btn-to-step6");

    if (btnMaaf) {
        btnMaaf.addEventListener("click", () => {
            showCuteAlert(apologyData.messages.maaf, () => revealAndScroll("wrapper-step2"));
        });
    }

    if (btnKesempatan) {
        btnKesempatan.addEventListener("click", () => {
            showCuteAlert(apologyData.messages.kesempatan, () => revealAndScroll("wrapper-step2"));
        });
    }

    if (btnStep3) btnStep3.addEventListener("click", () => revealAndScroll("wrapper-step3"));
    if (btnStep4) btnStep4.addEventListener("click", () => revealAndScroll("wrapper-step4"));
    if (btnStep5) btnStep5.addEventListener("click", () => revealAndScroll("wrapper-step5"));
    if (btnStep6) btnStep6.addEventListener("click", () => revealAndScroll("wrapper-step6"));

    // Tombol “gamau dulu” dibuat menghindar, support laptop dan HP
    const btnGamau = byId("btn-gamau");
    if (btnGamau) {
        const moveNoButton = () => {
            btnGamau.style.position = "absolute";
            const randomX = Math.floor(Math.random() * 220) - 110;
            const randomY = Math.floor(Math.random() * 100) - 50;
            btnGamau.style.transform = `translate(${randomX}px, ${randomY}px)`;
        };

        btnGamau.addEventListener("mouseover", moveNoButton);
        btnGamau.addEventListener("touchstart", (event) => {
            event.preventDefault();
            moveNoButton();
        }, { passive: false });
    }

    // Musik manual dari data.js
    const audio = byId("main-audio");
    const playBtn = byId("play-btn");
    const progressBar = byId("music-progress");
    const timeCurrent = byId("time-current");
    const timeTotal = byId("time-total");
    const playerBadge = byId("player-badge");

    setText("track-title", apologyData.music.defaultTitle);
    setText("track-artist", apologyData.music.defaultArtist);

    if (audio && apologyData.music.src) {
        audio.src = apologyData.music.src;
    } else if (playBtn) {
        playBtn.disabled = true;
        playBtn.innerText = "▶";
        if (playerBadge) playerBadge.innerText = "file lagu belum dipasang di data.js";
    }

    if (playBtn && audio) {
        playBtn.addEventListener("click", async () => {
            if (!audio.src) {
                showCuteAlert("File lagu belum dipasang.<br>Isi bagian music.src di data.js ya 🎵");
                return;
            }

            try {
                if (audio.paused) {
                    await audio.play();
                    playBtn.innerText = "⏸";
                } else {
                    audio.pause();
                    playBtn.innerText = "▶";
                }
            } catch (error) {
                showCuteAlert("Lagu belum bisa diputar.<br>Pastikan file lagu ada di folder assets dan path di data.js sudah benar 🎵");
            }
        });

        audio.addEventListener("loadedmetadata", () => {
            if (audio.duration && !Number.isNaN(audio.duration)) {
                timeTotal.innerText = formatTime(audio.duration);
            }
        });

        audio.addEventListener("timeupdate", () => {
            const current = audio.currentTime || 0;
            const duration = audio.duration || 0;

            timeCurrent.innerText = formatTime(current);

            if (duration && !Number.isNaN(duration)) {
                const pct = Math.min((current / duration) * 100, 100);
                progressBar.style.width = `${pct}%`;
                timeTotal.innerText = formatTime(duration);
            }
        });

        audio.addEventListener("ended", () => {
            playBtn.innerText = "▶";
            progressBar.style.width = "0%";
            timeCurrent.innerText = "0:00";
        });
    }

    // Closing confetti
    const btnBaikan = byId("btn-baikan");
    if (btnBaikan) {
        btnBaikan.addEventListener("click", function() {
            if (typeof confetti === "function") {
                confetti({
                    particleCount: 180,
                    spread: 85,
                    origin: { y: 0.6 },
                    colors: ["#ffccd5", "#ffffff", "#d4a373", "#7f5539"]
                });
            }

            showCuteAlert(apologyData.messages.baikan);
            this.innerText = "Yayy! Kita baikan 🥰❤️";
            this.style.background = "#ffccd5";
            this.style.color = "#7f5539";
        });
    }

    const btnButuhWaktu = byId("btn-butuh-waktu");
    if (btnButuhWaktu) {
        btnButuhWaktu.addEventListener("click", () => {
            showCuteAlert(apologyData.messages.butuhWaktu);
        });
    }
});

function formatTime(secs) {
    const safeSecs = Number.isFinite(secs) ? secs : 0;
    const m = Math.floor(safeSecs / 60);
    let s = Math.floor(safeSecs % 60);
    if (s < 10) s = `0${s}`;
    return `${m}:${s}`;
}
