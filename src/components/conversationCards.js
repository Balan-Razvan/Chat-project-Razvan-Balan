import { escapeHtml, capitalLetters } from "../utils/helpers.js";

export function createConversationCard(username) {
    const card = document.createElement('div');
    card.className = 'conversation-card';

    card.innerHTML = `
        <div class="conversation-card__avatar">${capitalLetters(username)}</div>
        <div class="conversation-card__header">${escapeHtml(username)}</div>
    `;

    return card;
}

export function renderOnlineUserList(users) {

  const container = document.querySelector('.users-list');
  container.innerHTML = "";

  users.forEach(user => {
    const card = createConversationCard(user.username);
    container.appendChild(card)
  })
}