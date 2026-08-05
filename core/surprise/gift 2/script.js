// ========================================
// KADOLINK - 3D Virtual Unboxing Simulator
// Clean JavaScript - Vanilla ES6
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const giftBox = document.getElementById('gift-box');
    const box3d = document.getElementById('box-3d');
    const lid = document.getElementById('lid');
    const instruction = document.getElementById('instruction');
    const tapCountEl = document.getElementById('tap-count');
    const musicBtn = document.getElementById('music-btn');
    const audio = document.getElementById('bg-music');
    const revealSection = document.getElementById('reveal-section');
    const giftWrapper = document.getElementById('gift-wrapper');

    // === State ===
    let tapCount = 0;
    const MAX_TAPS = 5;
    let isUnboxed = false;

    // === Create Subtle Background Particles ===
    function createBackgroundParticles() {
        const container = document.getElementById('bg-particles');
        const colors = ['#e85d75', '#f4d35e', '#ffffff'];
        
        for (let i = 0; i < 18; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random size
            const size = Math.random() * 5 + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random color
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.opacity = Math.random() * 0.4 + 0.15;
            
            // Random animation duration & delay
            const duration = Math.random() * 12 + 14;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `-${Math.random() * 15}s`;
            
            container.appendChild(particle);
        }
    }

    // === Update Instruction Text ===
    function updateInstruction() {
        const remaining = MAX_TAPS - tapCount;
        
        if (remaining > 1) {
            instruction.innerHTML = `Ketuk kotaknya <span>${remaining}</span> kali lagi...`;
        } else if (remaining === 1) {
            instruction.innerHTML = `Satu ketukan lagi...<br><span style="color:#f4d35e">Siap-siap ya! ✨</span>`;
        } else {
            instruction.style.transition = 'all 0.4s ease';
            instruction.style.opacity = '0';
        }
    }

    // === Trigger Box Shake ===
    function triggerShake() {
        box3d.classList.add('shaking');
        
        setTimeout(() => {
            box3d.classList.remove('shaking');
        }, 650);
    }

    // === Confetti Explosion (Premium Romantic Colors) ===
    function triggerConfettiExplosion() {
        const colors = ['#e85d75', '#f4d35e', '#ff9eb8', '#ffffff', '#c9a227', '#a78bfa'];

        // Main big burst
        confetti({
            particleCount: 280,
            spread: 95,
            origin: { y: 0.65 },
            colors: colors,
            ticks: 200
        });

        // Left side burst
        setTimeout(() => {
            confetti({
                particleCount: 140,
                angle: 60,
                spread: 70,
                origin: { x: 0.1, y: 0.7 },
                colors: colors
            });
        }, 180);

        // Right side burst
        setTimeout(() => {
            confetti({
                particleCount: 140,
                angle: 120,
                spread: 70,
                origin: { x: 0.9, y: 0.7 },
                colors: colors
            });
        }, 280);

        // Final gentle rain
        setTimeout(() => {
            confetti({
                particleCount: 90,
                spread: 120,
                origin: { y: 0.9 },
                colors: colors,
                gravity: 0.6
            });
        }, 650);
    }

    // === The Big Climax - Unboxing Sequence ===
    function triggerUnbox() {
        if (isUnboxed) return;
        isUnboxed = true;

        // 1. Play romantic/celebratory music
        audio.play().catch(() => {
            console.log('%c[Audio] Autoplay blocked — user can tap music button', 'color:#888');
        });

        // 2. Trigger beautiful confetti explosion
        triggerConfettiExplosion();

        // 3. Make lid fly away with 3D rotation
        lid.classList.add('fly-away');

        // 4. Disable further interaction
        giftBox.style.pointerEvents = 'none';
        giftBox.style.cursor = 'default';

        // 5. After lid flies, fade out the entire box
        setTimeout(() => {
            giftWrapper.style.transition = 'opacity 0.7s var(--transition-smooth), transform 0.7s var(--transition-smooth)';
            giftWrapper.style.opacity = '0';
            giftWrapper.style.transform = 'scale(0.92)';

            // 6. Show the reveal section
            setTimeout(() => {
                giftWrapper.style.display = 'none';
                revealSection.style.display = 'block';
                revealSection.style.opacity = '0';

                // Smooth fade in
                requestAnimationFrame(() => {
                    revealSection.style.transition = 'opacity 0.85s var(--transition-smooth)';
                    revealSection.style.opacity = '1';
                    
                    // Scroll to reveal smoothly on mobile
                    setTimeout(() => {
                        revealSection.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }, 600);
                });
            }, 720);
        }, 1250);
    }

    // === Handle Box Tap ===
    function handleBoxTap() {
        if (isUnboxed || tapCount >= MAX_TAPS) return;

        tapCount++;
        
        // Visual feedback - shake
        triggerShake();

        // Update instruction
        updateInstruction();

        // On the 5th tap → Climax!
        if (tapCount === MAX_TAPS) {
            setTimeout(() => {
                triggerUnbox();
            }, 280);
        }
    }

    // === Music Button Toggle ===
    function setupMusicButton() {
        let isPlaying = false;

        musicBtn.addEventListener('click', () => {
            if (!audio.src) return;

            if (isPlaying) {
                audio.pause();
                musicBtn.style.color = '#e85d75';
                musicBtn.querySelector('.music-icon').textContent = '♫';
                isPlaying = false;
            } else {
                audio.play().then(() => {
                    musicBtn.style.color = '#f4d35e';
                    musicBtn.querySelector('.music-icon').textContent = '⏸';
                    isPlaying = true;
                }).catch(err => {
                    console.log('Audio play failed:', err);
                });
            }
        });

        // Auto update icon when music ends or is paused externally
        audio.addEventListener('pause', () => {
            if (!isUnboxed) {
                musicBtn.style.color = '#e85d75';
                musicBtn.querySelector('.music-icon').textContent = '♫';
                isPlaying = false;
            }
        });
    }

    // === Public Functions (for buttons in HTML) ===
    window.replyToGift = function() {
        const btns = document.querySelectorAll('.action-buttons .btn');
        
        btns.forEach(btn => btn.style.transition = 'all 0.3s ease');
        
        // Fun reply action
        const originalText = btns[0].innerHTML;
        btns[0].innerHTML = 'Terima kasih! ❤️';
        btns[0].style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
        
        setTimeout(() => {
            alert('Pesan balasan sudah terkirim ke pengirim! 💌\n\nKamu bisa menambahkan fitur chat atau form balasan di sini nanti.');
            btns[0].innerHTML = originalText;
            btns[0].style.background = 'linear-gradient(135deg, #e85d75, #d63384)';
        }, 1600);
    };

    window.restartUnboxing = function() {
        // Simple reload for demo (in real app you would reset state)
        if (confirm('Mau buka kado lagi dari awal?')) {
            window.location.reload();
        }
    };

    // === Initialize Everything ===
    function init() {
        // Create beautiful floating particles
        createBackgroundParticles();

        // Click / Tap handler on the gift box
        giftBox.addEventListener('click', handleBoxTap);

        // Also allow tapping the whole wrapper
        giftWrapper.addEventListener('click', (e) => {
            if (e.target === giftWrapper || e.target.closest('.gift-box')) {
                handleBoxTap();
            }
        });

        // Music button
        setupMusicButton();

        // Subtle idle animation hint (optional)
        setTimeout(() => {
            if (!isUnboxed && tapCount === 0) {
                box3d.style.transition = 'transform 2.2s ease';
                // Gentle breathing effect
                const idleInterval = setInterval(() => {
                    if (isUnboxed || tapCount > 0) {
                        clearInterval(idleInterval);
                        return;
                    }
                    box3d.style.transform = 'rotateX(14deg) rotateY(-24deg) scale(1.015)';
                    setTimeout(() => {
                        if (!isUnboxed) {
                            box3d.style.transform = 'rotateX(14deg) rotateY(-24deg) scale(1)';
                        }
                    }, 1100);
                }, 4200);
            }
        }, 2800);

        // Keyboard support (for desktop testing)
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                if (!isUnboxed) handleBoxTap();
            }
        });

        // Easter egg: Konami code for instant unbox (dev)
        let konami = '';
        const konamiCode = '38384040373937396665';
        document.addEventListener('keydown', (e) => {
            konami += e.keyCode;
            if (konami.length > 10) konami = konami.slice(-10);
            if (konami === konamiCode && !isUnboxed) {
                tapCount = MAX_TAPS;
                triggerUnbox();
            }
        });

        console.log('%c[KadoLink] 3D Unboxing Simulator initialized successfully ✨', 'color:#e85d75');
    }

    // Boot the experience
    init();
});