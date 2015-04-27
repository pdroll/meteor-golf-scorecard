Game = new Meteor.Collection('Games');

Game.CreateNew = function(users, holes, courseName){

	var players = [];

	users.forEach(function(el,ix){
		players.push({
			_id : el._id,
			id : el.id,
			score : 0,
			strokes : 0,
			name : el.name
		});
	});

	return {
		completed : false,
		isFavorite : false,
		created : moment().format('MM/D/YY h:mm a'),
		course : courseName,
		players : players,
		holes : holes,
		createdBy : Meteor.userId()

	}
};

Game.AddPlayer = function(gameId, user){
	var game = Game.findOne(gameId),
		player = {
			score : 0,
			strokes: 0
		};

	if(user._id){
		player._id = user._id;
		player.id = user._id;
		player.name = user.username;
	} else {
		player.id = Math.random().toString(36).substring(7);
		player.name = user;
	}

	game.players.push(player);

	game.holes.forEach(function(hole){
		hole.players.push({
			id : player.id,
			score : null
		})
	});

	Game.update(game._id, { $set : {
			players : game.players,
			holes : game.holes
		}
	});


};
