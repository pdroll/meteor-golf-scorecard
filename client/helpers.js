var playerNameHelper = function(player){
	var game = Template.instance().data.game,
		name = '';

	game.players.forEach(function(el){
		if(el.id === player.id){
			name = el.name;
			return;
		}
	});

	return name;
};

Template.CreateGame.helpers({

	courseHoleCount : function(course){
		return course.holes.length;
	}
});


Template.gameListItem.helpers({

	timeAgo : function(){
		return moment(this.created).fromNow();
	},

	finishedTime :  function(){
		return moment(this.completed).calendar();
	}

});

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

	playerName : playerNameHelper,

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
					str += hours + ' hours';
				}

				if(hours && minutes){
					str += ' and ';
				}

				if(minutes){
					str += minutes + ' minutes';
				}

				if(!minutes && !hours){
					str += moment.duration(gameEnd - gameStart, 'ms').seconds() + ' seconds';
				}

				return str;

		} else {
			return false;
		}

	}
});

Template.Hole.helpers({

	playerName : playerNameHelper

});
