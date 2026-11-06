
// ========================================
// HIM - HIS INFINITE MAJESTY
// Premium Worship Music Player
// ========================================

const songs = [
    { title: "As the Deer", artist: "Worship Collection", id: "jSZWogD0AH4" },
    { title: "Avarey", artist: "Benny Joshua", id: "rhbk-FrzejQ" },
    { title: "Ejamaananae", artist: "John Jebaraj", id: "zYeg0rdh4d0" },
    { title: "Ezhumbi Varum", artist: "Benny Joshua", id: "wEcEo0jRok0" },
    { title: "Nambuven", artist: "Reenu Kumar", id: "LvnHTG3hDjU" },
    { title: "Poorana Azhagey", artist: "Kingdom Community", id: "EBnJHhhxwRs" },
    { title: "Sharon Rojavey", artist: "Gift Endurai", id: "AvPEbvW_Idc" },
    { title: "Way Maker", artist: "Worship Collection", id: "iJCV_2H9xD0" },
    { title: "What a Friend We Have in Jesus", artist: "Worship Collection", id: "8SCorW9r_Is" },
    { title: "Been So Good", artist: "Worship Collection", id: "D3yMC_qoAes" }
];

// PLAYER VARIABLES
let currentSong = 0;
let player = null;
let isPlaying = false;
let progressTimer = null;

// HTML ELEMENTS
const title = document.getElementById("song-title");
const artist = document.getElementById("song-artist");
const playlist = document.getElementById("playlist");
const playButton = document.getElementById("play");
const progress = document.getElementById("progress");

// ========================================
// FORMAT SONG TIME
// ========================================

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// ========================================
// DISPLAY PLAYLIST
// ========================================

function displayPlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {
        const item = document.createElement("div");

        item.className = "song-item";

        item.innerHTML = `
            <span>
                <span class="song-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>
                ${song.title}
            </span>

            <span class="song-icon">♪</span>
        `;

        item.addEventListener("click", () => {
            currentSong = index;
            playSong();
        });

        playlist.appendChild(item);
    });

    updatePlaylist();
}

// ========================================
// UPDATE ACTIVE SONG
// ========================================

function updatePlaylist() {
    document.querySelectorAll(".song-item").forEach((item, index) => {
        item.classList.toggle("active", index === currentSong);
    });
}

// ========================================
// UPDATE SONG INFORMATION
// ========================================

function updateSongDetails() {
    title.textContent = songs[currentSong].title;
    artist.textContent = songs[currentSong].artist;

    updatePlaylist();
}

// ========================================
// PLAY SELECTED SONG
// ========================================

function playSong() {
    if (!player) return;

    updateSongDetails();

    document.body.classList.remove("is-playing");

    player.loadVideoById(songs[currentSong].id);
}

// ========================================
// NEXT SONG
// ========================================

function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    playSong();
}

// ========================================
// PREVIOUS SONG
// ========================================

function previousSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    playSong();
}

// ========================================
// PLAY / PAUSE BUTTON
// ========================================

playButton.addEventListener("click", () => {
    if (!player) return;

    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});

document.getElementById("next").addEventListener("click", nextSong);
document.getElementById("prev").addEventListener("click", previousSong);

// ========================================
// PLAYBACK PROGRESS
// ========================================

function updateProgress() {
    if (!player || !player.getDuration) return;

    const duration = player.getDuration();
    const current = player.getCurrentTime();

    if (!duration || !Number.isFinite(duration)) return;

    if (progress) {
        progress.value = (current / duration) * 100;
    }

    document.getElementById("current-time").textContent =
        formatTime(current);

    document.getElementById("total-time").textContent =
        formatTime(duration);
}

function startProgress() {
    clearInterval(progressTimer);
    progressTimer = setInterval(updateProgress, 1000);
}

function stopProgress() {
    clearInterval(progressTimer);
}

// SEEK SONG
if (progress) {
    progress.addEventListener("input", () => {
        if (!player || !player.getDuration()) return;

        const seekTime =
            (Number(progress.value) / 100) * player.getDuration();

        player.seekTo(seekTime, true);
    });
}

// ========================================
// YOUTUBE PLAYER API
// ========================================

function onYouTubeIframeAPIReady() {

    player = new YT.Player("youtube-player", {

        width: "100%",
        height: "100%",

        videoId: songs[currentSong].id,

        playerVars: {
            playsinline: 1,
            rel: 0
        },

        events: {

            onReady: function(event) {

                event.target.setVolume(70);

                updateSongDetails();
                updateProgress();

            },

            onStateChange: function(event) {

                // SONG PLAYING
                if (event.data === YT.PlayerState.PLAYING) {

                    isPlaying = true;

                    playButton.textContent = "Ⅱ";

                    document.body.classList.add("is-playing");

                    startProgress();

                }

                // SONG PAUSED
                else if (event.data === YT.PlayerState.PAUSED) {

                    isPlaying = false;

                    playButton.textContent = "▶";

                    document.body.classList.remove("is-playing");

                    stopProgress();

                }

                // SONG ENDED
                else if (event.data === YT.PlayerState.ENDED) {

                    isPlaying = false;

                    document.body.classList.remove("is-playing");

                    nextSong();

                }

                // BUFFERING
                else if (event.data === YT.PlayerState.BUFFERING) {

                    playButton.textContent = "…";

                }

                // VIDEO CUED
                else if (event.data === YT.PlayerState.CUED) {

                    isPlaying = false;

                    playButton.textContent = "▶";

                    document.body.classList.remove("is-playing");

                    stopProgress();

                }

            }

        }

    });

}

// ========================================
// INITIALIZE PLAYLIST
// ========================================

displayPlaylist();

// ========================================
// LOAD OFFICIAL YOUTUBE API
// ========================================

const youtubeScript = document.createElement("script");

youtubeScript.src = "https://www.youtube.com/iframe_api";

document.head.appendChild(youtubeScript);

// ========================================
// HIM INITIALIZATION COMPLETE
// ========================================
