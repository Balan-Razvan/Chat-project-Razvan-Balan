export function escapeHtml(text) {
    const clean = document.createElement('div');
    clean.textContent = text;
    return clean.innerHTML;
}


export function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

export function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}


export function capitalLetters(username) {
  if (!username || typeof username !== "string") return "";

  const parts = username.trim().split(/\s+/);

  if (parts.length === 0) return "";

  const initials = parts
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join("");

  return initials;
}

export function validateUsername(username) {
  if (typeof username !== "string") return false;

  const name = username.trim();

  if (name.length === 0) return false;

  if (name.length < 2 || name.length > 20) return false;

  if (!/^[A-Za-z0-9 ]+$/.test(name)) return false;

  if (/\s{2,}/.test(name)) return false;

  return true;
}
