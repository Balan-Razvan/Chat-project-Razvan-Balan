import { escapeHtml, formatTime } from "../utils/helpers.js";
import { CONFIG } from "../config.js";

export function createMessage(content, type = CONFIG.MESSAGE_TYPES.RECEIVED, timestamp = null) {
  const message = document.createElement(`div`);
  message.className = `message message--${type}`;

  const time = timestamp ? new Date(timestamp) : new Date();
  const timeText = formatTime(time);

  message.innerHTML = `
        <div class="message-content">${escapeHtml(content)}</div>
        <span class="message-time">${timeText}</span>
    `;

  return message;
}
