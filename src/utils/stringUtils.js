// src/utils/stringUtils.js
const capitalizeText = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

module.exports = { capitalizeText };