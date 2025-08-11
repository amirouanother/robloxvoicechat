import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBAy6nHdduQtb6XScGxcMVrt0hXO8aCneU",
    authDomain: "robloxvoicechat-ff87d.firebaseapp.com",
    databaseURL: "https://robloxvoicechat-ff87d-default-rtdb.firebaseio.com",
    projectId: "robloxvoicechat-ff87d",
    storageBucket: "robloxvoicechat-ff87d.firebasestorage.app",
    messagingSenderId: "643841114578",
    appId: "1:643841114578:web:9e0dc81b892e16d8e8c80b",
    measurementId: "G-1T9V6SQV48"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const verifyBtn = document.getElementById("verify-btn");
const useridInput = document.getElementById("userid");
const codeInput = document.getElementById("code");
const verifyPanel = document.getElementById("verify-panel");
const voicePanel = document.getElementById("voice-panel");
const playerList = document.getElementById("player-list");

let localStream;
let peers = {};

verifyBtn.addEventListener("click", async () => {
    const userId = useridInput.value.trim();
    const code = codeInput.value.trim().toUpperCase();

    const snapshot = await get(child(ref(db), `codes/${userId}`));
    if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.code === code) {
            await update(ref(db, `codes/${userId}`), { verified: true });
            alert("Verified! Connecting to voice chat...");
            startVoiceChat(userId);
        } else {
            alert("Incorrect code");
        }
    } else {
        alert("No code found for this user");
    }
});

async function startVoiceChat(userId) {
    verifyPanel.style.display = "none";
    voicePanel.style.display = "block";

    // Get microphone
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // TODO: Replace with proper WebRTC signaling (Firebase or WebSocket server)
    addPlayer(userId, "https://www.roblox.com/headshot-thumbnail/image?userId=" + userId + "&width=100&height=100&format=png", localStream);
}

function addPlayer(userId, avatarUrl, stream) {
    const playerDiv = document.createElement("div");
    playerDiv.className = "player";

    const avatar = document.createElement("img");
    avatar.src = avatarUrl;

    const name = document.createElement("span");
    name.textContent = "User " + userId;

    const muteBtn = document.createElement("button");
    muteBtn.textContent = "Mute";
    muteBtn.className = "mute-btn unmuted";

    muteBtn.addEventListener("click", () => {
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack.enabled) {
            audioTrack.enabled = false;
            muteBtn.textContent = "Unmute";
            muteBtn.classList.remove("unmuted");
        } else {
            audioTrack.enabled = true;
            muteBtn.textContent = "Mute";
            muteBtn.classList.add("unmuted");
        }
    });

    playerDiv.appendChild(avatar);
    playerDiv.appendChild(name);
    playerDiv.appendChild(muteBtn);

    playerList.appendChild(playerDiv);
}
