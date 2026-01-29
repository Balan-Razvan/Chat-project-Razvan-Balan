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