/**
 * Escapes regex special characters to prevent ReDoS and regex injection attacks
 * @param {string} string 
 * @returns {string}
 */
export const escapeRegex = (string = '') => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Trims and sanitizes basic string input
 * @param {string} str 
 * @param {number} maxLen 
 * @returns {string}
 */
export const sanitizeString = (str = '', maxLen = 500) => {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
};
