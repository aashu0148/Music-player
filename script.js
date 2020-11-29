const fileList = document.querySelector(".file-list");
const fileInput = document.querySelector(".display-input input");
const player = document.querySelector(".player");
const title = player.querySelector(".player .title");
const disc = player.querySelector(".disc");
const playPause = player.querySelector(".play-pause");
const prev = player.querySelector(".prev");
const next = player.querySelector(".next");
const progress = player.querySelector(".progress");
const volumeInput = player.querySelector(".volume");

const songs = [];
const songNames = [];
let songPointer = 0;
let playing = false;
let volume = 0.5;
trackSong(songPointer);

function populateFileList(songNames) {
    let html = songNames.map(song => {
        return `<p>${song}</p>`;
    }).join(" ");
    fileList.innerHTML = html;
}
function play(pointer) {
    songs[pointer].volume = volume;
    songs[pointer].play();
    playing = true;
    disc.classList.add("disc-animate");
    title.innerText = songNames[pointer];
    playPause.classList.replace("fa-play", "fa-pause");
}
function pause(pointer) {
    songs[pointer].pause();
    playing = false;
    disc.classList.remove("disc-animate");
    playPause.classList.replace("fa-pause", "fa-play");
}
function playSong(p) {
    let song = songs[p];
    song.currentTime = 0;
    play(p);
}

function handleProgress() {
    if (!playing) return;
    let song = songs[songPointer];
    let prog = ((song.currentTime / song.duration) * 100).toFixed(1);
    progress.value = prog;
    if (song.currentTime == song.duration) {
        next.click();
    }
}

function trackSong() {
    clearInterval(timeUpdate);
    var timeUpdate = setInterval(handleProgress, 500);
}

next.addEventListener("click", () => {
    if (songs.length == 0) {
        title.innerText = "Please Select a Song";
    } else {
        pause(songPointer);
        if (songPointer < songs.length - 1)
            ++songPointer;
        else songPointer = 0;
        playSong(songPointer)
    }
})
prev.addEventListener("click", () => {
    if (songs.length == 0) {
        title.innerText = "Please Select a Song";
    } else {
        pause(songPointer);
        if (songPointer > 0)
            --songPointer;
        else songPointer = songs.length - 1;
        playSong(songPointer)
    }
})
playPause.addEventListener("click", () => {
    if (songs.length == 0) {
        title.innerText = "Please Select a Song";
    } else {
        if (songs[songPointer].paused)
            play(songPointer);
        else
            pause(songPointer);
    }
})
progress.addEventListener("input", () => {
    if (songs.length == 0) {
        title.innerText = "Please Select a Song";
    } else {
        let prog = progress.value;
        let song = songs[songPointer];
        song.currentTime = (prog / 100) * song.duration;
    }
})

fileInput.addEventListener("change", (e) => {
    let files = Array.from(e.target.files);
    files.forEach(file => {
        let type = file.type;
        if (type.includes("audio") || type.includes("mp3") || type.includes("aac") || type.includes("wav")) {
            songNames.push(file.name);
            let url = URL.createObjectURL(file);
            let audio = document.createElement("audio");
            audio.src = url;
            songs.push(audio);
        }
    })
    populateFileList(songNames);
})
volumeInput.addEventListener("input", () => {
    volume = volumeInput.value;
    songs[songPointer].volume = volume;
})

