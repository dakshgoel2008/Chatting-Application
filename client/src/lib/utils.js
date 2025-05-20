// date formatter
export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

// capitaliseWords.js
export function capitaliseWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
