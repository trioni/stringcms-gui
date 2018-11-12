const proxy = require('http-proxy-middleware');
const REMOTE_CONFIG_HOST = 'http://localhost:8085';

module.exports = function(app) {
  app.use(proxy('/app/storage', { target: REMOTE_CONFIG_HOST }));
};