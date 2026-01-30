const USERNAME_STORAGE_KEY = 'chat_username';

export function storeUsername(username) {
  sessionStorage.setItem(USERNAME_STORAGE_KEY, username);
}

export function updateHeaderUsername(username) {
  const chatTitle = document.querySelector(".chat-title");
  chatTitle.textContent = "Global"
//   if (chatTitle) {
//     chatTitle.textContent = username;
//   }
}