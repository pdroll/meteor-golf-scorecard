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
		created : (new Date),
		course : courseName,
		players : players,
		holes : holes,
		createdBy : Meteor.userId()

	}
};

Game.InsertTemplate = function(gameObj){
	return Game.insert(gameObj);
};

Game.SaveUpdate = function(game){
	Game.update(game._id, { $set : {
			players : game.players,
			holes : game.holes
		}
	});
}

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

	Game.SaveUpdate(game);


};

Game.RemovePlayer = function(gameId, playerId){
	var game = Game.findOne(gameId),
		currentUserId =  Meteor.userId();

	if(game.createdBy === currentUserId || playerId === currentUserId){

		game.players.forEach(function(el, ix, players){
			if(el.id === playerId){
				players.splice(ix, 1);
			}
		});

		game.holes.forEach(function(hole){
			hole.players.forEach(function(holePlayer, ix, holePlayers){
				if(holePlayer.id === playerId){
					holePlayers.splice(ix, 1);
				}
			});
		});

		Game.SaveUpdate(game);

	} else {
		return false;
	}
};

Game.UpdateUserScore = function(game, playerId){
	var player,
		totalPar = 0;

	game.players.some(function(p){
		if(p.id === playerId){
			player = p;
			return true;
		}
	});

	if(player){
		player.strokes = 0;

		game.holes.forEach(function(hole){
			hole.players.some(function(hp){
				if(hp.id === playerId && hp.score){
					player.strokes += hp.score;
					totalPar += hole.par;
					return true;
				}
			});
		});

		player.score = player.strokes - totalPar;

		Game.SaveUpdate(game);

	}
};
