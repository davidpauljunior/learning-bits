// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');
var handlebars = require('express-handlebars');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'Learnings',
	'brand': 'Learnings',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'hbs',

	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs',
	}).engine,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'wysiwyg additional options': {
        external_plugins: {
            'codesample':'/js/tinymce/plugins/codesample/plugin.min.js'
       }
	},
	'wysiwyg additional buttons': 'codesample',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Switch Keystone Email defaults to handlebars
keystone.Email.defaults.templateExt = 'hbs';
keystone.Email.defaults.templateEngine = require('handlebars');

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	posts: ['posts', 'post-categories'],
	users: 'users',
});

// Configure the environment
keystone.set('mongo', process.env.MONGODB_URI || 'mongodb://localhost/learnings'); // TODO: check this fallback

if (keystone.get('env') == 'production'){
	console.info('env = ' + keystone.get('env'));
    keystone.set('cloudinary config', process.env.CLOUDINARY_URL);
    keystone.set('cookie secret', process.env.COOKIE_SECRET);
}

// Start Keystone to connect to your database and initialise the web server

keystone.start();
