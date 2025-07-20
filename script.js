const firebaseConfig = {
  apiKey: "AIzaSyBDaiilZDGOS5kEJgY3SWo0rP6U51MCiQU",
  authDomain: "awesome-chat-f169e.firebaseapp.com",
  databaseURL: "https://awesome-chat-f169e-default-rtdb.firebaseio.com",
  projectId: "awesome-chat-f169e",
  storageBucket: "awesome-chat-f169e.firebasestorage.app",
  messagingSenderId: "804708865216",
  appId: "1:804708865216:web:ec199bf947fd6c5dd90925"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const correctCode = "1314192419"; // your 10-digit code

const loginScreen = document.getElementById("login-screen");
const chatScreen = document.getElementById("chat-screen");
const codeInput = document.getElementById("code-input");
const messageInput = document.getElementById("message-input");
const messagesDiv = document.getElementById("messages");

let username = localStorage.getItem("chatUser");

if (!username) {
  fetch("https://api.ipify.org?format=json")
    .then(res => res.json())
    .then(data => {
      // Replace 'YOUR_TISHA_IP_HERE' with actual IP or just assign names here as you want
      username = (data.ip === "YOUR_TISHA_IP_HERE") ? "tisha" : "abir";
      localStorage.setItem("chatUser", username);
    })
    .catch(() => {
      username = "abir";
      localStorage.setItem("chatUser", username);
    });
}

function verifyCode() {
  if (codeInput.value === correctCode) {
    loginScreen.style.display = "none";
    chatScreen.style.display = "flex";
    listenForMessages();
  } else {
    alert("Wrong code!");
  }
}

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  db.ref("messages").push({
    name: username,
    text: text,
    time: timestamp,
  });

  messageInput.value = "";
}

function listenForMessages() {
  db.ref("messages").off(); // Remove previous listeners if any
  db.ref("messages").on("child_added", (snapshot) => {
    addMessageToDOM(snapshot.val());
  });
}

function addMessageToDOM(msg) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", msg.name);
  msgDiv.innerHTML = `
    <div>${msg.text}</div>
    <div class="timestamp">${msg.name} • ${msg.time}</div>
  `;
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Enter key sends message
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

