var authController = require('./controllers/authController');

function setup(app) {
	app.route('/api/users/login')
    .get(authController.login);
	app.route('/api/users/addUrl')
    .post(function(req, res, next) {
			console.log(req.body.url);
			res.send("you are crazy watching this url here: " + req.body.url);
		});
}

exports.setup = setup;
