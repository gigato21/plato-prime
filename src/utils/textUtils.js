export const truncateText = (text, limit = 20) => {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
};