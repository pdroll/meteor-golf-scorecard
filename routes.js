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
					game  : game,
					users : users
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

		var holeNum = parseInt(this.params._hole, 10),
			prevHoleNum = holeNum - 1,
			nextHoleNum = holeNum + 1,
			hole = false,
			prevHole = false,
			nextHole = false;

		game.holes.some(function(el){
			if(el.number === prevHoleNum){
				prevHole = el;
			}
			if(el.number === holeNum){
				hole = el;
			}
			if(el.number === nextHoleNum){
				nextHole = el;
			}
			if(prevHole && hole && nextHole){
				return true;
			}
			return false;
		});

		if(!hole){
			this.redirect('/game/'+ game._id);
		}

		this.render('Hole', {
			data: function () {
				return {
					game     : game,
					hole     : hole,
					prevHole : prevHole,
					nextHole : nextHole
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


//
// Scroll to top on page load
if(Meteor.isClient){
	Router.onAfterAction(function(){
		if ( $('input:focus, button:focus').length == 0) {
			$('body, html').stop().animate({scrollTop : 0}, 300)
		}
	});

}
