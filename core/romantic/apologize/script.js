// script.js

document.addEventListener("DOMContentLoaded", () => {
    // --- FITUR KHUSUS JUALAN: LOCK & UNLOCK TOMBOL UPLOAD ---
    let clickCount = 0;
    const heroTitle = document.getElementById('hero-title');

    if (heroTitle) {
        heroTitle.style.cursor = 'pointer'; // Membuat judul bisa diklik
        heroTitle.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 5) {
                document.body.classList.toggle('admin-mode');
                
                // Cek apakah sekarang mode admin atau preview
                if(document.body.classList.contains('admin-mode')) {
                    showCuteAlert('🔓 Mode Admin Aktif!<br>Sekarang kamu bisa upload foto dan lagu klien.', null);
                } else {
                    showCuteAlert('🔒 Mode Preview Aktif!<br>Tombol upload berhasil disembunyikan kembali.', null);
                }
                clickCount = 0; // Reset hitungan klik
            }
            
            // Reset hitungan jika dalam 3 detik tidak diklik lagi
            setTimeout(() => { clickCount = 0; }, 3000);
        });
    }
    // 1. Ambil & Render Data serta Ilustrasi Gambar dari data.js
    document.getElementById('hero-title').innerText = apologyData.hero.title;
    document.getElementById('hero-subtitle').innerHTML = apologyData.hero.subtitle;
    document.getElementById('intro-title').innerText = apologyData.intro.title;
    document.getElementById('intro-subtitle').innerText = apologyData.intro.subtitle;
    document.getElementById('notes-main-title').innerText = apologyData.notesTitle;
    document.getElementById('editable-letter').innerText = apologyData.letterDefault;

    // Set Sumber File Gambar Ilustrasi Beruang Seksi
    document.getElementById('img-bear-hero').src = apologyData.images.heroBear;
    document.getElementById('img-bear-intro').src = apologyData.images.introBear;
    document.getElementById('img-bear-closing').src = apologyData.images.closingBear;

    // Render Captions Polaroid
    apologyData.galleryCaptions.forEach((caption, index) => {
        const capElement = document.getElementById(`cap-${index}`);
        if(capElement) capElement.innerText = caption;
    });

    // Render Grid Notes
    const notesContainer = document.getElementById('notes-container');
    apologyData.notes.forEach(noteText => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-item';
        noteDiv.innerText = noteText;
        notesContainer.appendChild(noteDiv);
    });

    // KONTROL MODAL ALERT KUSTOM
    const cuteModal = document.getElementById('cute-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    let activeCallback = null;

    function showCuteAlert(message, callback) {
        modalMessage.innerHTML = message;
        cuteModal.classList.remove('hidden');
        activeCallback = callback;
    }

    modalCloseBtn.addEventListener('click', () => {
        cuteModal.classList.add('hidden');
        if (activeCallback) {
            activeCallback();
            activeCallback = null;
        }
    });

    // Helper Fungsi untuk Membuka Step Selanjutnya & Scroll Halus
    function revealAndScroll(nextWrapperId) {
        const nextTarget = document.getElementById(nextWrapperId);
        if (nextTarget) {
            nextTarget.classList.remove('hidden');
            setTimeout(() => {
                nextTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
    }

    // 2. LOGIKA FLOW STEP-BY-STEP NAVIGASI
    document.getElementById('btn-maaf').addEventListener('click', () => {
        showCuteAlert('Makasih banyak udah dimaafin! 🥺❤️<br>Sekarang yuk intip kejutan di bawah..', () => {
            revealAndScroll('wrapper-step2');
        });
    });
    
    document.getElementById('btn-kesempatan').addEventListener('click', () => {
        showCuteAlert('Makasih banyakk kesempatannya!<br>Janji ga bakal diulangin lagi ya sayang 🌹', () => {
            revealAndScroll('wrapper-step2');
        });
    });

    document.getElementById('btn-to-step3').addEventListener('click', () => {
        revealAndScroll('wrapper-step3');
    });

    document.getElementById('btn-to-step4').addEventListener('click', () => {
        revealAndScroll('wrapper-step4');
    });

    document.getElementById('btn-to-step5').addEventListener('click', () => {
        revealAndScroll('wrapper-step5');
    });

    document.getElementById('btn-to-step6').addEventListener('click', () => {
        revealAndScroll('wrapper-step6');
    });

    // TOMBOL MENGHINDAR ("gamau dulu")
    const btnGamau = document.getElementById('btn-gamau');
    if (btnGamau) {
        btnGamau.addEventListener('mouseover', function() {
            this.style.position = 'absolute';
            const randomX = Math.floor(Math.random() * 260) - 130; 
            const randomY = Math.floor(Math.random() * 120) - 60;  
            this.style.transform = `translate(${randomX}px, ${randomY}px)`;
        });
    }

    // LOGIKA PEMUTAR MUSIK (Sudah otomatis terhubung ke folder assets)
    const audio = document.getElementById('main-audio');
    const playBtn = document.getElementById('play-btn');
    const progressBar = document.getElementById('music-progress');
    const timeCurrent = document.getElementById('time-current');
    const timeTotal = document.getElementById('time-total');

    // Mengatur lagu default dari folder assets sejak web dimuat
    if (audio) {
        audio.src = "assets/lagu-kita.mp3"; // Sesuaikan dengan nama file lagu kamu di folder assets
        document.getElementById('track-title').innerText = "Kemesraan"; // Ganti jadi judul lagumu
        document.getElementById('track-artist').innerText = "Iwan Fals"; // Ganti jadi penyanyinya
    }

    if(playBtn && audio) {
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.innerText = '⏸';
            } else {
                audio.pause();
                playBtn.innerText = '▶';
            }
        });

        audio.addEventListener('timeupdate', () => {
            const current = audio.currentTime;
            const duration = audio.duration || 0;
            const pct = (current / duration) * 100;
            progressBar.style.width = pct + '%';
            
            timeCurrent.innerText = formatTime(current);
            if(duration) timeTotal.innerText = formatTime(duration);
        });

        audio.addEventListener('ended', () => {
            playBtn.innerText = '▶';
            progressBar.style.width = '0%';
        });
    }


    // CLOSING CONFETTI
    const btnBaikan = document.getElementById('btn-baikan');
    if (btnBaikan) {
        btnBaikan.addEventListener('click', function() {
            confetti({
                particleCount: 180,
                spread: 85,
                origin: { y: 0.6 },
                colors: ['#ffccd5', '#ffffff', '#d4a373', '#7f5539']
            });
            showCuteAlert('Yeeey kita baikan! 🥰❤️<br>Mulai sekarang ga boleh ngambek lagi yaa sayangg!', null);
            this.innerText = "Yayy! Kita baikan 🥰❤️";
            this.style.background = '#ffccd5';
            this.style.color = '#7f5539';
        });
    }

    document.getElementById('btn-butuh-waktu').addEventListener('click', () => {
        showCuteAlert('Boleh kok, ambil waktu sebanyak yang kamu butuh yaa.. Aku bakal setia tungguin di sini 🥺', null);
    });
});

function triggerUpload(id) {
    document.getElementById(id).click();
}

function handleImage(input, previewId, placeholderId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById(previewId);
            img.src = e.target.result;
            img.style.display = 'block';
            if(placeholderId) document.getElementById(placeholderId).style.display = 'none';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function handleMusic(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const audio = document.getElementById('main-audio');
        
        document.getElementById('track-title').innerText = file.name.replace(/\.[^/.]+$/, "");
        document.getElementById('track-artist').innerText = "Lagu Pilihan Cinta";
        
        audio.src = URL.createObjectURL(file);
        audio.play().then(() => {
            document.getElementById('play-btn').innerText = '⏸';
        }).catch(err => console.log("Autoplay ditahan browser"));
    }
}

function formatTime(secs) {
    let m = Math.floor(secs / 60);
    let s = Math.floor(secs % 60);
    if (s < 10) s = '0' + s;
    return m + ':' + s;
}