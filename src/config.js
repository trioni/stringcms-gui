const USE_PROXY = process.env.REACT_APP_USE_PROXY;
const HOST = USE_PROXY ? '/app/storage' : process.env.REACT_APP_ENDPOINT;

const config = {
  storageHost: HOST,
};

export default config;