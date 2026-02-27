const tracks = [
    { title: 'prometheus (prod. by Light)', src: 'audio/track1.mp3' },
    { title: 'pop rocks (prod. by rnillennial)', src: 'audio/track2.mp3' },
    { title: 'out of time (feat. Spiral) (prod. by SCUBA)', src: 'audio/track3.mp3' },
    { title: 'tinted (prod. by Light)', src: 'audio/track4.mp3' },
    { title: 'tie dyes (prod. by Light)', src: 'audio/track5.mp3' },
    { title: 'dry season (prod. by rnillennial)', src: 'audio/track6.mp3' },
    { title: 'lonely nights (feat. chax) (prod. by SCUBA)', src: 'audio/track7.mp3' },
    { title: 'drop out (prod. by rnillennial)', src: 'audio/track8.mp3' }
];

// Initialize audio object
let currentAudio = new Audio();
let currentIndex = 0;

// UI Elements
const playPauseBtn = document.getElementById('play-pause-btn');
const seekBar = document.getElementById('seek-bar');
const currentTimeSpan = document.getElementById('current-time');
const remainingTimeSpan = document.getElementById('remaining-time');
const nowPlayingElem = document.getElementById('now-playing');
const trackListElem = document.getElementById('track-list');

// Setup event listeners
currentAudio.addEventListener('ended', playNextTrack);
currentAudio.addEventListener('timeupdate', updateProgress);
currentAudio.addEventListener('loadedmetadata', () => {
    seekBar.max = Math.floor(currentAudio.duration);
    updateProgress();
});

// Update UI state when audio plays/pauses
currentAudio.addEventListener('play', updatePlayPauseIcon);
currentAudio.addEventListener('pause', updatePlayPauseIcon);

seekBar.addEventListener('input', () => {
    if (currentAudio.duration) {
        currentAudio.currentTime = seekBar.value;
    }
});

// Initialize the track list
renderTrackList();

function renderTrackList() {
    trackListElem.innerHTML = '';
    tracks.forEach((track, index) => {
        const button = document.createElement('button');
        const trackNumber = String(index + 1).padStart(2, '0');
        button.textContent = `${trackNumber}. ${track.title}`;
        button.onclick = () => playTrack(index);
        trackListElem.appendChild(button);
    });
}

function playTrack(index) {
    if (index < 0 || index >= tracks.length) return;

    currentIndex = index;
    currentAudio.src = tracks[currentIndex].src;
    
    // Update Now Playing
    const trackNumber = String(currentIndex + 1).padStart(2, '0');
    nowPlayingElem.textContent = `Now Playing: ${trackNumber}. ${tracks[currentIndex].title}`;
    
    // Highlight current track
    updateActiveTrackStyle();

    currentAudio.play().catch(error => {
        console.error("Playback failed:", error);
    });
}

function updateActiveTrackStyle() {
    const buttons = trackListElem.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
        if (i === currentIndex) {
            buttons[i].classList.add('active-track');
        } else {
            buttons[i].classList.remove('active-track');
        }
    }
}

function togglePlayPause() {
    // If no source is set (initial state), load the first track
    if (!currentAudio.src || currentAudio.src === '') {
        playTrack(0);
        return;
    }

    if (currentAudio.paused) {
        currentAudio.play();
    } else {
        currentAudio.pause();
    }
}

function playNextTrack() {
    let nextIndex = currentIndex + 1;
    if (nextIndex < tracks.length) {
        playTrack(nextIndex);
    } else {
        // End of playlist
        currentAudio.currentTime = 0;
        updatePlayPauseIcon();
    }
}

function playPreviousTrack() {
    // If more than 3 seconds in, restart track
    if (currentAudio.currentTime > 3) {
        currentAudio.currentTime = 0;
        return;
    }
    
    let prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
        playTrack(prevIndex);
    } else {
        playTrack(0); // Stay at first track
    }
}

function updateProgress() {
    const currentTime = currentAudio.currentTime;
    const duration = currentAudio.duration || 0;
    // Avoid displaying negative zero or weird numbers
    const remaining = Math.max(0, duration - currentTime);

    seekBar.value = currentTime;
    currentTimeSpan.textContent = formatTime(currentTime);
    remainingTimeSpan.textContent = '-' + formatTime(remaining);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updatePlayPauseIcon() {
    playPauseBtn.textContent = !currentAudio.paused ? '⏸' : '▶';
}

function stopAudio() {
    currentAudio.pause();
    currentAudio.currentTime = 0;
}
