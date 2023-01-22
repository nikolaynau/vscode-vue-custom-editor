function now() {
  return new Date().toISOString();
}

export default {
  info(message: unknown, ...args: unknown[]) {
    console.log(`[browser ${now()}]`, message, ...args);
  },

  warn(message: unknown, ...args: unknown[]) {
    console.warn(`[browser ${now()}]`, message, ...args);
  },

  error(message: unknown, ...args: unknown[]) {
    console.error(`[browser ${now()}]`, message, ...args);
  }
};
