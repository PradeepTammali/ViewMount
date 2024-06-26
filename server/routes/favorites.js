// var utils = require('../utils');
var router = require('koa-router')();
var bodyParser = require('koa-bodyparser');


/**
 * Favorites CRUD Operation
 */
var api = function (router, scullog) {
  var favorites;
  var fileManager = scullog.getFileManager();
  var Tools = new require('../tools')(scullog);
  
  // var favoritePath = `${scullog.paths.config}/${scullog.getConfiguration().id}/favorite.json`;

  function * getFavourites(){
    if(!favorites){
      favorites = yield getFavouritesFromEnvVars();
      // favorites = yield utils.read(favoritePath);
    }
    return favorites
  }

  function * getFavouritesFromEnvVars() {
    var envFavourites;
    if (process.env.FAVOURITES) {
      envFavourites = Object.assign({}, ...JSON.parse(process.env.FAVOURITES)); 
    } else {
      envFavourites = {}
    }
    return envFavourites
  }
  
  router.get('/favorite', function* () {
    this.body = yield getFavourites();
  });

  router.post('/favorite', Tools.checkBase, bodyParser(), function* () {
    var favorites = yield getFavourites();
    // fileManager.filePath(this.request.body.path, this.request.query.base);
    favorites[this.request.query.base] = favorites[this.request.query.base] || {};
    favorites[this.request.query.base][this.request.body.path] = this.request.body.name;
    process.env.FAVOURITES = JSON.stringify(favorites);
    this.body = favorites
    // yield utils.write(favoritePath, this.body = favorites);
  });

  router.delete('/favorite', function* () {
    var favorites = yield getFavourites();
    var p = this.request.query.path;
    if (favorites[this.request.query.base] && p in favorites[this.request.query.base]) {
      delete favorites[this.request.query.base][p];
      process.env.FAVOURITES = JSON.stringify(favorites)
      this.body = favorites
      // yield utils.write(favoritePath, this.body = favorites);
    } else {
      this.body = "Bad argument type";
      this.status = 400;
    }
  });
}

module.exports = api;