var bodyParser = require('koa-bodyparser');
var fs = require('co-fs');
var utils = require('../utils');
var grep = require('../cmd/grep');
var jwt = require('jsonwebtoken');

var api = function (router, scullog) {
  var fileManager = scullog.getFileManager();
  var Tools = new require('../tools')(scullog);

  /**
   * Get Base Directories
   */
  router.get('/base', function* () {
    this.body = scullog.getConfiguration().directory;
  });

  /**
   * Get access permission
   */
  router.get('/access', function () {
    var role = "elevated";
    var expiresIn = this.request.query.t;
    var accessJwt;
    if (expiresIn) {
      var role = "elevated";
      accessJwt = jwt.sign({ role: role }, scullog.getConfiguration().secret, { expiresIn: expiresIn });
      this.cookies.set(scullog.getConfiguration().id, accessJwt, { httpOnly: true })
    } else {
      accessJwt = this.cookies.get(scullog.getConfiguration().id);
      if (accessJwt) {
        try {
          role = jwt.verify(accessJwt, scullog.getConfiguration().secret).role;
        } catch (e) {
          this.cookies.set(scullog.getConfiguration().id, '', { httpOnly: true, expires: new Date(1) })
        }
      }
    }
    this.body = { permissions: scullog.getConfiguration().actions[role] || scullog.getConfiguration().actions.default, role: role };
  });

  /**
   * Search text over a path
   * {pattern: "", folder: "", recursive: true/false, fileMask: "", regex: "extended", ignoreCase: true/false, wholeWord: ""} 
   */
  router.post('/find', Tools.checkBase, bodyParser(), function* () {
    try {
      var criteria = this.request.body.criteria;
      // var folderPath = fileManager.filePath(criteria.folder || 'eops' , this.request.query.base);
      if (criteria.pattern && criteria.folder && (yield fileManager.exists(criteria.folder))) {
        // criteria.folder = folderPath;
        criteria.folder = criteria.folder;
        try {
          this.body = yield grep.exec(criteria);
        } catch (e) {
          this.status = 400;
          this.body = JSON.stringify(e);
        }
      } else {
        this.status = 400;
        this.body = 'Invalid Parameter list - ' + JSON.stringify(criteria);
      }
    } catch (e) {
      console.error(e)
      this.status = 500
      this.body = 'Internal server error.'
    }
  });
}

module.exports = api;