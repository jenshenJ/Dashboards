const reviewRoutes = require('./review_routes');
const auth_routes = require('./user_routes');
const movies_routes = require('./movies_routes');
const ad_routes = require('./ad_routes');

module.exports = function(app, db) {
  reviewRoutes(app, db);
  movies_routes(app, db);
  auth_routes(app, db);
  ad_routes(app, db);
  // Тут, позже, будут и другие обработчики маршрутов 
};