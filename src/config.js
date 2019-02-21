const USE_PROXY = process.env.REACT_APP_USE_PROXY;
const HOST = USE_PROXY ? '/app/storage' : process.env.REACT_APP_ENDPOINT;

const config = {
  storageHost: HOST,
  colorScale: [
    '#BEE0D2',
    '#29196C',
    '#A5D3C9',
    '#2C3986',
    '#8CC6C4',
    '#375391',
    '#73AEB8',
    '#5B8FAA'
  ]
};

export default config;