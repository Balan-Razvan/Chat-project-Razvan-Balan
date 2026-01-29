import { socketService } from "./services/api.js";
import { createMessage } from "./components/message.js";
import { CONFIG } from "./config.js";
import { scrollToBottom } from "./utils/helpers.js";

document.addEventListener("DOMContentLoaded", () => {
  initDropdowns();
  initChat();
});

function initChat() {
  const messagesContainer = document.querySelector(".messages-container");
  const messagesWrapper = document.querySelector(".messages-wrapper");
  const messageInput = document.querySelector(".message-input");
  const chatStatus = document.querySelector(".chat-status");
  const sendButton = document.querySelector(
    ".input-wrapper > .btn-icon:last-child",
  );

  socketService.connect();

  

  socketService.on("connected", () => {
    console.log("connecte");

    chatStatus.textContent = "Online";
    chatStatus.style.color = "green";

    socketService.join(CONFIG.DEFAULT_USERNAME);
  });

  socketService.on("disconnected", () => {
    console.log("disconnected");

    chatStatus.textContent = "Offline";
    chatStatus.style.color = "red";
  });



  socketService.on("message:receive", (data) => {
    console.log("received message:", data);
    const text = data?.message ?? "";
    const timestamp = data?.timestamp ?? null;

    const msgEl = createMessage(text, CONFIG.MESSAGE_TYPES.RECEIVED, timestamp);
    messagesWrapper.appendChild(msgEl);
    scrollToBottom(messagesContainer);
  });

  socketService.on("message:sent", (data) => {
    console.log("message sent:", data);
    const text = data?.message ?? "";
    const timestamp = data?.timestamp ?? null;

    const msgEl = createMessage(text, CONFIG.MESSAGE_TYPES.SENT, timestamp);
    messagesWrapper.appendChild(msgEl);
    scrollToBottom(messagesContainer);
  });

  function sendMessage() {
    const text = messageInput.value.trim();

    socketService.sendMessage({message: text});
    messageInput.value = "";
    messageInput.style.height = "auto";
  }

  sendButton.addEventListener("click", sendMessage);

  messageInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
      sendMessage();
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
