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

//
// Main Dashboard
Router.route('/', function () {
	this.render('Dashboard', {
		data: function () {
			var games = Game.find({}, {sort : [['created', 'desc']]})
			return {games: games};
		}
	});
});

//
// Create New Game
Router.route('/create-game', function () {
	this.render('CreateGame', {
		data: {
			users   : User.find({}),
			courses : Course.find({})
		}
	});
});

//
// Game Dashboard
Router.route('/game/:_id', function () {

	this.wait(Meteor.subscribe('games', this.params._id));

	if (this.ready()) {

		var game = Game.findOne(this.params._id);

		if(!game){
			this.redirect('/');
		}

		var gameUserIds = [];

		if(game.players){
			game.players.forEach(function(el, ix){
				if(el._id){
					gameUserIds.push(el._id);
				}
			});
		}

		var users = User.find({_id : {$nin : gameUserIds}}).fetch();

		this.render('GameDashboard', {
			data: function () {
				return {
					game: game,
					users: users
				}
			}
		});
	} else {
		this.render('Loading');
	}
});


//
// Hole page
Router.route('/game/:_id/:_hole', function () {


	this.wait(Meteor.subscribe('games', this.params._id));

	if (this.ready()) {

		var game = Game.findOne(this.params._id);

		if(!game){
			this.redirect('/');
		}

		var _holeId = parseInt(this.params._hole, 10);
			hole = false;

		game.holes.some(function(el){

			if(el.number === _holeId){
				hole = el;
			}
			return el.number === _holeId;
		});

		if(!hole){
			this.redirect('/');
		}

		this.render('Hole', {
			data: function () {
				return {
					game: game,
					hole: hole
				}
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
