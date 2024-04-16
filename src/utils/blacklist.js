const blacklistedTokens = new Set();

const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

const addToBlacklist = (token) => {
  blacklistedTokens.add(token);
};

module.exports = {
  isTokenBlacklisted,
  addToBlacklist,
};