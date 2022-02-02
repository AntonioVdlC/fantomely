// TODO: maybe use a library instead?

export default {
  error(message: string, ...args: any) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(message, ...args);
    }
    // TODO: production logging
  },
  // TODO: more log levels
};
