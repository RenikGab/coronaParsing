exports.ProxyInit = function() {
  let settings = require('./settings.json')
  let globalTunnel = require('global-tunnel-ng');
  if (settings.proxy) {
    globalTunnel.initialize({
      host: settings.proxy,
      port: settings.port,
    });
  }
}