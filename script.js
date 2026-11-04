console.log("Welcome to Spotify");

// Songs array (curated lightweight playlist for GitHub)
let songs = [
    {songName: "Salam-e-Ishq", filePath: "Music/1.mp3", coverPath: "1.jpg"},
    {songName: "Tum Hi Ho", filePath: "Music/2.mp3", coverPath: "1.jpg"},
    {songName: "Channa Mereya", filePath: "Music/3.mp3", coverPath: "1.jpg"},
    {songName: "Amake Amar Moto", filePath: "Music/4.mp3", coverPath: "1.jpg"},
];

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio(songs[songIndex].filePath);
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));

// Populate song list
songItems.forEach((element, i) => {
    if (songs[i]) {
        let img = element.getElementsByTagName("img")[0];
        if (img) img.src = songs[i].coverPath;
        let nameSpan = element.getElementsByClassName("songName")[0];
        if (nameSpan) nameSpan.innerText = songs[i].songName;
    }
});

function makeAllPlays() {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.classList.remove('fa-pause');
        element.classList.add('fa-play');
    });
}

function updateMasterPlayIcon(isPlaying) {
    const playBtn = document.getElementById('masterPlay');
    if (!playBtn) return;
    if (isPlaying) {
        playBtn.classList.remove('fa-play');
        playBtn.classList.add('fa-pause');
    } else {
        playBtn.classList.remove('fa-pause');
        playBtn.classList.add('fa-play');
    }
}

function updateSongItemIcon(index, isPlaying) {
    const itemBtn = document.getElementById(index.toString());
    if (!itemBtn) return;
    if (isPlaying) {
        itemBtn.classList.remove('fa-play');
        itemBtn.classList.add('fa-pause');
    } else {
        itemBtn.classList.remove('fa-pause');
        itemBtn.classList.add('fa-play');
    }
}

// Play / Pause Master
function toggleMasterPlay() {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        let playPromise = audioElement.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Playing:", songs[songIndex].songName);
            }).catch(err => {
                console.error("Audio playback error:", err);
            });
        }
        updateMasterPlayIcon(true);
        updateSongItemIcon(songIndex, true);
        if (gif) gif.style.opacity = 1;
    } else {
        audioElement.pause();
        updateMasterPlayIcon(false);
        makeAllPlays();
        if (gif) gif.style.opacity = 0;
    }
}

function playSongAtIndex(index) {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    if (masterSongName) masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    let playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.catch(err => console.error("Playback error:", err));
    }
    makeAllPlays();
    updateSongItemIcon(songIndex, true);
    updateMasterPlayIcon(true);
    if (gif) gif.style.opacity = 1;
}

// Global Click Delegation to ensure clicks are never lost
document.addEventListener('click', (e) => {
    // Master Play clicked
    if (e.target.closest('#masterPlay')) {
        toggleMasterPlay();
        return;
    }

    // Previous clicked
    if (e.target.closest('#previous')) {
        let newIndex = songIndex <= 0 ? songs.length - 1 : songIndex - 1;
        playSongAtIndex(newIndex);
        return;
    }

    // Next clicked
    if (e.target.closest('#next')) {
        let newIndex = songIndex >= songs.length - 1 ? 0 : songIndex + 1;
        playSongAtIndex(newIndex);
        return;
    }

    // Individual Song Item clicked
    const songItemBtn = e.target.closest('.songItemPlay');
    if (songItemBtn) {
        let clickedIndex = parseInt(songItemBtn.id);
        if (songIndex === clickedIndex) {
            toggleMasterPlay();
        } else {
            playSongAtIndex(clickedIndex);
        }
    }
});

// Audio Time Update -> Seekbar
audioElement.addEventListener('timeupdate', () => {
    if (!isNaN(audioElement.duration) && audioElement.duration > 0) {
        let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
        myProgressBar.value = progress;
    }
});

// Seekbar Change -> Audio Time
myProgressBar.addEventListener('input', () => {
    if (!isNaN(audioElement.duration)) {
        audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
    }
});
myProgressBar.addEventListener('change', () => {
    if (!isNaN(audioElement.duration)) {
        audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
    }
});

// When song finishes -> auto play next
audioElement.addEventListener('ended', () => {
    let nextIndex = (songIndex + 1) % songs.length;
    playSongAtIndex(nextIndex);
});
