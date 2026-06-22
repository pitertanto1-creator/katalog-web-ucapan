// script.js

document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);

    function setText(id, value) {
        const el = $(id);
        if (el) el.innerText = value || "";
    }

    function setHTML(id, value) {
        const el = $(id);
        if (el) el.innerHTML = value || "";
    }

    function setImage(id, src) {
        const img = $(id);

        if (img && src) {
            img.src = src;
            img.style.display = "block";
        }
    }

    // Render data utama
    setText("hero-title", apologyData.hero.title);
    setHTML("hero-subtitle", apologyData.hero.subtitle);

    setText("intro-title", apologyData.intro.title);
    setText("intro-subtitle", apologyData.intro.subtitle);

    setText("gallery-heading", apologyData.gallery.title);
    setText("gallery-subtitle", apologyData.gallery.subtitle);

    setText("notes-main-title", apologyData.notesTitle);
    setText("editable-letter", apologyData.letterDefault);

    setText("closing-title", apologyData.closing.title);
    setText("btn-baikan", apologyData.closing.buttonText);

    // Render gambar beruang
    setImage("img-bear-hero", apologyData.images.heroBear);
    setImage("img-bear-intro", apologyData.images.introBear);
    setImage("img-bear-closing", apologyData.images.closingBear);

    // Render caption galeri
    apologyData.galleryCaptions.forEach((caption, index) => {
        setText(`cap-${index}`, caption);
    });

    // Render foto JPG galeri
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
        const imagePath = apologyData.galleryImages[key];
        setImage(galleryMap[key], imagePath);
    });

    // Render notes
    const notesContainer = $("notes-container");

    if (notesContainer) {
        notesContainer.innerHTML = "";

        apologyData.notes.forEach((noteText) => {
            const noteDiv = document.createElement("div");
            noteDiv.className = "note-item";
            noteDiv.innerText = noteText;
            notesContainer.appendChild(noteDiv);
        });
    }

    // Modal
    const cuteModal = $("cute-modal");
    const modalMessage = $("modal-message");
    const modalCloseBtn = $("modal-close-btn");
    let activeCallback = null;

    function showCuteAlert(message, callback) {
        if (!cuteModal || !modalMessage) return;

        modalMessage.innerHTML = message;
        cuteModal.classList.remove("hidden");
        activeCallback = callback || null;
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", () => {
            if (cuteModal) cuteModal.classList.add("hidden");

            if (activeCallback) {
                activeCallback();
                activeCallback = null;
            }
        });
    }

    if (cuteModal) {
        cuteModal.addEventListener("click", (event) => {
            if (event.target === cuteModal) {
                cuteModal.classList.add("hidden");

                if (activeCallback) {
                    activeCallback();
                    activeCallback = null;
                }
            }
        });
    }

    // Buka step selanjutnya
    function revealAndScroll(nextWrapperId) {
        const nextTarget = $(nextWrapperId);

        if (nextTarget) {
            nextTarget.classList.remove("hidden");

            setTimeout(() => {
                nextTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 150);
        }
    }

    // Tombol utama
    const btnMaaf = $("btn-maaf");

    if (btnMaaf) {
        btnMaaf.addEventListener("click", () => {
            showCuteAlert(
                apologyData.modalMessages.forgive,
                () => revealAndScroll("wrapper-step2")
            );
        });
    }

    // Tombol lanjut
    const btnToStep3 = $("btn-to-step3");
    const btnToStep4 = $("btn-to-step4");
    const btnToStep5 = $("btn-to-step5");
    const btnToStep6 = $("btn-to-step6");

    if (btnToStep3) {
        btnToStep3.addEventListener("click", () => {
            revealAndScroll("wrapper-step3");
        });
    }

    if (btnToStep4) {
        btnToStep4.addEventListener("click", () => {
            revealAndScroll("wrapper-step4");
        });
    }

    if (btnToStep5) {
        btnToStep5.addEventListener("click", () => {
            revealAndScroll("wrapper-step5");
        });
    }

    if (btnToStep6) {
        btnToStep6.addEventListener("click", () => {
            revealAndScroll("wrapper-step6");
        });
    }

    // Tombol "gamau dulu" menghindar
    const btnGamau = $("btn-gamau");

    function moveNoButton() {
        if (!btnGamau) return;

        const randomX = Math.floor(Math.random() * 180) - 90;
        const randomY = Math.floor(Math.random() * 90) - 45;

        btnGamau.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }

    if (btnGamau) {
        btnGamau.addEventListener("mouseover", moveNoButton);
        btnGamau.addEventListener("touchstart", moveNoButton);
        btnGamau.addEventListener("click", moveNoButton);
    }

    // Musik
    const audio = $("main-audio");
    const playBtn = $("play-btn");
    const progressBar = $("music-progress");
    const timeCurrent = $("time-current");
    const timeTotal = $("time-total");

    if (audio) {
        audio.src = apologyData.music.src;
        setText("track-title", apologyData.music.defaultTitle);
        setText("track-artist", apologyData.music.defaultArtist);
    }

    if (audio && playBtn) {
        playBtn.addEventListener("click", () => {
            if (audio.paused) {
                audio.play()
                    .then(() => {
                        playBtn.innerText = "⏸";
                    })
                    .catch(() => {
                        showCuteAlert("Klik sekali lagi yaa, browser kadang menahan musik otomatis 🥺", null);
                    });
            } else {
                audio.pause();
                playBtn.innerText = "▶";
            }
        });

        audio.addEventListener("loadedmetadata", () => {
            if (timeTotal && audio.duration && !isNaN(audio.duration)) {
                timeTotal.innerText = formatTime(audio.duration);
            }
        });

        audio.addEventListener("timeupdate", () => {
            const current = audio.currentTime;
            const duration = audio.duration;

            if (timeCurrent) {
                timeCurrent.innerText = formatTime(current);
            }

            if (progressBar && duration && !isNaN(duration)) {
                const pct = (current / duration) * 100;
                progressBar.style.width = `${pct}%`;
            }
        });

        audio.addEventListener("ended", () => {
            playBtn.innerText = "▶";

            if (progressBar) {
                progressBar.style.width = "0%";
            }
        });
    }

    // Tombol closing
    const btnBaikan = $("btn-baikan");

    if (btnBaikan) {
        btnBaikan.addEventListener("click", function () {
            if (typeof confetti === "function") {
                confetti({
                    particleCount: 180,
                    spread: 85,
                    origin: { y: 0.6 },
                    colors: ["#ffccd5", "#ffffff", "#d4a373", "#7f5539"]
                });
            }

            showCuteAlert(apologyData.modalMessages.final, null);

            this.innerText = "Yayy! Kita baikan 🥰❤️";
            this.style.background = "#ffccd5";
            this.style.color = "#7f5539";
        });
    }
});

function formatTime(secs) {
    if (!secs || isNaN(secs)) return "0:00";

    const m = Math.floor(secs / 60);
    let s = Math.floor(secs % 60);

    if (s < 10) s = "0" + s;

    return `${m}:${s}`;
}