const tracks = [
    'audio/track1.mp3',
    'audio/track2.mp3',
    'audio/track3.mp3',
    'audio/track4.mp3',
    'audio/track5.mp3',
    'audio/track6.mp3',
    'audio/track7.mp3',
    'audio/track8.mp3'
];

let currentAudio = null;

function playTrack(index) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    currentAudio = new Audio(tracks[index]);
    currentAudio.play().catch(error => {
        console.error("Playback failed:", error);
        alert("Playback failed. Ensure your audio folder is present and files are named correctly.");
    });
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}