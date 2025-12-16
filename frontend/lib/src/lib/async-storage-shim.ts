// React Native Async Storage shim for browser/Next.js environments.
// MetaMask SDK expects this package but it doesn't exist on web.
export default {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};
