const auth_routes = require('./user_routes');
const ad_routes = require('./ad_routes');

module.exports = function(app, db) {
  auth_routes(app, db);
  ad_routes(app, db);
};