export default {
  debug(...msg): void {
    if (process.env.mode === 'development') {
      console.log(...msg);
    }
  }
};
