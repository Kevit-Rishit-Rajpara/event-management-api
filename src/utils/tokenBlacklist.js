/**
 * In-memory token blacklist for logout functionality
 * In production, use Redis or database
 */
const tokenBlacklist = new Set();

/**
 * Add token to blacklist
 * @param {string} token - JWT token to blacklist
 */
const addToBlacklist = (token) => {
  tokenBlacklist.add(token);
};

/**
 * Check if token is blacklisted
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is blacklisted
 */
const isBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

/**
 * Clear all blacklisted tokens
 * Only for testing/development
 */
const clearBlacklist = () => {
  tokenBlacklist.clear();
};

module.exports = {
  addToBlacklist,
  isBlacklisted,
  clearBlacklist
};
