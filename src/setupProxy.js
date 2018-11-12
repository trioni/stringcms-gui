const proxy = require('http-proxy-middleware');
const REMOTE_CONFIG_HOST = 'http://localhost:8085';

const USE_PROXY = process.env.REACT_APP_USE_PROXY;

module.exports = function(app) {
  if (USE_PROXY) {
    app.use(proxy('/app/storage', { target: REMOTE_CONFIG_HOST }));
  }
};