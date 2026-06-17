// core/romantic/lovescape/script.js

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvasArea");
    const triggerBtn = document.getElementById("triggerBtn");
    const narrativeText = document.getElementById("narrativeText");
    const bgAudio = document.getElementById("bgAudio");

    let isHeartFormed = false;

    // 1. Tampilkan Teks Awal dan Set Audio
    narrativeText.innerText = lovescapeData.textAwal;
    bgAudio.src = lovescapeData.backsoundUrl;

    // 2. Generate Kartu Foto secara otomatis dari data.js
    lovescapeData.photos.forEach((photo, index) => {
        const card = document.createElement("div");
        card.classList.add("photo-card", "stacked");
        
        // Buat efek rotasi acak tipis agar tumpukan buku terlihat natural
        const randomRot = (index - lovescapeData.photos.length / 2) * 3;
        card.style.setProperty('--rotation', `${randomRot}deg`);
        
        const img = document.createElement("img");
        img.src = photo.url;
        
        card.appendChild(img);
        canvas.appendChild(card);
    });

    const cards = document.querySelectorAll(".photo-card");

    // 3. Fungsi utama transformasi bentuk Hati
    window.transformToHeart = function() {
        if (!isHeartFormed) {
            // Putar musik
            if (bgAudio.paused) bgAudio.play().catch(e => console.log("Audio play blocked"));

            // Ganti teks dengan animasi halus
            narrativeText.style.opacity = 0;
            setTimeout(() => {
                narrativeText.innerText = lovescapeData.textAkhir;
                narrativeText.style.opacity = 1;
            }, 400);

            // Hitung posisi pola hati secara matematis
            const totalCards = cards.length;
            cards.forEach((card, index) => {
                card.classList.remove("stacked");

                // Rumus matematika kurva hati (Heart Shape Formula)
                const angle = (index / totalCards) * 2 * Math.PI - Math.PI / 2;
                const x = 16 * Math.pow(Math.sin(angle), 3);
                const y = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);

                // Skala penyebaran jarak koordinat
                const scaleX = 11; 
                const scaleY = -10; // Dibalik agar arah lancip hati ke bawah

                card.style.transform = `translate(${x * scaleX}px, ${y * scaleY}px) scale(1) rotate(0deg)`;
                card.style.border = "2px solid rgba(244, 63, 94, 0.7)"; // Garis pinggir pink menyala
                card.style.boxShadow = "0 0 20px rgba(244, 63, 94, 0.4)";
            });

            triggerBtn.innerText = "TUTUP ALBUM MEMORI";
            isHeartFormed = true;
        } else {
            // Mengembalikan ke posisi semula (Menumpuk)
            narrativeText.innerText = lovescapeData.textAwal;
            cards.forEach(card => {
                card.removeAttribute("style");
                card.classList.add("stacked");
            });

            triggerBtn.innerText = "BUKA ALBUM MEMORI";
            isHeartFormed = false;
        }
    };

    // Hubungkan fungsi klik ke tombol
    triggerBtn.addEventListener("click", transformToHeart);
});