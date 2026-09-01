/* ==========================================================================
   JAVASCRIPT ENGINE - BIRTHDAY PUZZLE WEBSITE
   Features: Admin Panel (PIN: 126111), GitHub Pages URL Shareable Engine,
   SVG Artwork Generator, Puzzle Engine, Web Audio API Sound System,
   Gift Box Unlock, Particle Engine, Typewriter Card, & Roblox Easter Eggs.
   ========================================================================== */

(function () {
    'use strict';

    // ==========================================
    // 1. STATE & CONSTANTS
    // ==========================================
    const ADMIN_PIN = '126111'; // Single Secret Admin PIN
    const GRID_SIZE = 3;
    const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
    
    let tilePositions = []; // Current tile order, e.g. [2, 0, 1, ...]
    let selectedTileIndex = null;
    let moveCount = 0;
    let timerInterval = null;
    let secondsElapsed = 0;
    let isPuzzleSolved = false;
    let isAutoSolving = false;
    let isBgmPlaying = false;
    let bgmAudioNode = null;
    let audioCtx = null;
    
    // Parse URL Parameters (For GitHub Pages Shareable Links)
    const urlParams = new URLSearchParams(window.location.search);
    const paramName = urlParams.get('name');
    const paramMsg = urlParams.get('msg');
    
    let recipientName = paramName || localStorage.getItem('bday_name') || 'Tuan Putri Ulang Tahun 💖';
    let birthdayMessage = paramMsg || localStorage.getItem('bday_msg') || 
`Selamat Ulang Tahun yang ke-spesial! 🌸✨

Semoga hari-harimu selalu dipenuhi kebahagiaan, senyuman indah, dan kehangatan seperti indahnya bunga sakura yang bermekaran! 💖

Shedletsky & 1X1X1 dari Forsaken Roblox ikut merayakan hari bahagiamu ini! Semoga semua impian dan cita-citamu tercapai, selalu sehat, dan makin berprestasi!

Nikmati hari spesialmu dengan penuh kegembiraan! 🎉🍗⚔️🟩`;

    // SVG Artwork Generator string
    function generateArtworkSVG() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe6ee"/>
      <stop offset="50%" stop-color="#f3d8f8"/>
      <stop offset="100%" stop-color="#d8f3dc"/>
    </linearGradient>
    <linearGradient id="cakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ff758f"/>
      <stop offset="100%" stop-color="#c77dff"/>
    </linearGradient>
    <linearGradient id="glitchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00ff66"/>
      <stop offset="100%" stop-color="#052912"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffb703"/>
      <stop offset="100%" stop-color="#fb8500"/>
    </linearGradient>
    <!-- Glow Filters -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="600" height="600" fill="url(#bgGrad)"/>

  <!-- Floral Frame Decor -->
  <g opacity="0.6">
    <path d="M 0 0 C 150 50, 50 150, 0 200 Z" fill="#ffb7c5"/>
    <path d="M 600 0 C 450 50, 550 150, 600 200 Z" fill="#ffb7c5"/>
    <path d="M 0 600 C 150 550, 50 450, 0 400 Z" fill="#ffb7c5"/>
    <path d="M 600 600 C 450 550, 550 450, 600 400 Z" fill="#ffb7c5"/>
  </g>

  <!-- Sakura Floating Flowers -->
  <g fill="#ff758f" opacity="0.8">
    <circle cx="80" cy="90" r="12"/>
    <circle cx="70" cy="100" r="12"/>
    <circle cx="90" cy="100" r="12"/>
    <circle cx="75" cy="112" r="12"/>
    <circle cx="85" cy="112" r="12"/>
    <circle cx="80" cy="103" r="5" fill="#fff"/>
    
    <circle cx="520" cy="80" r="10"/>
    <circle cx="510" cy="90" r="10"/>
    <circle cx="530" cy="90" r="10"/>
    <circle cx="515" cy="100" r="10"/>
    <circle cx="525" cy="100" r="10"/>
    <circle cx="520" cy="94" r="4" fill="#fff"/>
  </g>

  <!-- Birthday Cake in Center -->
  <g transform="translate(180, 310)">
    <!-- Base Cake Plate -->
    <ellipse cx="120" cy="170" rx="140" ry="30" fill="#fff" opacity="0.9" filter="url(#glow)"/>
    <!-- Bottom Layer -->
    <rect x="20" y="80" width="200" height="70" rx="16" fill="url(#cakeGrad)"/>
    <!-- Cake Icing Drips -->
    <path d="M 20 80 Q 40 105, 60 80 Q 80 110, 100 80 Q 120 115, 140 80 Q 160 105, 180 80 Q 200 110, 220 80 L 220 110 L 20 110 Z" fill="#ffffff" opacity="0.95"/>
    <!-- Top Layer -->
    <rect x="50" y="30" width="140" height="55" rx="14" fill="#ffb7c5"/>
    <path d="M 50 30 Q 75 50, 95 30 Q 120 55, 145 30 Q 165 50, 190 30 L 190 55 L 50 55 Z" fill="#ffffff"/>
    
    <!-- Candles -->
    <!-- Candle 1 -->
    <rect x="80" y="-10" width="10" height="40" rx="4" fill="#70e000"/>
    <ellipse cx="85" cy="-18" rx="6" ry="10" fill="#ffb703" filter="url(#glow)"/>
    <!-- Candle 2 (Center) -->
    <rect x="115" y="-20" width="10" height="50" rx="4" fill="#ff4d6d"/>
    <ellipse cx="120" cy="-28" rx="7" ry="12" fill="#ffb703" filter="url(#glow)"/>
    <!-- Candle 3 -->
    <rect x="150" y="-10" width="10" height="40" rx="4" fill="#3a86ff"/>
    <ellipse cx="155" cy="-18" rx="6" ry="10" fill="#ffb703" filter="url(#glow)"/>
  </g>

  <!-- ANIME SHEDLETSKY (LEFT SIDE) -->
  <g transform="translate(60, 170)">
    <!-- Cute Shadow -->
    <ellipse cx="70" cy="270" rx="55" ry="14" fill="rgba(0,0,0,0.15)"/>
    <!-- Body / Outfit -->
    <rect x="35" y="150" width="70" height="100" rx="20" fill="#3d5a80"/>
    <polygon points="70,150 50,210 90,210" fill="#e0fbfc"/>
    <!-- Red Tie -->
    <polygon points="70,155 64,190 70,200 76,190" fill="#ee6c4d"/>
    
    <!-- Shedletsky's Fried Chicken Leg 🍗 -->
    <g transform="translate(-15, 130) rotate(-20)">
      <rect x="40" y="40" width="10" height="30" rx="4" fill="#fff"/>
      <ellipse cx="40" cy="30" rx="22" ry="16" fill="url(#goldGrad)" filter="url(#glow)"/>
      <ellipse cx="50" cy="35" rx="18" ry="14" fill="#fb8500"/>
    </g>

    <!-- Telamon Sword ⚔️ -->
    <g transform="translate(100, 100) rotate(25)">
      <rect x="10" y="-20" width="8" height="90" fill="#e0e1dd" filter="url(#glow)"/>
      <rect x="0" y="70" width="28" height="8" rx="3" fill="#ffb703"/>
      <rect x="11" y="78" width="6" height="20" fill="#1d3557"/>
    </g>

    <!-- Head -->
    <circle cx="70" cy="100" r="50" fill="#ffdfba"/>
    <!-- Cute Anime Face -->
    <circle cx="50" cy="95" r="7" fill="#2b2d42"/>
    <circle cx="90" cy="95" r="7" fill="#2b2d42"/>
    <circle cx="52" cy="92" r="2.5" fill="#fff"/>
    <circle cx="92" cy="92" r="2.5" fill="#fff"/>
    <ellipse cx="42" cy="105" rx="8" ry="5" fill="#ffb7c5" opacity="0.7"/>
    <ellipse cx="98" cy="105" rx="8" ry="5" fill="#ffb7c5" opacity="0.7"/>
    <path d="M 64 110 Q 70 120, 76 110" stroke="#2b2d42" stroke-width="3" fill="none" stroke-linecap="round"/>

    <!-- Telamon / Shedletsky Classic Admin Hat -->
    <path d="M 15 70 C 15 30, 125 30, 125 70 Z" fill="#1d3557"/>
    <rect x="5" y="65" width="130" height="12" rx="6" fill="#ffb703"/>
    <text x="70" y="52" font-family="sans-serif" font-weight="bold" font-size="14" fill="#fff" text-anchor="middle">TELAMON</text>
  </g>

  <!-- ANIME 1X1X1 FORSAKEN ROBLOX (RIGHT SIDE) -->
  <g transform="translate(390, 170)">
    <!-- Cute Dark Glitch Shadow -->
    <ellipse cx="70" cy="270" rx="55" ry="14" fill="rgba(0,255,102,0.2)"/>
    <!-- Body / Dark Cloak -->
    <rect x="35" y="150" width="70" height="100" rx="20" fill="url(#glitchGrad)"/>
    
    <!-- Floating Glitch Matrix Cube 🟩 -->
    <g transform="translate(90, 110)">
      <rect x="0" y="0" width="30" height="30" rx="6" fill="#00ff66" opacity="0.8" filter="url(#glow)"/>
      <text x="15" y="20" font-family="'Share Tech Mono', monospace" font-weight="bold" font-size="12" fill="#052912" text-anchor="middle">1x1</text>
    </g>

    <!-- Head -->
    <circle cx="70" cy="100" r="50" fill="#183a1d"/>
    <!-- Glowing Neon Green Eyes -->
    <ellipse cx="50" cy="95" rx="9" ry="12" fill="#00ff66" filter="url(#glow)"/>
    <ellipse cx="90" cy="95" rx="9" ry="12" fill="#00ff66" filter="url(#glow)"/>
    <ellipse cx="50" cy="95" rx="3" ry="5" fill="#ffffff"/>
    <ellipse cx="90" cy="95" rx="3" ry="5" fill="#ffffff"/>
    <!-- Cute Mischievous Smile -->
    <path d="M 58 112 Q 70 125, 82 112" stroke="#00ff66" stroke-width="3" fill="none" stroke-linecap="round"/>
    
    <!-- Party Hat for 1X1X1 -->
    <polygon points="70,10 40,60 100,60" fill="#70e000"/>
    <polygon points="70,10 55,60 85,60" fill="#ff758f"/>
    <circle cx="70" cy="10" r="8" fill="#ffb703"/>
  </g>

  <!-- Banner Text at Top -->
  <g transform="translate(300, 75)">
    <rect x="-180" y="-35" width="360" height="55" rx="28" fill="#ffffff" opacity="0.9" stroke="#ff758f" stroke-width="3" filter="url(#glow)"/>
    <text x="0" y="2" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="24" fill="#ff4d6d" text-anchor="middle">
      🎉 SELAMAT ULANG TAHUN! 🎉
    </text>
  </g>
</svg>`;
    }

    function getArtworkDataURL() {
        const svgString = generateArtworkSVG();
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    }

    // ==========================================
    // 2. AUDIO SYNTHESIZER (WEB AUDIO API)
    // ==========================================
    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
    }

    function playSound(type) {
        initAudio();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'swap') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.07);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'victory') {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
                const noteOsc = audioCtx.createOscillator();
                const noteGain = audioCtx.createGain();
                noteOsc.type = 'sine';
                noteOsc.frequency.setValueAtTime(freq, now + idx * 0.12);
                noteGain.gain.setValueAtTime(0.3, now + idx * 0.12);
                noteGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.3);
                noteOsc.connect(noteGain);
                noteGain.connect(audioCtx.destination);
                noteOsc.start(now + idx * 0.12);
                noteOsc.stop(now + idx * 0.12 + 0.3);
            });
        } else if (type === 'chicken') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(600, now + 0.1);
            osc.frequency.linearRampToValueAtTime(250, now + 0.2);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'glitch') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.05);
            osc.frequency.linearRampToValueAtTime(100, now + 0.15);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'sword') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        }
    }

    function toggleBgm() {
        initAudio();
        const musicIcon = document.getElementById('musicIcon');
        
        if (isBgmPlaying) {
            isBgmPlaying = false;
            if (bgmAudioNode) clearInterval(bgmAudioNode);
            musicIcon.textContent = '🎵';
        } else {
            isBgmPlaying = true;
            musicIcon.textContent = '🎶';
            
            const melody = [
                264, 264, 297, 264, 352, 330,
                264, 264, 297, 264, 396, 352,
                264, 264, 528, 440, 352, 330, 297,
                466, 466, 440, 352, 396, 352
            ];
            let noteIdx = 0;
            
            bgmAudioNode = setInterval(() => {
                if (!isBgmPlaying || !audioCtx) return;
                const freq = melody[noteIdx % melody.length];
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const now = audioCtx.currentTime;
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.35);
                
                noteIdx++;
            }, 400);
        }
    }

    // ==========================================
    // 3. PUZZLE ENGINE (3X3 TILE SWAP)
    // ==========================================
    function initPuzzle() {
        tilePositions = Array.from({ length: TOTAL_TILES }, (_, i) => i);
        shuffleTiles();
        renderPuzzleBoard();
        resetTimer();
        startTimer();
        
        document.getElementById('previewSVG').outerHTML = generateArtworkSVG();
        document.getElementById('cardArtContainer').innerHTML = generateArtworkSVG();
    }

    function shuffleTiles() {
        moveCount = 0;
        document.getElementById('moveCount').textContent = moveCount;
        isPuzzleSolved = false;

        for (let i = 0; i < 20; i++) {
            const idx1 = Math.floor(Math.random() * TOTAL_TILES);
            const idx2 = Math.floor(Math.random() * TOTAL_TILES);
            if (idx1 !== idx2) {
                const temp = tilePositions[idx1];
                tilePositions[idx1] = tilePositions[idx2];
                tilePositions[idx2] = temp;
            }
        }
        
        if (checkIfSolved()) {
            const temp = tilePositions[0];
            tilePositions[0] = tilePositions[1];
            tilePositions[1] = temp;
        }
    }

    function renderPuzzleBoard() {
        const board = document.getElementById('puzzleBoard');
        board.innerHTML = '';
        const artworkUrl = getArtworkDataURL();

        tilePositions.forEach((tileValue, gridIndex) => {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile';
            tile.dataset.gridIndex = gridIndex;
            tile.dataset.tileValue = tileValue;

            const row = Math.floor(tileValue / GRID_SIZE);
            const col = tileValue % GRID_SIZE;
            const xPercent = col * 50;
            const yPercent = row * 50;

            tile.style.backgroundImage = `url("${artworkUrl}")`;
            tile.style.backgroundPosition = `${xPercent}% ${yPercent}%`;

            if (tileValue === gridIndex) {
                tile.classList.add('correct');
            }

            tile.addEventListener('click', () => handleTileClick(gridIndex));

            tile.setAttribute('draggable', 'true');
            tile.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', gridIndex);
                tile.classList.add('dragging');
            });
            tile.addEventListener('dragover', (e) => e.preventDefault());
            tile.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
                if (!isNaN(fromIdx) && fromIdx !== gridIndex) {
                    swapTiles(fromIdx, gridIndex);
                }
            });

            board.appendChild(tile);
        });
    }

    function handleTileClick(gridIndex) {
        if (isPuzzleSolved || isAutoSolving) return;
        playSound('click');

        if (selectedTileIndex === null) {
            selectedTileIndex = gridIndex;
            highlightTile(gridIndex, true);
        } else if (selectedTileIndex === gridIndex) {
            highlightTile(gridIndex, false);
            selectedTileIndex = null;
        } else {
            const firstIndex = selectedTileIndex;
            selectedTileIndex = null;
            swapTiles(firstIndex, gridIndex);
        }
    }

    function highlightTile(gridIndex, isSelected) {
        const board = document.getElementById('puzzleBoard');
        const tile = board.children[gridIndex];
        if (tile) {
            if (isSelected) {
                tile.classList.add('selected');
            } else {
                tile.classList.remove('selected');
            }
        }
    }

    function swapTiles(idx1, idx2) {
        const temp = tilePositions[idx1];
        tilePositions[idx1] = tilePositions[idx2];
        tilePositions[idx2] = temp;

        moveCount++;
        document.getElementById('moveCount').textContent = moveCount;

        playSound('swap');
        renderPuzzleBoard();

        if (checkIfSolved()) {
            onPuzzleVictory();
        }
    }

    function checkIfSolved() {
        return tilePositions.every((val, idx) => val === idx);
    }

    function autoSolvePuzzle() {
        if (isPuzzleSolved || isAutoSolving) return;
        isAutoSolving = true;

        let steps = [];
        for (let i = 0; i < TOTAL_TILES; i++) {
            if (tilePositions[i] !== i) {
                const currentPosOfTarget = tilePositions.indexOf(i);
                steps.push({ from: currentPosOfTarget, to: i });
            }
        }

        let stepIndex = 0;
        const solveInterval = setInterval(() => {
            if (stepIndex < steps.length) {
                const targetVal = stepIndex;
                const currentPos = tilePositions.indexOf(targetVal);
                if (currentPos !== targetVal && currentPos !== -1) {
                    const temp = tilePositions[targetVal];
                    tilePositions[targetVal] = tilePositions[currentPos];
                    tilePositions[currentPos] = temp;
                    moveCount++;
                    document.getElementById('moveCount').textContent = moveCount;
                    playSound('swap');
                    renderPuzzleBoard();
                }
                stepIndex++;
            } else {
                clearInterval(solveInterval);
                tilePositions = Array.from({ length: TOTAL_TILES }, (_, i) => i);
                renderPuzzleBoard();
                isAutoSolving = false;
                onPuzzleVictory();
            }
        }, 200);
    }

    function onPuzzleVictory() {
        isPuzzleSolved = true;
        stopTimer();
        playSound('victory');
        triggerConfettiBurst();

        setTimeout(() => {
            document.getElementById('puzzleSection').classList.add('hidden');
            document.getElementById('giftRevealSection').classList.remove('hidden');
        }, 600);
    }

    function startTimer() {
        clearInterval(timerInterval);
        secondsElapsed = 0;
        timerInterval = setInterval(() => {
            secondsElapsed++;
            const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
            const secs = (secondsElapsed % 60).toString().padStart(2, '0');
            document.getElementById('timerText').textContent = `${mins}:${secs}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function resetTimer() {
        stopTimer();
        secondsElapsed = 0;
        document.getElementById('timerText').textContent = '00:00';
    }

    // ==========================================
    // 4. GIFT BOX UNLOCK & CARD TYPEWRITER
    // ==========================================
    function openGiftBox() {
        const giftBox = document.getElementById('giftBox');
        giftBox.classList.add('opened');
        playSound('victory');
        triggerConfettiBurst();

        setTimeout(() => {
            showGreetingModal();
        }, 700);
    }

    function showGreetingModal() {
        document.getElementById('cardRecipientName').textContent = recipientName;
        document.getElementById('greetingModal').classList.remove('hidden');
        startTypewriterEffect();
    }

    function startTypewriterEffect() {
        const container = document.getElementById('typewriterText');
        container.textContent = '';
        let charIndex = 0;

        const typingInterval = setInterval(() => {
            if (charIndex < birthdayMessage.length) {
                container.textContent += birthdayMessage.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 30);
    }

    // ==========================================
    // 5. CANVAS PARTICLE ENGINE (SAKURA PETALS)
    // ==========================================
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class SakuraPetal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 10 + 8;
            this.speedY = Math.random() * 1.5 + 1;
            this.speedX = Math.random() * 1.2 - 0.6;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.7 + 0.3;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.01) + this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
            ctx.fillStyle = '#ffb7c5';
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        for (let i = 0; i < 35; i++) {
            const p = new SakuraPetal();
            p.y = Math.random() * canvas.height;
            particles.push(p);
        }

        animateParticles();
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    function triggerConfettiBurst() {
        const colors = ['#ff4d6d', '#ffb7c5', '#ffb703', '#00ff66', '#a2d2ff'];
        for (let i = 0; i < 60; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = Math.random() * 8 + 6 + 'px';
            confetti.style.height = Math.random() * 12 + 8 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            confetti.style.borderRadius = '3px';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.transition = 'transform 2.5s ease-out, top 2.5s ease-out, opacity 2.5s ease-out';

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.style.top = Math.random() * 80 + 20 + 'vh';
                confetti.style.transform = `rotate(${Math.random() * 720}deg) scale(0.5)`;
                confetti.style.opacity = '0';
            }, 50);

            setTimeout(() => {
                confetti.remove();
            }, 2600);
        }
    }

    // ==========================================
    // 6. ADMIN PANEL CONTROLLER (PIN: 126111)
    // ==========================================
    function setupAdminPanel() {
        const btnAdminTrigger = document.getElementById('btnAdminTrigger');
        const adminAuthModal = document.getElementById('adminAuthModal');
        const btnCloseAuthModal = document.getElementById('btnCloseAuthModal');
        const adminAuthForm = document.getElementById('adminAuthForm');
        const inputAdminPin = document.getElementById('inputAdminPin');
        const pinErrorMsg = document.getElementById('pinErrorMsg');
        
        const adminPanelModal = document.getElementById('adminPanelModal');
        const btnCloseAdminPanel = document.getElementById('btnCloseAdminPanel');
        const adminSettingsForm = document.getElementById('adminSettingsForm');
        const adminInputName = document.getElementById('adminInputName');
        const adminInputMessage = document.getElementById('adminInputMessage');
        const adminSelectTheme = document.getElementById('adminSelectTheme');
        
        const btnAdminForceUnlock = document.getElementById('btnAdminForceUnlock');
        const btnAdminGenerateShareLink = document.getElementById('btnAdminGenerateShareLink');
        const btnAdminResetDefault = document.getElementById('btnAdminResetDefault');

        // Open Auth Modal via Icon Click
        btnAdminTrigger.addEventListener('click', () => {
            playSound('click');
            inputAdminPin.value = '';
            pinErrorMsg.classList.add('hidden');
            adminAuthModal.classList.remove('hidden');
            setTimeout(() => inputAdminPin.focus(), 100);
        });

        // Close Auth Modal
        btnCloseAuthModal.addEventListener('click', () => {
            adminAuthModal.classList.add('hidden');
        });

        // Admin Auth Form Submit Verification (PIN: 126111)
        adminAuthForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredPin = inputAdminPin.value.trim();

            if (enteredPin === ADMIN_PIN) {
                playSound('victory');
                pinErrorMsg.classList.add('hidden');
                adminAuthModal.classList.add('hidden');

                // Populate Admin Dashboard Fields
                adminInputName.value = recipientName;
                adminInputMessage.value = birthdayMessage;
                adminSelectTheme.value = document.body.classList.contains('theme-glitch') ? 'theme-glitch' : 'theme-sakura';

                // Show Admin Dashboard
                adminPanelModal.classList.remove('hidden');
            } else {
                playSound('glitch');
                pinErrorMsg.classList.remove('hidden');
                inputAdminPin.value = '';
                inputAdminPin.focus();
            }
        });

        // Close Admin Dashboard
        btnCloseAdminPanel.addEventListener('click', () => {
            adminPanelModal.classList.add('hidden');
        });

        // Save Admin Settings
        adminSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            recipientName = adminInputName.value.trim() || recipientName;
            birthdayMessage = adminInputMessage.value.trim() || birthdayMessage;
            const chosenTheme = adminSelectTheme.value;

            localStorage.setItem('bday_name', recipientName);
            localStorage.setItem('bday_msg', birthdayMessage);
            localStorage.setItem('bday_theme', chosenTheme);

            // Apply Theme
            document.body.className = chosenTheme;
            document.getElementById('displayRecipientName').textContent = recipientName;
            document.getElementById('cardRecipientName').textContent = recipientName;

            adminPanelModal.classList.add('hidden');
            playSound('victory');
            triggerConfettiBurst();
            alert('✅ Pengaturan Admin berhasil disimpan!');
        });

        // Force Unlock Gift Box (Admin Shortcut)
        btnAdminForceUnlock.addEventListener('click', () => {
            adminPanelModal.classList.add('hidden');
            autoSolvePuzzle();
        });

        // Generate Shareable Link for GitHub Pages
        btnAdminGenerateShareLink.addEventListener('click', () => {
            const currentName = encodeURIComponent(adminInputName.value.trim() || recipientName);
            const currentMsg = encodeURIComponent(adminInputMessage.value.trim() || birthdayMessage);
            
            const baseUrl = window.location.href.split('?')[0];
            const shareableUrl = `${baseUrl}?name=${currentName}&msg=${currentMsg}`;

            navigator.clipboard.writeText(shareableUrl).then(() => {
                playSound('click');
                alert(`🔗 Link Kustom Berhasil Di-copy!\n\nAnda dapat membagikan link ini ke teman/penerima di WhatsApp/Medsos:\n\n${shareableUrl}`);
            }).catch(() => {
                prompt('Copy Link Kustom Ini:', shareableUrl);
            });
        });

        // Reset Default Data
        btnAdminResetDefault.addEventListener('click', () => {
            localStorage.removeItem('bday_name');
            localStorage.removeItem('bday_msg');
            localStorage.removeItem('bday_theme');
            
            recipientName = 'Tuan Putri Ulang Tahun 💖';
            birthdayMessage = `Selamat Ulang Tahun yang ke-spesial! 🌸✨

Semoga hari-harimu selalu dipenuhi kebahagiaan, senyuman indah, dan kehangatan seperti indahnya bunga sakura yang bermekaran! 💖

Shedletsky & 1X1X1 dari Forsaken Roblox ikut merayakan hari bahagiamu ini! Semoga semua impian dan cita-citamu tercapai, selalu sehat, dan makin berprestasi!

Nikmati hari spesialmu dengan penuh kegembiraan! 🎉🍗⚔️🟩`;

            adminInputName.value = recipientName;
            adminInputMessage.value = birthdayMessage;
            adminSelectTheme.value = 'theme-sakura';
            document.body.className = 'theme-sakura';
            document.getElementById('displayRecipientName').textContent = recipientName;
            
            playSound('click');
            alert('🔄 Data dikembalikan ke default!');
        });
    }

    // ==========================================
    // 7. EASTER EGGS & CHARACTER INTERACTION
    // ==========================================
    function setupEasterEggs() {
        document.getElementById('eeChicken').addEventListener('click', () => {
            playSound('chicken');
            for (let i = 0; i < 6; i++) {
                spawnFloatingEmoji('🍗');
            }
        });

        document.getElementById('eeSword').addEventListener('click', () => {
            playSound('sword');
            const slash = document.createElement('div');
            slash.style.position = 'fixed';
            slash.style.top = '40%';
            slash.style.left = '0';
            slash.style.width = '100vw';
            slash.style.height = '6px';
            slash.style.background = 'linear-gradient(90deg, transparent, #ffb703, #ffffff, #ffb703, transparent)';
            slash.style.boxShadow = '0 0 25px #ffb703';
            slash.style.zIndex = '9999';
            slash.style.transform = 'rotate(-15deg)';
            slash.style.pointerEvents = 'none';
            document.body.appendChild(slash);

            setTimeout(() => slash.remove(), 250);
        });

        document.getElementById('eeGlitch').addEventListener('click', () => {
            playSound('glitch');
            const overlay = document.getElementById('glitchOverlay');
            overlay.classList.add('active');
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 3000);
        });

        document.getElementById('eeSakura').addEventListener('click', () => {
            playSound('victory');
            for (let i = 0; i < 15; i++) {
                spawnFloatingEmoji('🌸');
            }
        });
    }

    function spawnFloatingEmoji(emojiStr) {
        const el = document.createElement('div');
        el.textContent = emojiStr;
        el.style.position = 'fixed';
        el.style.left = Math.random() * 80 + 10 + 'vw';
        el.style.bottom = '-30px';
        el.style.fontSize = '2.5rem';
        el.style.zIndex = '9999';
        el.style.pointerEvents = 'none';
        el.style.transition = 'transform 2s ease-out, opacity 2s ease-out';

        document.body.appendChild(el);

        setTimeout(() => {
            el.style.transform = `translateY(-${Math.random() * 400 + 300}px) rotate(${Math.random() * 360}deg)`;
            el.style.opacity = '0';
        }, 50);

        setTimeout(() => el.remove(), 2100);
    }

    // ==========================================
    // 8. EVENT LISTENERS & INITIALIZATION
    // ==========================================
    function bindEvents() {
        document.getElementById('btnMusic').addEventListener('click', toggleBgm);
        document.getElementById('btnThemeToggle').addEventListener('click', () => {
            document.body.classList.toggle('theme-glitch');
            playSound('click');
        });

        document.getElementById('btnShuffle').addEventListener('click', () => {
            playSound('click');
            shuffleTiles();
            renderPuzzleBoard();
            resetTimer();
            startTimer();
        });

        document.getElementById('btnAutoSolve').addEventListener('click', () => {
            playSound('click');
            autoSolvePuzzle();
        });

        document.getElementById('btnPreview').addEventListener('click', () => {
            playSound('click');
            document.getElementById('previewModal').classList.remove('hidden');
        });
        document.getElementById('btnClosePreview').addEventListener('click', () => {
            document.getElementById('previewModal').classList.add('hidden');
        });

        document.getElementById('btnOpenGift').addEventListener('click', openGiftBox);
        document.getElementById('giftBox').addEventListener('click', openGiftBox);

        document.getElementById('btnCloseGreeting').addEventListener('click', () => {
            document.getElementById('greetingModal').classList.add('hidden');
        });
        document.getElementById('btnCloseCardModal').addEventListener('click', () => {
            document.getElementById('greetingModal').classList.add('hidden');
            playSound('victory');
        });
        document.getElementById('btnReplayConfetti').addEventListener('click', () => {
            playSound('victory');
            triggerConfettiBurst();
        });

        document.getElementById('displayRecipientName').textContent = recipientName;

        // Apply saved theme preference if any
        const savedTheme = localStorage.getItem('bday_theme');
        if (savedTheme) {
            document.body.className = savedTheme;
        }

        setupAdminPanel();
        setupEasterEggs();
    }

    document.addEventListener('DOMContentLoaded', () => {
        initParticles();
        initPuzzle();
        bindEvents();
    });
})();
