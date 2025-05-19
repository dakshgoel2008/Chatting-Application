// capitaliseWords.js
export function capitaliseWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
