(() => {
  'use strict';

  // =========================
  // State
  // =========================
  let wishPower = 0;
  let isBlowing = false;
  let blowInterval = null;
  let isCandleOut = false;

  let micStream = null;
  let micActive = false;
  let audioCtx = null;
  let analyser = null;

  let wishes = [];

  // =========================
  // DOM cache
  // =========================
  const $ = (id) => document.getElementById(id);

  const el = {
    flame: $('flame'),
    flameGlow: $('flameGlow'),
    smoke: $('smoke'),

    progressBar: $('progressBar'),
    progressBar2: $('progressBar2'),
    progressLabel: $('progressLabel'),
    powerStatus: $('powerStatus'),

    ringCircle: $('ringCircle'),

    wishInput: $('wishInput'),
    addWishBtn: $('addWishBtn'),
    wishesList: $('wishesList'),
    wishInputHint: $('wishInputHint'),
    tapHint: $('tapHint'),
    charCountEl: $('charCount'),

    lockedPlaceholder: $('lockedPlaceholder'),
    unlockedContent: $('unlockedContent'),

    micBtn: $('micBtn'),
    micLabel: $('micLabel'),

    petalContainer: $('petalContainer'),
    magicRing: $('magicRing'),

    candleInteract: $('candleInteract'),

    toast: $('toast'),

    recipientName: $('recipientName'),
    messageSender: $('messageSender'),
    footerName: $('footerName'),
    personalMessage: $('personalMessage'),
    surpriseText: $('surpriseText'),
  };

  // =========================
  // Helpers
  // =========================
  const splitLinesToBr = (str) => String(str).replace(/\n/g, '<br/>');

  function showToast(msg) {
    if (!el.toast) return;
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    setTimeout(() => el.toast.classList.remove('show'), 2500);
  }

  function persist(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {}
  }

  // =========================
  // Wishes
  // =========================
  function renderWishCard(w) {
    const card = document.createElement('div');
    card.className = 'wish-card';

    const wrap = document.createElement('div');
    wrap.className = 'flex items-start gap-2 text-white';

    const emoji = document.createElement('span');
    emoji.className = 'text-xl';
    emoji.textContent = w.emoji;

    const p = document.createElement('p');
    p.className = 'text-xs font-semibold flex-1';
    p.textContent = w.text;

    wrap.appendChild(emoji);
    wrap.appendChild(p);
    card.appendChild(wrap);

    el.wishesList?.prepend(card);
  }

  function loadWishes() {
    try {
      const saved = localStorage.getItem('blowbloom_wishes');
      if (!saved) return;
      wishes = JSON.parse(saved) || [];
      wishes.forEach(renderWishCard);
    } catch (_) {}
  }

  function addWish() {
    const text = el.wishInput?.value?.trim();
    if (!text) return;

    const wish = { id: Date.now(), text, emoji: '🌸' };
    wishes.push(wish);
    renderWishCard(wish);

    if (el.wishInput) el.wishInput.value = '';
    if (el.charCountEl) el.charCountEl.textContent = '0/120';

    persist('blowbloom_wishes', JSON.stringify(wishes));
  }

  function unlockWishInput() {
    if (el.wishInput) el.wishInput.disabled = false;
    if (el.addWishBtn) el.addWishBtn.disabled = false;

    if (el.wishInputHint) el.wishInputHint.textContent = '✏️ Tulis harapanmu sekarang!';
    if (el.tapHint) el.tapHint.innerHTML = '<p class="text-white text-sm font-semibold">🔥 Teruskan tiupanmu!</p>';
  }

  // =========================
  // Progress / Gameplay
  // =========================
  function updateProgress() {
    const pct = Math.round(wishPower);

    if (el.progressBar) el.progressBar.style.width = pct + '%';
    if (el.progressBar2) el.progressBar2.style.width = pct + '%';
    if (el.progressLabel) el.progressLabel.textContent = pct + '%';
    if (el.ringCircle) el.ringCircle.style.strokeDashoffset = 408 - (408 * wishPower) / 100;

    if (el.magicRing) {
      el.magicRing.style.opacity = 0.4 + (wishPower / 100) * 0.6;
      el.magicRing.style.transform = `rotate(${wishPower * 3.6}deg) scale(${1 + (wishPower / 100) * 0.1})`;
    }

    if (!isCandleOut && el.flame) {
      el.flame.style.transform = `scale(${Math.max(0.2, 1 - (wishPower / 100) * 0.7)})`;
      el.flame.style.opacity = String(Math.max(0.3, 1 - (wishPower / 100) * 0.6));
    }

    if (wishPower < 10) el.powerStatus.textContent = '';
    else if (wishPower < 50) el.powerStatus.textContent = '🌬️ Tiup terus sampai penuh, bestie!';
    else if (wishPower < 90) el.powerStatus.textContent = '💪 Energi harapan semakin membesar!';
    else el.powerStatus.textContent = '🎉 Sikit lagi terwujud!!! ✨';

    if (wishPower >= 10 && el.wishInput?.disabled) unlockWishInput();

    persist('blowbloom_power', String(wishPower));
  }

  function stopBlow() {
    isBlowing = false;
    if (blowInterval) clearInterval(blowInterval);
    blowInterval = null;
    if (el.ringCircle) el.ringCircle.style.strokeDashoffset = '408';
  }

  function startBlow(e) {
    if (e && e.cancelable) e.preventDefault();
    if (isCandleOut) return;

    isBlowing = true;
    blowInterval = setInterval(() => {
      if (!isBlowing || isCandleOut) {
        stopBlow();
        return;
      }

      wishPower = Math.min(100, wishPower + 1.5);
      updateProgress();
      spawnPetals();

      if (wishPower >= 100) {
        stopBlow();
        extinguishCandle();
        triggerFullBloom(true);
      }
    }, 50);
  }

  function spawnPetals() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.textContent = ['🌸', '✨', '💖', '🌟'][Math.floor(Math.random() * 4)];

    const rect = el.candleInteract?.getBoundingClientRect();
    if (!rect) return;

    petal.style.cssText = `left: ${rect.left + rect.width / 2 + (Math.random() - 0.5) * 40}px; top: ${rect.top + window.scrollY}px; font-size: ${12 + Math.random() * 12}px;`;
    el.petalContainer?.appendChild(petal);
    setTimeout(() => petal.remove(), 2300);
  }

  function extinguishCandle() {
    isCandleOut = true;
    el.flame?.classList.add('extinguished');
    el.flameGlow?.classList.add('extinguished');
    el.smoke?.classList.add('active');

    if (micActive) toggleMic();
  }

  function spawnBloomBurst() {
    const b = document.createElement('div');
    b.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); font-size:5rem; z-index:1001;';
    b.textContent = '🌸';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1000);
  }

  function triggerFullBloom(anim) {
    if (anim) {
      startConfetti?.();
      spawnBloomBurst();
      showToast('🎉 Selamat Ulang Tahun! 🌸');
    }

    el.lockedPlaceholder?.classList.add('hidden');
    el.unlockedContent?.classList.remove('hidden');

    setTimeout(() => {
      document.querySelectorAll('#unlockedContent .reveal').forEach((node) => node.classList.add('visible'));
    }, 50);
  }

  // =========================
  // Mic detection
  // =========================
  async function toggleMic() {
    if (micActive) {
      micStream?.getTracks().forEach((t) => t.stop());
      micStream = null;

      if (audioCtx) {
        try {
          await audioCtx.close();
        } catch (_) {}
      }

      audioCtx = null;
      analyser = null;
      micActive = false;

      el.micBtn?.classList.remove('active');
      if (el.micLabel) el.micLabel.textContent = 'Ketuk untuk Tiup Pakai Mic';
      return;
    }

    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      const source = audioCtx.createMediaStreamSource(micStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      micActive = true;
      el.micBtn?.classList.add('active');
      if (el.micLabel) el.micLabel.textContent = 'Mendengarkan tiupan...';

      detectBlow();
    } catch (_) {
      showToast('Izinkan mic dahulu ya!');
    }
  }

  function detectBlow() {
    if (!micActive || !analyser || isCandleOut) return;

    const arr = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(arr);

    const avg = arr.reduce((s, v) => s + v, 0) / arr.length;
    if (avg > 25) {
      wishPower = Math.min(100, wishPower + avg / 50);
      updateProgress();

      if (wishPower >= 100) {
        extinguishCandle();
        triggerFullBloom(true);
        return;
      }
    }

    requestAnimationFrame(detectBlow);
  }

  // =========================
  // Surprise / footer actions
  // =========================
  function toggleSurprise() {
    const m = $('surpriseMsg');
    const b = $('surpriseBtn');
    if (!m || !b) return;

    if (m.classList.contains('open')) {
      m.classList.remove('open');
      b.textContent = '🎊 Buka Kejutan Rahasia!';
    } else {
      m.classList.add('open');
      b.textContent = '🙈 Tutup Kejutan';
    }
  }

  function copyLink() {
    navigator.clipboard?.writeText(CONFIG.shareUrl);
    showToast('🔗 Link disalin!');
  }

  function createOwn() {
    window.open('https://kadolink.id', '_blank');
  }

  // =========================
  // Init
  // =========================
  function init() {
    if (el.recipientName) el.recipientName.textContent = CONFIG.recipientName;
    if (el.messageSender) el.messageSender.textContent = '— ' + CONFIG.senderName;
    if (el.footerName) el.footerName.textContent = CONFIG.recipientName;

    if (el.personalMessage) el.personalMessage.innerHTML = splitLinesToBr(CONFIG.personalMsg);
    if (el.surpriseText) el.surpriseText.innerHTML = splitLinesToBr(CONFIG.surpriseMsg);

    loadWishes();

    try {
      const savedPower = parseFloat(localStorage.getItem('blowbloom_power') || '0');
      if (savedPower > 0) {
        wishPower = savedPower;
        updateProgress();

        if (savedPower >= 10) unlockWishInput();
        if (savedPower >= 100) triggerFullBloom(false);
      }
    } catch (_) {}

    el.wishInput?.addEventListener('input', () => {
      if (el.charCountEl) el.charCountEl.textContent = el.wishInput.value.length + '/120';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));

    el.candleInteract?.addEventListener('mousedown', startBlow);
    el.candleInteract?.addEventListener('mouseup', stopBlow);
    el.candleInteract?.addEventListener('touchstart', startBlow, { passive: false });
    el.candleInteract?.addEventListener('touchend', stopBlow);

    // Event bindings untuk menggantikan onclick inline (jaga agar kompatibel)
    el.micBtn?.addEventListener('click', toggleMic);
    el.addWishBtn?.addEventListener('click', addWish);

    const surpriseBtn = $('surpriseBtn');
    surpriseBtn?.addEventListener('click', toggleSurprise);

    const copyBtn = $('copyLinkBtn');
    copyBtn?.addEventListener('click', copyLink);

    const ownBtn = $('createOwnBtn');
    ownBtn?.addEventListener('click', createOwn);
  }


  document.addEventListener('DOMContentLoaded', init);
})();

