//
// Set Layout
Router.configure({
  layoutTemplate: 'AppLayout'
});

//
// Redirect guests to login screen
Router.onBeforeAction(function () {
  if (!Meteor.userId()) {
    this.render('Login');
  } else {
    this.next();
  }
});

Router.route('/', function () {
	this.render('Dashboard', {
		data: function () {
			var games = Games.find({}, {sort : [['created', 'desc']]})
			return {games: games};
		}
	});
});


Router.route('profile', function () {
	this.render('Profile', {
		data: function () {
			return {user: Meteor.user()}
		}
	});
});




//
// 404
Router.route('/(.*)', function(){
	error = 'Page Not Found';
	this.render('Dashboard', {
		data: function () {
			var games = Games.find({}, {sort : [['created', 'desc']]})
			return {
				games: games,
				error : 'Page Not Found'
			};
		}
	});
});
