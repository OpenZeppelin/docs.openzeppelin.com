module.exports = (...xs) => xs.slice(0, -1).reduce((a, b) => a && b);
