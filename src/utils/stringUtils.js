// utils/stringUtils.js
export function truncate(text, maxLength = 10) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
