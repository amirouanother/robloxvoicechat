// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "robloxvoicechat-ff87d.firebaseapp.com",
  databaseURL: "https://robloxvoicechat-ff87d-default-rtdb.firebaseio.com",
  projectId: "robloxvoicechat-ff87d",
  storageBucket: "robloxvoicechat-ff87d.appspot.com",
  messagingSenderId: "643841114578",
  appId: "1:643841114578:web:9e0dc81b892e16d8e8c80b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Listen for verified users
db.ref("codes").on("value", snapshot => {
  const users = snapshot.val();
  const userList = document.getElementById("user-list");
  userList.innerHTML = "";
  
  for (let userId in users) {
    if (users[userId].verified) {
      const card = document.createElement("div");
      card.className = "user-card";

      const img = document.createElement("img");
      img.src = `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=48&height=48&format=png`;

      const name = document.createElement("span");
      name.textContent = `User ${userId}`;

      const muteBtn = document.createElement("button");
      muteBtn.className = "mute-button";
      muteBtn.textContent = "Mute";
      muteBtn.onclick = () => {
        muteBtn.textContent = muteBtn.textContent === "Mute" ? "Unmute" : "Mute";
      };

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(muteBtn);
      userList.appendChild(card);
    }
  }
});
