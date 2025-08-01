// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBDaiilZDGOS5kEJgY3SWo0rP6U51MCiQU",
  authDomain: "awesome-chat-f169e.firebaseapp.com",
  projectId: "awesome-chat-f169e",
  storageBucket: "awesome-chat-f169e.appspot.com",
  messagingSenderId: "804708865216",
  appId: "1:804708865216:web:ec199bf947fd6c5dd90925"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Your 10-digit code to access chat
const correctCode = "17072007"; // Change this as you want

// Elements
const landing = document.getElementById("landing");
const codeInput = document.getElementById("codeInput");
const codeSubmit = document.getElementById("codeSubmit");

const namePrompt = document.getElementById("namePrompt");
const nameInput = document.getElementById("nameInput");
const nameSubmit = document.getElementById("nameSubmit");

const chat = document.getElementById("chat");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

// Variables
let currentUserName = null;

// Step 1: Check the code
function checkCode() {
  if (codeInput.value.trim() === correctCode) {
    landing.style.display = "none";
    // Show name prompt
    namePrompt.style.display = "block";
    // If name already saved, skip prompt
    const savedName = localStorage.getItem("chatUserName");
    if (savedName && savedName.trim() !== "") {
      currentUserName = savedName;
      namePrompt.style.display = "none";
      showChat();
    }
  } else {
    alert("Wrong code. Try again.");
  }
}

// Step 2: After name entered
function submitName() {
  const enteredName = nameInput.value.trim();
  if (enteredName === "") {
    alert("Please enter your name");
    return;
  }
  currentUserName = enteredName;
  localStorage.setItem("chatUserName", enteredName);
  namePrompt.style.display = "none";
  showChat();
}

// Step 3: Show chat & start listening for messages
function showChat() {
  chat.style.display = "block";
  loadMessages();
}

// Step 4: Load and listen for messages
function loadMessages() {
  db.collection("messages")
    .orderBy("timestamp")
    .onSnapshot((snapshot) => {
      messagesDiv.innerHTML = "";
      snapshot.forEach((doc) => {
        const data = doc.data();
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message");

        // Check if the message is from current user
        if (data.sender === currentUserName) {
          msgDiv.classList.add("you");
        } else {
          msgDiv.classList.add("other");
        }

        // Format time
        let timeString = "";
        if (data.timestamp && data.timestamp.toDate) {
          const date = data.timestamp.toDate();
          timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        msgDiv.innerHTML = `
          <span class="sender">${data.sender}</span>
          <span class="time">${timeString}</span><br />
          <span>${data.text}</span>
        `;

        messagesDiv.appendChild(msgDiv);
      });
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

// Step 5: Send message to Firestore
function sendMessage() {
  const text = messageInput.value.trim();
  if (text === "") return;
  db.collection("messages").add({
    text: text,
    sender: currentUserName,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  messageInput.value = "";
}

// Event listeners
codeSubmit.addEventListener("click", checkCode);
codeInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") checkCode();
});

nameSubmit.addEventListener("click", submitName);
nameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") submitName();
});

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

