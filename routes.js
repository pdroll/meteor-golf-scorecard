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
			var games = Game.find({}, {sort : [['created', 'desc']]})
			return {games: games};
		}
	});
});


Router.route('/create-game', function () {
	this.render('CreateGame', {
		data: {
			users   : User.find({}),
			courses : Course.find({})
		}
	});
});


Router.route('/game/:_id', function () {

	this.wait(Meteor.subscribe('games', this.params._id));

	if (this.ready()) {

		var game = Game.findOne(this.params._id);

		if(!game){
			this.redirect('/');
		}

		this.render('GameDashboard', {
			data: function () {
				return {game: game}
			}
		});
	} else {
		this.render('Loading');
	}
});




//
// 404
Router.route('/(.*)', function(){
	error = 'Page Not Found';
	this.render('Dashboard', {
		data: function () {
			var games = Game.find({}, {sort : [['created', 'desc']]})
			return {
				games: games,
				error : 'Page Not Found'
			};
		}
	});
});
