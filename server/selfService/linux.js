module.exports = function(conf){
    var linuxService = require('node-linux').Service;
    var s = new linuxService(conf);    
    var eventCB = {};
    this.install = function(){
        s.install();
    }
    this.uninstall = function(){
        s.uninstall();
    }
    this.start = function(){
        s.start();
    }
    this.stop = function(){
        s.stop();
    }
    this.on = function(event, cb){
        eventCB[event] = eventCB[event] || [];
        eventCB[event].push(cb);
    }
} 