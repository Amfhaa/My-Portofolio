document.addEventListener('DOMContentLoaded', () => {
    // Disable automatic scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Force scroll to top on load if terminal screen is active
    const terminalScreenEl = document.getElementById('terminal-screen');
    if (terminalScreenEl) {
        window.scrollTo(0, 0);
    }

    // 1. Initial Page Load Animations (deferred until terminal loading completes)
    const initMainPageAnimations = () => {
        // Staggered fade in and up for general texts
        anime({
            targets: '.fade-in-up',
            translateY: [50, 0],
            opacity: [0, 1],
            easing: 'easeOutElastic(1, .8)',
            duration: 1200,
            delay: anime.stagger(150, {start: 200}) // reduced initial delay
        });

        // Word by word fast slide up for hero text
        anime({
            targets: '.hero-word',
            translateY: [30, 0],
            opacity: [0, 1],
            easing: 'easeOutQuint',
            duration: 600,
            delay: anime.stagger(60) // very fast word by word
        });

        // Pop animation for the tags after words finish
        anime({
            targets: '.hero-pop',
            scale: [0, 1],
            opacity: [0, 1],
            easing: 'easeOutElastic(1, .5)',
            duration: 1000,
            delay: anime.stagger(150, {start: 400}) // starts after words
        });

        // Scale in for the profile card
        anime({
            targets: '.fade-in-scale',
            scale: [0.8, 1],
            opacity: [0, 1],
            easing: 'easeOutElastic(1, .6)',
            duration: 1500,
            delay: 400
        });
    };

    // ==========================================
    // RETRO 8-BIT AUDIO SYNTHESIZER ENGINE
    // ==========================================
    class SoundSynth {
        constructor() {
            this.ctx = null;
        }

        init() {
            try {
                if (!this.ctx) {
                    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                }
                if (this.ctx && this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
            } catch (e) {
                console.warn("AudioContext not supported or blocked by browser policies.");
            }
        }

        playKey() {
            this.init();
            if (!this.ctx) return;
            try {
                // Short retro mechanical key-click sound
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(550, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.035);
                
                gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start();
                osc.stop(this.ctx.currentTime + 0.035);
            } catch (e) {}
        }

        playSuccess() {
            this.init();
            if (!this.ctx) return;
            try {
                // Retro 8-bit triple-chime game level-up sound
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'square';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
                osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
                
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.setValueAtTime(0.05, now + 0.24);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start();
                osc.stop(now + 0.42);
            } catch (e) {}
        }

        playError() {
            this.init();
            if (!this.ctx) return;
            try {
                // Retro 8-bit game error buzzer
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(130, now);
                osc.frequency.linearRampToValueAtTime(70, now + 0.18);
                
                gain.gain.setValueAtTime(0.07, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start();
                osc.stop(now + 0.18);
            } catch (e) {}
        }

        playDecryptSweep() {
            this.init();
            if (!this.ctx) return;
            try {
                // Rising sci-fi sweep laser tone for loading bar
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(160, now);
                osc.frequency.linearRampToValueAtTime(720, now + 2.0);
                
                // Add retro wobble via LFO (low frequency oscillator)
                const lfo = this.ctx.createOscillator();
                const lfoGain = this.ctx.createGain();
                lfo.frequency.setValueAtTime(12, now); // 12Hz wobble
                lfoGain.gain.setValueAtTime(25, now); // frequency modulation range
                
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.linearRampToValueAtTime(0.06, now + 1.8);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                lfo.start();
                osc.start();
                
                lfo.stop(now + 2.0);
                osc.stop(now + 2.0);
            } catch (e) {}
        }
    }

    const synth = new SoundSynth();

    // ==========================================
    // STREAMLINED RETRO CRT TERMINAL CONTROLLER
    // ==========================================
    const terminalScreen = document.getElementById('terminal-screen');
    const terminalContent = document.getElementById('terminal-content');
    const terminalInput = document.getElementById('terminal-input');
    const inputDisplay = document.getElementById('input-display');
    const autoBtn = document.getElementById('terminal-auto-btn');
    const popup = document.getElementById('access-granted-popup');
    const popupBar = document.getElementById('popup-bar');
    const deniedPopup = document.getElementById('access-denied-popup');
    const deniedBackBtn = document.getElementById('terminal-denied-back-btn');

    // Boot interaction setup
    const initTerminalInput = () => {
        if (!terminalInput) return;
        
        // Auto-focus terminal on click anywhere inside screen bezel
        if (terminalScreen) {
            terminalScreen.addEventListener('click', () => {
                terminalInput.focus();
                synth.init(); // initialize synth context on click
            });
        }
        
        terminalInput.focus();
    };

    // Execute standard start sequence
    const executeDecryptGUI = () => {
        if (!terminalInput || !popup || !popupBar || !autoBtn) return;

        // Freeze all terminal action interfaces
        terminalInput.disabled = true;
        autoBtn.disabled = true;
        terminalInput.blur();
        
        // Update Status panel state
        const statusVal = document.querySelector('.status-val.locked');
        if (statusVal) {
            statusVal.textContent = 'DECRYPTING...';
            statusVal.style.color = '#00ff33';
            statusVal.style.animation = 'flash-anim 0.3s infinite steps(2)';
        }

        // Trigger sweeping retro sound charging sweep
        synth.playDecryptSweep();

        // Launch Access Granted alert box
        setTimeout(() => {
            popup.classList.add('show');
            
            // Decryption charging progress loop
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.floor(Math.random() * 6) + 3; // realistic loading increments
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);
                    
                    // Collapse retro CRT display
                    setTimeout(() => {
                        triggerCRTShutdown();
                    }, 500);
                }
                popupBar.style.width = progress + '%';
            }, 60);
        }, 400);
    };

    // Show custom Access Denied warning console modal
    const executeAccessDenied = () => {
        if (!terminalInput || !deniedPopup || !autoBtn) return;
        
        // Freeze terminal inputs
        terminalInput.disabled = true;
        autoBtn.disabled = true;
        terminalInput.blur();
        
        // Play error buzzer
        synth.playError();
        
        // Open red warning modal
        deniedPopup.classList.add('show');
    };

    // Return cleanly back to prompt from Access Denied popup
    const handleCloseAccessDenied = () => {
        if (!deniedPopup || !terminalInput || !autoBtn) return;
        
        // Play mechanical key click
        synth.playKey();
        
        // Hide warning modal
        deniedPopup.classList.remove('show');
        
        // Re-enable inputs and clear erroneous input fields
        terminalInput.disabled = false;
        autoBtn.disabled = false;
        terminalInput.value = '';
        inputDisplay.textContent = '';
        
        // Re-focus keyboard cursor
        setTimeout(() => {
            terminalInput.focus();
        }, 100);
    };

    const triggerCRTShutdown = () => {
        if (!terminalScreen) return;
        terminalScreen.classList.add('shutting-down');
        
        // Wait for CSS CRT physics collapse deflection to finish
        setTimeout(() => {
            terminalScreen.style.display = 'none';
            document.body.classList.remove('terminal-active');
            
            // Initialize scroll reveal observers now that terminal is closed
            if (typeof initScrollRevealObservers === 'function') {
                initScrollRevealObservers();
            }
            
            // Trigger Neo-Brutalist portfolio introduction animations
            initMainPageAnimations();
            
            // Start playing backsound automatically from the beginning (0:00) when entering from terminal
            if (typeof startMusicPlayback === 'function') {
                const audioEl = document.getElementById('backsound-audio');
                if (audioEl) {
                    audioEl.currentTime = 0;
                    localStorage.setItem('music-time', '0');
                }
                startMusicPlayback();
            }
        }, 650); // Matches the 0.65s CSS transition
    };

    // Process user prompt entries (start / help / etc)
    const processCommand = (cmdText) => {
        const cmd = cmdText.trim().toLowerCase();
        
        if (cmd === 'start') {
            synth.playSuccess();
            executeDecryptGUI();
        } else {
            executeAccessDenied();
        }
    };

    // Auto-Typist simulator for non-tech/mobile users
    const simulateAutoBoot = () => {
        if (!terminalInput || !inputDisplay || !autoBtn) return;
        
        // Disable interfaces
        autoBtn.disabled = true;
        terminalInput.disabled = true;
        synth.init(); // activate audio node
        
        const targetWord = "start";
        let currentIndex = 0;
        inputDisplay.textContent = "";
        
        const typeNextChar = () => {
            if (currentIndex < targetWord.length) {
                synth.playKey(); // play mechanical keyclick sound
                inputDisplay.textContent += targetWord[currentIndex];
                currentIndex++;
                setTimeout(typeNextChar, 180); // staggered 180ms keystroke speed
            } else {
                // Typist finishes word: play chime and trigger decrypt
                setTimeout(() => {
                    synth.playSuccess();
                    executeDecryptGUI();
                }, 300);
            }
        };
        
        // Begin typing stagger
        setTimeout(typeNextChar, 200);
    };

    // Wire up events
    if (terminalInput && inputDisplay) {
        // Typing mechanical sound feedback
        terminalInput.addEventListener('input', (e) => {
            inputDisplay.textContent = e.target.value;
            synth.playKey();
        });

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const text = terminalInput.value;
                terminalInput.value = '';
                inputDisplay.textContent = '';
                processCommand(text);
            }
        });
    }

    if (autoBtn) {
        autoBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent terminalScreen click trigger
            simulateAutoBoot();
        });
    }

    if (deniedBackBtn) {
        deniedBackBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleCloseAccessDenied();
        });
    }

    // Auto focus on launch
    setTimeout(initTerminalInput, 500);

    // 2. Continuous Decorative Animations
    // Blob shape floating
    anime({
        targets: '.shape-blob',
        translateY: [-15, 15],
        rotate: [-5, 5],
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        duration: 3000
    });

    // Hero sparkles fast blink and shine animation
    anime({
        targets: '.hero-sparkle',
        scale: [0.5, 1.3],
        opacity: [0.1, 1],
        rotate: '1turn',
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        duration: 700,
        delay: anime.stagger(200) // simple stagger to avoid errors
    });

    // Levitate animation for Coding and Design tags
    anime({
        targets: '.levitate',
        translateY: [-4, 4],
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        duration: 1500,
        delay: anime.stagger(200)
    });

    // Star shape rotating and scaling slightly
    anime({
        targets: '.shape-star',
        rotate: '1turn',
        scale: [1, 1.1, 1],
        loop: true,
        easing: 'linear',
        duration: 10000
    });

    // Marquee continuous scroll
    // Duplicate the text to make it seamless
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        anime({
            targets: '.marquee-content',
            translateX: ['0%', '-50%'],
            loop: true,
            easing: 'linear',
            duration: 15000
        });
    }

    // 3. Scroll Reveal Animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate cards when they come into view
                anime({
                    targets: entry.target,
                    translateY: [50, 0],
                    opacity: [0, 1],
                    easing: 'easeOutElastic(1, .8)',
                    duration: 1000,
                    delay: entry.target.dataset.delay || 0
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Custom sequence animation for About Section
    const triggerAboutAnimation = () => {
        const photoWrapper = document.querySelector('.about-photo-wrapper');
        const cards = document.querySelectorAll('.about-card');
        const arrow = document.querySelector('.photo-arrow-overlay');

        if (!photoWrapper) return;

        // 1. Get the center of the photo wrapper
        const photoRect = photoWrapper.getBoundingClientRect();
        const photoCenterX = photoRect.left + photoRect.width / 2;
        const photoCenterY = photoRect.top + photoRect.height / 2;

        // 2. Set the initial position of each card to the center of the photo wrapper and scaled down
        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            const dX = photoCenterX - cardCenterX;
            const dY = photoCenterY - cardCenterY;

            anime.set(card, {
                translateX: dX,
                translateY: dY,
                scale: 0,
                opacity: 0
            });
        });

        // Set photo wrapper initial state
        anime.set(photoWrapper, {
            translateY: 150,
            scale: 0.5,
            opacity: 0
        });

        // Set arrow initial state
        anime.set(arrow, {
            scale: 0,
            opacity: 0
        });

        // 3. Create a Timeline Sequence
        const tl = anime.timeline({
            easing: 'easeOutElastic(1, .8)'
        });

        // Step A: Middle photo wrapper pops up from below
        tl.add({
            targets: '.about-photo-wrapper',
            translateY: [150, 0],
            scale: [0.5, 1],
            opacity: [0, 1],
            duration: 1200
        });

        // Step B: The 4 cards disperse to their original positions (translateX: 0, translateY: 0, scale: 1, opacity: 1)
        tl.add({
            targets: '.about-card',
            translateX: 0,
            translateY: 0,
            scale: 1,
            opacity: 1,
            easing: 'easeOutElastic(1, .75)',
            duration: 1300,
            delay: anime.stagger(150)
        }, '-=800'); // overlap and start dispersing as photo finishes coming up

        // Step C: The arrow overlay pops up last
        const targetScale = window.innerWidth <= 480 ? 0.65 : 1.0;
        tl.add({
            targets: '.photo-arrow-overlay',
            scale: [0, targetScale],
            opacity: [0, 1],
            easing: 'easeOutElastic(1, .6)',
            duration: 800
        }, '-=500'); // start popping up just before last cards finish dispersing
    };

    // Separate IntersectionObserver for the About Section
    const aboutSection = document.getElementById('about');
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger our beautifully synchronized timeline
                triggerAboutAnimation();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // trigger when 15% of #about is in view
        rootMargin: '0px 0px -50px 0px'
    });

    // 4. Hover Interactions
    // Wobble effect for nav links and buttons
    const wobbleElements = document.querySelectorAll('.hover-wobble');
    wobbleElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            anime({
                targets: el,
                rotate: [-4, 4, -2, 2, 0],
                easing: 'easeOutQuad',
                duration: 400
            });
        });
    });

    // Bounce effect for primary buttons
    const bounceElements = document.querySelectorAll('.hover-bounce');
    bounceElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            anime({
                targets: el,
                scale: [1, 1.1, 1],
                easing: 'easeOutElastic(1, .5)',
                duration: 600
            });
        });
    });

    // Project cards subtle lift on hover
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                translateY: -8,
                boxShadow: '14px 14px 0px var(--shadow-color)',
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                translateY: 0,
                boxShadow: '10px 10px 0px var(--shadow-color)',
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });

    // 5. Mobile Menu Toggle Logic
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 6. Scroll to Top Button Logic
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 7. Language Switcher Logic
    const translations = {
        id: {
            "nav-about": "Tentang",
            "nav-projects": "Proyek",
            "nav-contact": "Kontak",
            "nav-credits": "Credits",
            "nav-cta": "Ngobrol Yuk",
            "hero-subtitle": "Web ini dibuat untuk seru seruan ajah, makanya ketikannya ngga sesuai standar KBBI wkwkwkw.",
            "about-title": "Tentang Aku",
            "about-coder-title": "Coder",
            "about-coder-desc": "Begayaan codang coding, orang semuanya vibe coding kok akwokwo",
            "about-designer-title": "Designer",
            "about-designer-desc": "Kalo ini bisa lah, Photoshop, Illustrator, Canva udah mainan hehe.",
            "about-sticker": "SOSOK ASLI!",
            "about-editor-title": "Editor",
            "about-editor-desc": "Dulu ngeditnya di KineMaster, sekarang naik level boss pake Premier Pro.",
            "about-gamer-title": "Gamer",
            "about-gamer-desc": "Kalo ini beneran main, gasken login, mabar kita!",
            "projects-title": "Proyek-proyekku Sebelumnya",
            "project1-title": "Website Ahafest",
            "project1-desc": "Website untuk event Al-Hamidiyah Festival. Mempermudah panitia untuk menginformasikan perihal event dan menjual merchandize.",
            "project1-btn": "Lihat Selengkapnya",
            "project2-title": "Auto I'lan",
            "project2-desc": "Website yang dibikin pas masih jadi pengurus pondok bagian bahasa. Aslinya dibikin karena mager sama rutinitas I'lan (pengumuman bahasa) yang monoton.",
            "project2-btn": "Lihat Selengkapnya",
            "project3-title": "Video Recap ACS",
            "project3-desc": "Video recap untuk event Al-Hamidiyah Championship (ACS). Bikinnya pake laptop tempur seadanya, blue screen 3x sampe mau meledug. Sampe didinginin dibawa AC dan dikasi kipas.",
            "project3-btn": "Nonton",
            "project4-title": "Pemilukasa 25",
            "project4-desc": "Website yang dibuat untuk pemilihan ketua ISPAH (pengurus pondok) dalam sebuah sistem yang digital (mager ngitung kertas satu satu euy).",
            "project4-btn": "Lihat Selengkapnya",
            "projects-more-btn": "Lihat Yang Lain Juga",
            "contact-title": "Diem diem bae dah, ngobrol sini!",
            "contact-desc": "Kalo iseng, mau nanya-nanya, mau mabar, atau sekadar ngajak ngobrol santai, chat aja sini.",
            "footer-credit": "Made with ❤️ by Amfhaa.",
            "terminal-port-label": "PORTFOLIO PORT:",
            "terminal-port-secure": "SECURE [8080]",
            "terminal-state-label": "STATUS SISTEM:",
            "terminal-state-locked": "TERKUNCI",
            "terminal-instruction": ">>> KETIK <span class=\"keyword-highlight\">\"start\"</span> DAN TEKAN ENTER UNTUK MEMBUKA PORTFOLIO",
            "terminal-auto-btn": "AH RIBET AH, PENCET INI AJALAH.",
            "granted-title": "SISTEM AUTENTIKASI",
            "granted-message": "AKSES DIIZINKAN",
            "granted-subtext": "ASLINYA GA ADA LOADING, ANIMASI DOANG...",
            "denied-title": "SISTEM KEAMANAN",
            "granted-subtext": "ASLINYA GA ADA LOADING, ANIMASI DOANG...",
            "denied-title": "SISTEM KEAMANAN",
            "denied-message": "AKSES DITOLAK",
            "denied-subtext": "ERROR: KOCAK, NULIS \"START\" AJA GABISA.<br><br>SILAKAN KETIK <span class=\"keyword-highlight red\">\"start\"</span> LALU TEKAN ENTER,<br>ATAU KALO MAGER, KLIK  TOMBOL [AH RIBET AH, PENCET INI AJALAH] DI LAYAR UTAMA.",
            "denied-back": "KEMBALI KE SHELL",
            "projects-page-title": "Semua Karya & Proyekku",
            "projects-back-btn": "Kembali Ke Beranda",
            "project5-title": "Pemilos 25",
            "project5-desc": "Sama aja penjelasannya kaya card sebelumnya, tapi bedanya ini ketua OSIS bukan ketua ISPAH hehe.",
            "project5-btn": "Lihat Selengkapnya",
            "project6-title": "Kos Dwiga",
            "project6-desc": "Website Property Management System (PMS) buat bisnis kos kosan. Pas website portofolio ini dibikin masih belom jadi PMS nya.",
            "project6-btn": "Belom jadi woi",
            "project7-title": "Narcos Opening Remake",
            "project7-desc": "Video yang terinspirasi dari opening serial Narcos, tapi videonya dari kenang kenangan waktu dipondok.",
            "project7-btn": "Nonton",
            "music-on": "MUSIK: NYALA",
            "music-off": "MUSIK: MATI"
        },
        en: {
            "nav-about": "About",
            "nav-projects": "Projects",
            "nav-contact": "Contact",
            "nav-credits": "Credits",
            "nav-cta": "Say Hi!",
            "hero-subtitle": "Building webs for fun, thats why I use slangs a lot LOL",
            "about-title": "About Me",
            "about-coder-title": "Coder",
            "about-coder-desc": "Kinda hypocrite because I only understand vibe coding, but whatever.",
            "about-designer-title": "Designer",
            "about-designer-desc": "I like designing, and fr I can operate photoshop, illustrator, and canva.",
            "about-sticker": "IT'S REAL, NO CAP!",
            "about-editor-title": "Editor",
            "about-editor-desc": "I used to edit on KineMaster, but now I'm upgrading to Premiere Pro. Pretty cool right?",
            "about-gamer-title": "Gamer",
            "about-gamer-desc": "Yo bro hop on the game, whatcha waitin for?",
            "projects-title": "My previous projects",
            "project1-title": "Ahafest Website",
            "project1-desc": "A website for the Al-Hamidiyah Festival event. It makes it easier for event organizers to inform about the event and sell merchandize.",
            "project1-btn": "See More",
            "project2-title": "Auto I'lan",
            "project2-desc": "A website that was made when I was still a language committee member. It was originally made because I was lazy with the routine I'lan (language announcement) which was monotonous.",
            "project2-btn": "See More",
            "project3-title": "ACS Video Recap",
            "project3-desc": "A recap video of Al-Hamidiyah Championship (ACS) event. The making process was challenging, involving multiple blue screen crashes that required emergency cooling with AC and fans.",
            "project3-btn": "Watch",
            "project4-title": "Pemilukasa 25",
            "project4-desc": "A website for the general election of ISPAH (The Student Council of Al-Hamidiyah Islamic Boarding School). It was created to make the voting process more digital and efficient (cuz I was tired of manually counting paper votes lol).",
            "project4-btn": "See More",
            "projects-more-btn": "See My Other Projects",
            "contact-title": "Want to Chat or Play Games?",
            "contact-desc": "Just drop a message, chill. We can talk about coding, design, or just play games together.",
            "footer-credit": "Made with ❤️ by Amfhaa.",
            "terminal-port-label": "PORTFOLIO PORT:",
            "terminal-port-secure": "SECURE [8080]",
            "terminal-state-label": "SYSTEM STATE:",
            "terminal-state-locked": "LOCKED",
            "terminal-instruction": ">>> TYPE <span class=\"keyword-highlight\">\"start\"</span> AND PRESS ENTER TO BOOT PORTFOLIO",
            "terminal-auto-btn": "THIS IS RIDICULOUS. JUST CLICK THIS.",
            "granted-title": "AUTHENTICATION SYSTEM",
            "granted-message": "ACCESS GRANTED",
            "granted-subtext": "TBH THERE IS NO LOADING, THIS IS JUST ANOTHER COOL ANIMATIONS...",
            "denied-title": "SECURITY SYSTEM",
            "denied-message": "ACCESS DENIED",
            "denied-subtext": "ERROR: WTF BRO, TYPE \"start\" AND PRESS ENTER. HOW HARD IS THAT?<br><br>PLEASE TYPE <span class=\"keyword-highlight red\">\"start\"</span> AND PRESS ENTER,<br>OR CLICK \"THIS RIDICULOUS BUTTON\" I SWEAR.",
            "denied-back": "RETURN TO SHELL",
            "projects-page-title": "All My Works & Projects",
            "projects-back-btn": "Back To Home",
            "project5-title": "Pemilos 25",
            "project5-desc": "Same as the previous card, but this one is for the OSIS (another Student Council organization) chairman election hehe.",
            "project5-btn": "See More",
            "project6-title": "Kos Dwiga",
            "project6-desc": "A property management system for a boarding house business. The website was still a work in progress when this portfolio was made.",
            "project6-btn": "Its still work in progress",
            "project7-title": "Narcos Opening Remake",
            "project7-desc": "A video inspired by the opening of the TV series Narcos, but using nostalgic clips from my time in the boarding school.",
            "project7-btn": "Watch",
            "music-on": "MUSIC: ON",
            "music-off": "MUSIC: OFF"
        }
    };

    // Custom sequence animation for Footer Section
    let footerAnimated = false;

    const typeElement = (element, speed, callback) => {
        if (!element) {
            if (callback) callback();
            return;
        }

        const text = element.textContent;
        element.innerHTML = '';
        element.classList.add('typing');

        // Create cursor
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        element.appendChild(cursor);

        let charIndex = 0;
        const typeNext = () => {
            if (charIndex < text.length) {
                const char = text[charIndex];
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'letter';
                if (char === ' ') {
                    span.style.whiteSpace = 'pre';
                }
                // Insert before the cursor
                element.insertBefore(span, cursor);
                charIndex++;
                setTimeout(typeNext, speed);
            } else {
                // Done typing: remove cursor, remove typing class, add typed class
                cursor.remove();
                element.classList.remove('typing');
                element.classList.add('typed');
                if (callback) callback();
            }
        };
        typeNext();
    };

    const triggerFooterAnimation = () => {
        if (footerAnimated) return;
        footerAnimated = true;

        const footerTitle = document.querySelector('.footer-content h2');
        const footerDesc = document.querySelector('.footer-content p:not(.footer-credit)');

        // Step A: Type the title heading slowly (terminal feel: 80ms per char)
        typeElement(footerTitle, 80, () => {
            // Step B: Type description paragraph (terminal feel: 35ms per char)
            typeElement(footerDesc, 35, () => {
                // Step C: Social buttons pop up stagger style
                anime({
                    targets: '.social-btn',
                    scale: [0, 1],
                    opacity: [0, 1],
                    easing: 'easeOutElastic(1, .6)',
                    duration: 800,
                    delay: anime.stagger(150)
                });
            });
        });
    };

    // Separate IntersectionObserver for the Footer Section
    const footerSection = document.querySelector('.footer');
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerFooterAnimation();
                footerObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // trigger when 15% of footer is visible
        rootMargin: '0px 0px -50px 0px'
    });

    // Initialize Scroll Reveal Observers
    function initScrollRevealObservers() {
        // Observe general animatable cards
        document.querySelectorAll('.projects-grid .card-anim, .projects-more-container.card-anim').forEach((el, index) => {
            el.dataset.delay = index * 150;
            observer.observe(el);
        });

        // Observe about section
        if (aboutSection) {
            aboutObserver.observe(aboutSection);
        }

        // Observe footer section
        if (footerSection) {
            // Pre-set social buttons state to hidden
            anime.set('.social-btn', { scale: 0, opacity: 0 });
            footerObserver.observe(footerSection);
        }
    }

    // Auto-play state check based on presence of terminal boot screen
    const terminalScreenElForObs = document.getElementById('terminal-screen');
    if (!terminalScreenElForObs) {
        // If not on the terminal home page, initialize observers immediately
        initScrollRevealObservers();
    }

    // ==========================================
    // PORTFOLIO BACKSOUND AUDIO MUSIC CONTROLLER
    // ==========================================
    const backsoundAudio = document.getElementById('backsound-audio');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const musicStatusText = musicToggleBtn ? musicToggleBtn.querySelector('.music-status-text') : null;
    let isMusicPlaying = false; // Starts paused because they haven't booted the portfolio yet
    let isMusicInitialized = false;

    const updateMusicUI = () => {
        if (!musicToggleBtn || !musicStatusText) return;
        const currentLang = document.documentElement.lang || 'id';
        
        if (isMusicPlaying) {
            musicToggleBtn.classList.add('playing');
            musicToggleBtn.classList.remove('paused');
            musicStatusText.setAttribute('data-i18n', 'music-on');
            musicStatusText.textContent = translations[currentLang] && translations[currentLang]['music-on'] ? translations[currentLang]['music-on'] : 'MUSIK: NYALA';
        } else {
            musicToggleBtn.classList.remove('playing');
            musicToggleBtn.classList.add('paused');
            musicStatusText.setAttribute('data-i18n', 'music-off');
            musicStatusText.textContent = translations[currentLang] && translations[currentLang]['music-off'] ? translations[currentLang]['music-off'] : 'MUSIK: MATI';
        }
    };

    const startMusicPlayback = () => {
        if (!backsoundAudio) return;
        if (!isMusicInitialized) {
            // Set volume to a pleasant, non-deafening level (35% volume)
            backsoundAudio.volume = 0.35;
            isMusicInitialized = true;
        }
        
        isMusicPlaying = true;
        localStorage.setItem('music-playing', 'true');
        updateMusicUI();
        
        backsoundAudio.play().catch(err => {
            console.log("Autoplay blocked or audio load error:", err);
            // If play fails, update state to paused
            isMusicPlaying = false;
            localStorage.setItem('music-playing', 'false');
            updateMusicUI();
        });
    };

    const toggleMusic = () => {
        if (!backsoundAudio) return;
        
        if (!isMusicInitialized) {
            backsoundAudio.volume = 0.35;
            isMusicInitialized = true;
        }

        if (isMusicPlaying) {
            backsoundAudio.pause();
            isMusicPlaying = false;
            localStorage.setItem('music-playing', 'false');
        } else {
            isMusicPlaying = true;
            localStorage.setItem('music-playing', 'true');
            backsoundAudio.play().catch(err => {
                console.warn("Could not play audio:", err);
                isMusicPlaying = false;
                localStorage.setItem('music-playing', 'false');
            });
        }
        updateMusicUI();
    };

    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }

    // Restore state and handle persistence
    if (backsoundAudio) {
        const savedMusicPlaying = localStorage.getItem('music-playing');
        const savedMusicTime = localStorage.getItem('music-time');

        // Restore playback position
        if (savedMusicTime) {
            backsoundAudio.currentTime = parseFloat(savedMusicTime);
        }

        // Save playback position on timeupdate
        backsoundAudio.addEventListener('timeupdate', () => {
            localStorage.setItem('music-time', backsoundAudio.currentTime);
        });

        // Auto-play state check based on presence of terminal boot screen
        const terminalScreen = document.getElementById('terminal-screen');
        if (!terminalScreen) {
            if (savedMusicPlaying === 'true') {
                // Initialize audio nodes
                backsoundAudio.volume = 0.35;
                isMusicInitialized = true;
                isMusicPlaying = true;
                updateMusicUI();
                
                // Try playing immediately (or fallback to click)
                backsoundAudio.play().catch(err => {
                    console.log("Autoplay blocked, waiting for user interaction to resume...");
                    isMusicPlaying = false;
                    updateMusicUI();
                    
                    const resumeOnInteraction = () => {
                        startMusicPlayback();
                        document.removeEventListener('click', resumeOnInteraction);
                    };
                    document.addEventListener('click', resumeOnInteraction);
                });
            } else {
                isMusicPlaying = false;
                updateMusicUI();
            }
        }
    }

    const updateLanguage = (lang, animate = true) => {
        // Save choice
        localStorage.setItem('preferred-language', lang);

        const elements = document.querySelectorAll('[data-i18n]');
        const heroTitle = document.querySelector('.hero-title');

        const performUpdate = () => {
            // Update html lang attribute
            document.documentElement.lang = lang;

            // Update active state in UI switcher
            document.querySelectorAll('.lang-btn').forEach(btn => {
                if (btn.dataset.lang === lang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Update simple i18n texts
            elements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key] !== undefined) {
                    el.innerHTML = translations[lang][key];
                }
            });

            // Update hero title specifically to preserve layout spans & animations
            if (heroTitle) {
                if (lang === 'id') {
                    heroTitle.innerHTML = `
                        <span class="hero-word">Haiii,</span> <span class="hero-word">Aku</span> <span class="hero-word">Alfa!</span><br>
                        <span class="hero-word">Orang</span> <span class="hero-word">Keren</span> <span class="hero-word">yg</span> <span class="hero-word">Sukanya</span><br>
                        <span class="hero-tags">
                            <span class="hero-pop" style="display: inline-block;">
                                <span class="highlight highlight-blue levitate">Coding</span>
                            </span>
                            <span class="tag-and hero-pop" style="display: inline-block;">&</span>
                            <span class="hero-pop" style="display: inline-block;">
                                <span class="highlight highlight-pink levitate">Design.</span>
                            </span>
                        </span>
                    `;
                } else {
                    heroTitle.innerHTML = `
                        <span class="hero-word">Heyyy,</span> <span class="hero-word">I'm</span> <span class="hero-word">Alfa!</span><br>
                        <span class="hero-word">a</span> <span class="hero-word">Cool</span> <span class="hero-word">Guy</span> <span class="hero-word">who</span> <span class="hero-word">loves</span><br>
                        <span class="hero-tags">
                            <span class="hero-pop" style="display: inline-block;">
                                <span class="highlight highlight-blue levitate">Coding</span>
                            </span>
                            <span class="tag-and hero-pop" style="display: inline-block;">&</span>
                            <span class="hero-pop" style="display: inline-block;">
                                <span class="highlight highlight-pink levitate">Design.</span>
                            </span>
                        </span>
                    `;
                }
            }

            // Sync music toggle UI translation
            if (typeof updateMusicUI === 'function') {
                updateMusicUI();
            }
        };

        if (animate) {
            // High-end smooth stagger pop animation on change
            anime({
                targets: ['[data-i18n]', '.hero-word', '.hero-pop'],
                opacity: [1, 0],
                translateY: [0, -10],
                easing: 'easeInQuint',
                duration: 200,
                complete: () => {
                    performUpdate();

                    // Animate items back in stagger style
                    anime({
                        targets: ['[data-i18n]', '.hero-word', '.hero-pop'],
                        opacity: [0, 1],
                        translateY: [15, 0],
                        easing: 'easeOutElastic(1, .8)',
                        duration: 800,
                        delay: anime.stagger(15)
                    });

                    // Reactivate levitation
                    anime({
                        targets: '.levitate',
                        translateY: [-4, 4],
                        direction: 'alternate',
                        loop: true,
                        easing: 'easeInOutSine',
                        duration: 1500,
                        delay: anime.stagger(200)
                    });
                }
            });
        } else {
            performUpdate();
        }
    };

    // Attach click events to lang switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedLang = e.currentTarget.dataset.lang;
            const currentLang = document.documentElement.lang;
            if (selectedLang !== currentLang) {
                updateLanguage(selectedLang, true);
            }
        });
    });

    // Check localStorage or default to Indonesian (default page lang is 'id')
    const savedLang = localStorage.getItem('preferred-language') || 'id';
    updateLanguage(savedLang, false);
});
