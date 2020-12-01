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
const errorMessage = player.querySelector(".error");
const repeatButton = player.querySelector(".repeat");
const shuffleButton = player.querySelector(".shuffle");

const songs = [];
let songPointer = 0;
let playing = false;
let volume = 0.5;
let repeat = "all";
trackSong(songPointer);

function populateFileList(songs) {
    let html = songs.map((e, i) => {
        return `<p data-id=${i}>${e.name}</p>`;
    }).join(" ");
    fileList.innerHTML = html;
}
function play(pointer) {
    songs[pointer].song.volume = volume;
    songs[pointer].song.play();
    playing = true;
    disc.classList.add("disc-animate");
    title.innerText = songs[pointer].name;
    playPause.classList.replace("fa-play", "fa-pause");
}
function pause(pointer) {
    songs[pointer].song.pause();
    playing = false;
    disc.classList.remove("disc-animate");
    playPause.classList.replace("fa-pause", "fa-play");
}
function playSong(p) {
    let song = songs[p].song
    song.currentTime = 0;
    play(p);
}

function handleProgress() {
    if (!playing) return;
    let song = songs[songPointer].song;
    let prog = ((song.currentTime / song.duration) * 100).toFixed(1);
    progress.value = prog;
    if (song.currentTime == song.duration) {
        if (repeat == "all") {
            next.click();
        } else if (repeat == "one") {
            songs[songPointer].currentTime = 0;
            play(songPointer);
        } else if (repeat == "none") {
            pause(songPointer);
        }
    }
}

function trackSong() {
    clearInterval(timeUpdate);
    var timeUpdate = setInterval(handleProgress, 500);
}

function showErrorMessage(msg) {
    errorMessage.style.opacity = 1;
    errorMessage.innerText = msg;
    setTimeout(() => {
        errorMessage.style.opacity = 0;
    }, 8000);
}

function displayRepeat(prevRepeat, repeat) {
    repeatButton.classList.replace(`repeat-${prevRepeat}`, `repeat-${repeat}`);
}

next.addEventListener("click", () => {
    if (songs.length == 0) {
        showErrorMessage("No song Selected :/")
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
        showErrorMessage("No song Selected :/")
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
        showErrorMessage("No song Selected :/")
    } else {
        if (songs[songPointer].song.paused)
            play(songPointer);
        else
            pause(songPointer);
    }
})
progress.addEventListener("input", () => {
    if (songs.length == 0) {
        showErrorMessage("No song Selected :/")
    } else {
        let prog = progress.value;
        let song = songs[songPointer].song;
        song.currentTime = (prog / 100) * song.duration;
    }
})

fileInput.addEventListener("change", (e) => {
    let files = Array.from(e.target.files);
    files.forEach(file => {
        let type = file.type;
        if (type.includes("audio") || type.includes("mp3") || type.includes("aac") || type.includes("wav")) {
            let url = URL.createObjectURL(file);
            let audio = document.createElement("audio");
            audio.src = url;
            let obj = {
                song: audio,
                name: file.name
            };
            songs.push(obj);
        } else {
            showErrorMessage("Files should be of '.mp3' , '.aac' , '.wav' extensions")
        }
    })
    populateFileList(songs);
})
volumeInput.addEventListener("input", () => {
    volume = volumeInput.value;
    songs[songPointer].song.volume = volume;
})

repeatButton.addEventListener("click", () => {
    if (repeat == "all") {
        repeat = "one";
        displayRepeat("all", repeat);
    } else if (repeat == "one") {
        repeat = "none";
        displayRepeat("one", repeat);
    } else if (repeat == "none") {
        repeat = "all";
        displayRepeat("none", repeat);
    }
})

shuffleButton.addEventListener("click", () => {
    songs.sort(() => Math.random() - 0.5);
    populateFileList(songs);
})

