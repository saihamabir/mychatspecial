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

const correctCode = "1314192419"; // change this code if you want

// DOM elements
const loginScreen = document.getElementById("login-screen");
const usernameScreen = document.getElementById("username-screen");
const chatScreen = document.getElementById("chat-screen");

const codeInput = document.getElementById("code-input");
const usernameInput = document.getElementById("username-input");
const messageInput = document.getElementById("message-input");
const messagesDiv = document.getElementById("messages");

let username = localStorage.getItem("chatUser");

// Verify 10-digit code
function verifyCode() {
  if (codeInput.value === correctCode) {
    loginScreen.style.display = "none";
    if (username) {
      showChat();
    } else {
      usernameScreen.style.display = "flex";
    }
  } else {
    alert("Wrong code!");
  }
}

// Set username after code verified
function setUsername() {
  let name = usernameInput.value.trim().toLowerCase();
  if (name !== "abir" && name !== "tisha") {
    alert("Username must be 'Abir' or 'Tisha'");
    return;
  }
  username = name;
  localStorage.setItem("chatUser", username);
  usernameScreen.style.display = "none";
  showChat();
}

// Show chat screen and start listening for messages
function showChat() {
  chatScreen.style.display = "flex";
  listenForMessages();
  messageInput.focus();
}

// Send message to Firebase
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  db.ref("messages").push({
    name: username,
    text: text,
    time: time
  });

  messageInput.value = "";
}

// Listen for new messages and update DOM
function listenForMessages() {
  db.ref("messages").off();
  db.ref("messages").on("child_added", snapshot => {
    addMessageToDOM(snapshot.val());
  });
}

// Add message to chat DOM
function addMessageToDOM(msg) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", msg.name);
  msgDiv.innerHTML = `
    <div>${escapeHtml(msg.text)}</div>
    <div class="timestamp">${capitalize(msg.name)} • ${msg.time}</div>
  `;
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Escape HTML to prevent injection
function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

// Capitalize first letter
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Press Enter to send message
messageInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

