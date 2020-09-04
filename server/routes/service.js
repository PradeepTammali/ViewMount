var utils = require('../utils');
var actions = ["all", "start", "stop", "status", "restart", "add", "remove"];
var services;

var api = function (router, scullog) {
  var svc = scullog.getFileManager().getService();
  var servicePath = `${scullog.paths.config}/${scullog.getConfiguration().id}/service.json`;

  function * getServicesFromEnvVars() {
    var envServices;
    if (process.env.MONITORING_SERVICES) {
      envServices = Object.assign({}, ...process.env.MONITORING_SERVICES.split(",").map((x) => ({[x]: ''}))); 
    } else {
      envServices = {}
    }
    return envServices
  }

  function * getServices() {
    if(!services){
      services = Object.assign(yield getServicesFromEnvVars(), yield utils.read(servicePath));
    }
    return services || {};
  }

  /**
   * Start Stop, or Check Status of Service
   */
  router.get("/service", function* () {
    var services = yield getServices();
    var action = this.request.query.a;

    var service = this.request.query.s || (action == 'status' && Object.keys(services));
    var res = {};
    if (action != "all" && (actions.indexOf(action) == -1 || !service)) {
      res.error = `Invalid action ${action} on service ${service}`;
    } else if(action == "add"){
      services[service] = "";
    } else if(action == "remove"){
      delete services[service];
    } else {
      res = yield svc[action](service);
    }
    // yield utils.write(servicePath, this.body = services);
    process.env.MONITORING_SERVICES = Object.keys(services).toString()

    if (res.error) {
      this.status = 400;
      this.body = res.error;
    } else {
      this.body = res;
    }
  });
}

module.exports = api;