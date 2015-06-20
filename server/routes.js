//add Controllers to handle the routes
var authController = require('./controllers/authController');
var urlController = require('./controllers/urlController');

var setup = function(app) {
	app.route('/api/users/login')
    .post(authController.login);
  app.route('/api/users/signup')
    .post(authController.signup)
    .get(authController.login);

	app.route('/api/users/addUrl')
    .post(function(req, res, next) {
			console.log(req.body.url);
			var webshot = require('webshot');

			webshot(req.body.url, '../client/theirSite.jpg', function(err) {
				// screenshot now saved to google.png// screenshot now saved to hello_world.png
				res.send('theirSite.jpg');

			});
		});
}
module.exports.setup = setup;
