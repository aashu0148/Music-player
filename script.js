const audioElems = document.querySelectorAll("audio");
const player = document.querySelector(".player");
const disc = player.querySelector(".disc");
const playPause = player.querySelector(".play-pause");
const prev = player.querySelector(".prev");
const next = player.querySelector(".next");
const progressBar = player.querySelector(".progress-bar");
const progress = player.querySelector(".progress");

const songs = [];
let songPointer = 0;
audioElems.forEach(song => songs.push(song));
let playing = false;
songPlaying(songPointer);

function playSong(p) {
    let song = songs[p];
    song.currentTime = 0;
    song.play();
    playing = true;
    songPlaying(songPointer);
}

function handleProgress() {
    if (!playing) return;
    let song = songs[songPointer];
    let prog = ((song.currentTime / song.duration) * 100).toFixed(4);
    progress.style.width = `${prog}%`;
    if (song.currentTime == song.duration) {
        next.click();
    }
}

function songPlaying() {
    clearInterval(timeUpdate);
    var timeUpdate = setInterval(handleProgress, 300);
}

function animateDisc() {
    if (playing) {
        disc.classList.add("disc-animate");
    } else {
        disc.classList.remove("disc-animate");
    }
}

next.addEventListener("click", () => {
    songs[songPointer].pause();
    playing = false;
    animateDisc();
    if (songPointer < songs.length - 1)
        ++songPointer;
    else songPointer = 0;
    setTimeout(() => {
        playPause.click();
        playSong(songPointer);
    }, 300)
})
prev.addEventListener("click", () => {
    songs[songPointer].pause();
    playing = false;
    animateDisc();
    if (songPointer > 0)
        --songPointer;
    else songPointer = songs.length - 1;
    setTimeout(() => {
        playPause.click();
        playSong(songPointer);
    }, 300)
})
playPause.addEventListener("click", () => {
    if (songs[songPointer].paused) {
        songs[songPointer].play();
        playing = true;
        playPause.classList.replace("fa-play", "fa-pause");
    }
    else {
        songs[songPointer].pause();
        playing = false;
        playPause.classList.replace("fa-pause", "fa-play");
    }
    animateDisc();
})

progressBar.addEventListener("click", (e) => {
    let prog = ((e.offsetX / progressBar.clientWidth) * 100).toFixed(2);
    let song = songs[songPointer];
    song.currentTime = (prog / 100) * song.duration;
    progress.style.width = `${prog}%`;

})
let progMDown = false;
progressBar.addEventListener("mousedown", () => {
    progMDown = true;
    let song = songs[songPointer];
    song.pause();
})
progressBar.addEventListener("mouseup", () => {
    progMDown = false;
    if (playing) {
        let song = songs[songPointer];
        song.play();
    }
})
progressBar.addEventListener("mouseleave", () => {
    if (playing) {
        let song = songs[songPointer];
        song.play();
    }
    progMDown = false;
})
progressBar.addEventListener("mousemove", (e) => {
    if (progMDown) {
        let prog = ((e.offsetX / progressBar.clientWidth) * 100).toFixed(2);
        let song = songs[songPointer];
        song.currentTime = (prog / 100) * song.duration;
        progress.style.width = `${prog}%`;
    }
})
