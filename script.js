let currentZIndex = 1;
let isDragging = false;
let currentDragElement = null;
let dragOffset = { x: 0, y: 0 };

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('startup-sound').play();
    document.getElementById('startup-screen').style.display = 'none';
    
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    document.body.appendChild(loadingScreen);
    
    setTimeout(() => {
        loadingScreen.remove();
        document.getElementById('desktop').classList.remove('hidden');
        createWindow('about', 'about hazel', 100, 100, `
            <div class="window-content" style="padding: 8px;">
                <h1>hazel</h1>
                <p>she/her transgender lesbian</p>
                <p>hobbies: coding, gaming</p>
                <p>and sometimes writing too</p>
                <button onclick="triggerBSOD()" style="margin-top: 10px;">do not click</button>
            </div>
        `);
    }, 2500);
});

function createWindow(id, title, x, y, content) {
    const window = document.createElement('div');
    window.className = 'window';
    window.id = id;
    window.style.left = `${x}px`;
    window.style.top = `${y}px`;
    window.style.zIndex = currentZIndex++;
    window.innerHTML = `
        <div class="window-header">
            <span>${title}</span>
            <button class="close-button" onclick="this.parentElement.parentElement.remove()">x</button>
        </div>
        ${content}
    `;
    
    window.querySelector('.window-header').addEventListener('mousedown', startDrag);
    window.addEventListener('mousedown', bringToFront);
    document.getElementById('windows').appendChild(window);
    playBleep();
    return window;
}

function startDrag(e) {
    isDragging = true;
    currentDragElement = this.parentElement;
    const rect = currentDragElement.getBoundingClientRect();
    dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentDragElement.style.left = `${e.clientX - dragOffset.x}px`;
    currentDragElement.style.top = `${e.clientY - dragOffset.y}px`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

function bringToFront(e) {
    this.style.zIndex = currentZIndex++;
}

document.querySelectorAll('.taskbar-item').forEach(btn => {
    btn.addEventListener('click', () => {
        const windowType = btn.dataset.window;
        if (windowType === 'about') {
            createWindow('about', 'about hazel', 100, 100, `
                <div class="window-content" style="padding: 8px;">
                    <h1>hazel</h1>
                    <p>pronouns: she/they</p>
                    <p>hobbies: coding, gaming</p>
                    <p>hello!</p>
                </div>
            `);
        } else if (windowType === 'art') {
            createWindow('art', 'art gallery', 150, 150, `
                <div class="window-content" style="padding: 8px;">
                    <h2>art gallery</h2>
                    <p>coming soon...</p>
                </div>
            `);
        } else if (windowType === 'music') {
            createWindow('music', 'music player', 200, 200, `
                <div class="window-content" style="padding: 8px;">
                    <div id="song-title" style="margin-bottom: 8px;">myuzak</div>
                    <select id="track-select" onchange="changeSong(this.value)">
                        <option value="music/vaporwave.mp3">HOME - We're Finally Landing</option>
                        <option value="music/gu.mp3">hzlsounds (me) - grayscale unexcitement</option>
                        <option value="music/ambient.mp3">bird songs i think idk whats the outside</option>
                    </select>
                    <div class="player-controls" style="margin-top: 8px;">
                        <button onclick="this.parentElement.parentElement.querySelector('audio').play()">Play</button>
                        <button onclick="this.parentElement.parentElement.querySelector('audio').pause()">Pause</button>
                        <input type="range" min="0" max="1" step="0.1" value="1" 
                               onchange="this.parentElement.parentElement.querySelector('audio').volume = this.value">
                    </div>
                    <audio src="music/vaporwave.mp3" loop></audio>
                </div>
            `);
        } else if (windowType === 'terminal') {
            createTerminal();
        }
    });
});

function createTerminal() {
    const terminal = createWindow('terminal', 'terminal', 300, 200, `
        <div id="terminal-content">dmc v1.0
> <span id="current-input"></span><span class="cursor"></span></div>
        <div class="terminal-input-container">
            <input type="text" class="terminal-input" id="terminal-input" style="opacity: 0; position: absolute;">
        </div>
    `);
    
    const output = terminal.querySelector('#terminal-content');
    const input = terminal.querySelector('#terminal-input');
    const currentInput = terminal.querySelector('#current-input');
    
    input.focus();
    
    input.addEventListener('input', (e) => {
        const spans = output.querySelectorAll('span');
        const lastSpan = spans[spans.length - 2];
        if (lastSpan && lastSpan.id === 'current-input') {
            lastSpan.textContent = input.value;
        }
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.toLowerCase();
            handleCommand(command, output);
            input.value = '';
        }
    });
    
    terminal.addEventListener('click', () => {
        input.focus();
    });
}

function handleCommand(command, output) {
    const responses = {
        'help': 'available commands: help, love, secret, restart',
        'love': 'what do you love? cheese?',
        'secret': 'seriously? its not gonna be that easy.',
        'webpage': 'todo: make this a very sneaky secret',
        'crash': triggerBSOD,
        'restart': () => window.location.reload(),
    };
    
    if (responses[command]) {
        if (typeof responses[command] === 'function') {
            responses[command]();
        } else {
            output.innerHTML += `\n${responses[command]}\n`;
        }
    } else {
        output.innerHTML += `\ncommand not found: ${command}\n`;
    }
    
    output.innerHTML += '> <span id="current-input"></span><span class="cursor"></span>';
    output.scrollTop = output.scrollHeight;
}

function triggerBSOD() {
    document.getElementById('desktop').classList.add('hidden');
    document.getElementById('startup-screen').classList.add('hidden');
    document.getElementById('bsod').classList.remove('hidden');
    document.getElementById('bsod').addEventListener('click', () => {
        window.location.reload();
    }, { once: true });
}

function playBleep() {
    const bleep = document.getElementById('bleep-sound');
    bleep.currentTime = 0;
    bleep.play();
}

function changeSong(track) {
    const audio = document.querySelector('#music audio');
    const songTitle = document.querySelector('#song-title');
    const trackSelect = document.querySelector('#track-select');
    audio.src = track;
    songTitle.textContent = trackSelect.options[trackSelect.selectedIndex].text;
    audio.play();
}

window.addEventListener('DOMContentLoaded', () => {
});
