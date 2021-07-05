function now() {
  return new Date().toISOString();
}

export default {
  info(message, ...args) {
    console.log(`[browser ${now()}]`, message, ...args);
  },

  warn(message, ...args) {
    console.warn(`[browser ${now()}]`, message, ...args);
  },

  error(message, ...args) {
    console.error(`[browser ${now()}]`, message, ...args);
  }
}
