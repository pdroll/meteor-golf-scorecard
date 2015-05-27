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
			var games = Game.find({'completed': false}, {sort : [['created', 'desc']]}).fetch(),
				completeGames = Game.find({'completed': {$ne: false}}, {sort : [['created', 'desc']]}).fetch();

			return {
				title : 'Golf Scorecard',
				games: games,
				completeGames : completeGames
			};
		}
	});
});

//
// Completed Games
Router.route('completed-games', function () {
	this.render('CompletedGames', {
		data: function () {
			var games = Game.find({'completed': {$ne: false}}, {sort : [['created', 'desc']]});

			return {
				games: games
			};
		}
	});
});

//
// Create New Game
Router.route('/create-game', function () {
	this.render('CreateGame', {
		data: {
			users   : User.find({}),
			courses : Course.find({}).fetch()
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

		//
		// Sort players Alphabetically
		game = Game.SortPlayers(game);

		var gameUserIds = [];

		if(game.players){
			game.players.forEach(function(el, ix){
				if(el._id){
					gameUserIds.push(el._id);
				}
			});
		}

		var users = User.find({_id : {$nin : gameUserIds}}).fetch();

		//
		// Sort Players by score
		var leaders = _.clone(game.players);
		leaders.sort(function(a, b){
			if(a.strokes > b.strokes){
				return 1;
			}
			if(a.strokes < b.strokes){
				return -1;
			}
			return 0;
		});

		this.render('GameDashboard', {
			data: function () {
				return {
					game    : game,
					users   : users,
					leaders : leaders
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

		if(game.completed){
			this.redirect('/game/' + game._id);
		}

		//
		// Sort players Alphabetically
		game = Game.SortPlayers(game);

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
			var games = Game.find({'completed': false}, {sort : [['created', 'desc']]}).fetch(),
				completeGames = Game.find({'completed': {$ne: false}}, {sort : [['created', 'desc']]}).fetch();

			return {
				games: games,
				completeGames : completeGames,
				error: 'Page Not Found'
			};
		}
	});
});


//
// Scroll to top on page load
if(Meteor.isClient){
	Router.onAfterAction(function(){
		if ( $('input:focus, button:focus').length === 0) {
			$('body, html').stop().animate({scrollTop : 0}, 300)
		}
	});

}
