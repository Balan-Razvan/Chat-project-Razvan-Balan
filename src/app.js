import { socketService } from "./services/api.js";
import { createMessage } from "./components/message.js";
import { CONFIG, EVENTS } from "./config.js";
import { scrollToBottom } from "./utils/helpers.js";

document.addEventListener("DOMContentLoaded", () => {
  initDropdowns();
  initChat();
  initUsernameModal();
});

//functii
function sendMessage(elements) {
  const text = elements.messageInput.value.trim();
  if (!text) {
    return;
  }

  socketService.sendMessage(text);
  elements.messageInput.value = "";
  elements.messageInput.style.height = "auto";
}

function addMessageToChat(elements, text, type, timestamp) {
  const msgEl = createMessage(text, type, timestamp);
  elements.messagesWrapper.appendChild(msgEl);
  scrollToBottom(elements.messagesContainer);
}

function updateStatus(statusElement, text, color) {
  statusElement.textContent = text;
  statusElement.style.color = color;
}

// chat
function initChat() {
  const elements = {
    messagesContainer: document.querySelector(".messages-container"),
    messagesWrapper: document.querySelector(".messages-wrapper"),
    messageInput: document.querySelector(".message-input"),
    chatStatus: document.querySelector(".chat-status"),
    sendButton: document.querySelector("#send"),
  };

  socketService.connect();

  socketService.on("connected", () => {
    console.log("connecte");

    updateStatus(elements.chatStatus, "online", "green");

    if(window._pendingUsername) {
      socketService.join(window._pendingUsername);
      window._pendingUsername = null;
    }
  });

  socketService.on("disconnected", () => {
    console.log("disconnected");

    updateStatus(elements.chatStatus, "offline", "red");
  });

  socketService.on("error", (error) => {
    console.log(error);
  });

  socketService.on(EVENTS.MESSAGE_RECEIVE, (data) => {
    console.log("final received message:", data);
    addMessageToChat(
      elements,
      data.message,
      CONFIG.MESSAGE_TYPES.RECEIVED,
      data.timestamp,
    );
  });

  socketService.on(EVENTS.MESSAGE_SENT, (data) => {
    console.log("message sent:", data);
    addMessageToChat(
      elements,
      data.message,
      CONFIG.MESSAGE_TYPES.SENT,
      data.timestamp,
    );
  });

  socketService.on(EVENTS.USER_JOINED, (data) => {
    console.log(`${data.username} joined`);
  });

  socketService.on(EVENTS.USER_LEFT, (data) => {
    console.log(`${data.username} left`);
  });

  socketService.on(EVENTS.USERS_LIST, (users) => {
    console.log(users);
  });


  // event listeneri
  elements.sendButton.addEventListener("click", (e) => {
    e.preventDefault();
    sendMessage(elements);
  });

  elements.messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage(elements);
    }
  });
}

// dropdowns
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = toggle.closest(".dropdown");

      document.querySelectorAll(".dropdown.active").forEach((d) => {
        if (d !== dropdown) {
          d.classList.remove("active");
        }
      });

      dropdown.classList.toggle("active");
    });
  });
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown.active").forEach((dropdown) => {
      dropdown.classList.remove("active");
    });
  }
});

// username

const USERNAME_STORAGE_KEY = 'chat_username';

function getStoredUsername() {
  return sessionStorage.getItem(USERNAME_STORAGE_KEY);
}
function storeUsername(username) {
  sessionStorage.setItem(USERNAME_STORAGE_KEY, username);
}

function updateHeaderUsername(username) {
  const chatTitle = document.querySelector(".chat-title");
  if (chatTitle) {
    chatTitle.textContent = username;
  }
}

function initUsernameModal() {
  const modal = document.getElementById("username-modal");
  const form = document.getElementById('username-form');
  const input = document.getElementById("username-input");

  modal.classList.remove("hidden");

  input.focus();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = input.value.trim();

    if(!username) {
      return;
    }

    storeUsername(username);
    updateHeaderUsername(username);

    modal.classList.add("hidden");

    if(socketService.isConnected) {
      socketService.join(username);
    } else {
      window._pendingUsername = username;
    }
  });
}