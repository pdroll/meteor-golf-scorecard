Template.GameDashboard.helpers({

	canDeletePlayer : function(){

		var game = Template.instance().data.game,
			currentUserId = Meteor.userId();

		if(currentUserId === game.createdBy || this._id === currentUserId){
			return true;
		} else {
			return false;
		}

	},

	creatorName : function(){
		var game = Template.instance().data.game,
			creator =  User.findOne(game.createdBy);

		if(creator){
			return creator.username;
		} else {
			return null;
		}
	},

	formattedTime : function(dateStr){
		return moment(dateStr).format('llll');
	},

	playerName : function(player){
		var game = Template.instance().data.game;

		return Game.GetPlayerName(game, player);
	},

	holeUrl : function(){
		var game =  Template.instance().data.game;

		return '/game/' + game._id + '/' + this.number;

	},

	duration : function(){
		var game =  Template.instance().data.game;

		if(game.completed){

			var gameStart = (new Date(game.created).getTime()),
				gameEnd   = (new Date(game.completed).getTime())
				hours     = moment.duration(gameEnd - gameStart, 'ms').hours(),
				minutes   = moment.duration(gameEnd - gameStart, 'ms').minutes(),
				str = '';

				if(hours){
					str += hours + ' hour';
					str += (hours > 1) ? 's' : '';
				}

				if(hours && minutes){
					str += ' and ';
				}

				if(minutes){
					str += minutes + ' minute';
					str += (minutes > 1) ? 's' : '';
				}

				if(!minutes && !hours){
					str += moment.duration(gameEnd - gameStart, 'ms').seconds() + ' seconds';
				}

				return str;

		} else {
			return false;
		}

	},

	//
	// Keep reference to Hole's par on each player
	holePlayers : function( hole ){
		var players = [];
		hole.players.forEach(function(el){
			el.holepar = hole.par;
			players.push(el);
		});

		return players;
	},

	//
	// How does score compare to par
	scoreClass : function(){
		if(!this.score){
			return '';
		}

		var birdie = this.holepar - 1,
			bogey = this.holepar + 1;

		if(this.score === this.holepar){
			return 'par';
		}

		if(this.score === birdie ){
			return 'birdie';
		}

		if(this.score < birdie){
			return 'eagle';
		}

		if(this.score === bogey){
			return 'bogey';
		}

		if(this.score > bogey){
			return 'doublebogey';
		}

		return '';
	},

	formattedScore : function(score){

		if(score > 0){
			return '+' + score;
		} else {
			return '' + score
		}

	},

	coursePar : function(){

		var par = 0;

		this.game.holes.forEach(function(hole){
			par += parseInt(hole.par, 10);
		});

		return par;
	},

	currentView : function(inverse){

		var current = Session.get('scorecardView');

		if(!current){
			current = Session.set('scorecardView', 'grid');
			current = Session.get('scorecardView');
		}

		if(current === 'grid'){
			return inverse ? 'classic' : 'grid';
		} else {
			return inverse ? 'grid' : 'classic';
		}
	}
});
