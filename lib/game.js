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

Game.AddPlayer = function(game, user){
	var player = {
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

Game.RemovePlayer = function(game, playerId){
	var currentUserId =  Meteor.userId();

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

Game.SaveUserScore = function(game, playerId){
	var player;

	game.players.some(function(p){
		if(p.id === playerId){
			player = p;
			return true;
		}
	});

	if(player){
		Game.UpdateScoreForUser(game, player);
	}


	Game.SaveUpdate(game);
};

Game.UpdateAllScores = function(game){

	game.players.forEach(function(p){
		Game.UpdateScoreForUser(game, p);
	});

};

Game.UpdateScoreForUser = function(game, player){
	var totalPar = 0;
	player.strokes = 0;

	game.holes.forEach(function(hole){
		hole.players.some(function(hp){
			if(hp.id === player.id && hp.score){
				player.strokes += hp.score;
				totalPar += hole.par;
				return true;
			}
		});
	});

	player.score = player.strokes - totalPar;
};


Game.FinishGame = function(game){
	// Finalize Scores
	Game.UpdateAllScores(game);

	// Save final scores to Users
	game.players.forEach(function(p){
		if(p._id){
			var user = User.findOne(p._id);
			if(!user.scores){
				user.scores = [];
			}

			gameScore = {};
			gameScore[game._id] = p.score;

			user.scores.push(gameScore);

			User.update(user._id, { $set : {
					scores : user.scores
				}
			});
		}
	});

	// Save Course
	var holes = [];

	game.holes.forEach(function(h){
		var hole = Hole.CreateNew([], h.number);
		hole.par = h.par;
		hole.notes = h.notes;
		hole.lat = h.lat;
		hole.lng = h.lng;
		hole.accuracy = h.accuracy;
		holes.push(hole);
	});

	var existingCourse = Course.findOne({name : game.course});

	if(existingCourse){
		existingCourse.holes = holes;
		Course.SaveCourse(existingCourse);
	} else {
		var newCourse = Course.CreateNew(game.course, holes);
		Course.SaveCourse(newCourse);
	}


	// Mark game as complete & Save
	Game.update(game._id, { $set : {
			players : game.players,
			holes : game.holes,
			completed : (new Date)
		}
	});

	// Redirect to Game Dashboard
	window.location ='/game/' + game._id;
};

Game.SortPlayers = function(game){

	game.players.sort(function(a,b){
		var aName = a.name.toLowerCase(),
			bName = b.name.toLowerCase();

		if(aName < bName) { return -1; }
		if(aName > bName) { return 1; }
		return 0;
	});

	game.holes.forEach(function(hole){
		hole.players.sort(function(y,z){
			var yName = Game.GetPlayerName(game, y).toLowerCase(),
				zName = Game.GetPlayerName(game, z).toLowerCase();

			if(yName < zName) { return -1; }
			if(yName > zName) { return 1; }
			return 0;
		});
	});

	return game;
};

Game.GetPlayerName = function(game, player){
	var name = '';
	game.players.forEach(function(el){
		if(el.id === player.id){
			name = el.name;
			return;
		}
	});

	return name;
};

Game.FinishGamePrompt = function(e, template){
	e.preventDefault();
	if(confirm('Are you sure you want to finish this game? You will not be able to edit any scores after you do this.')){
		var game = Template.instance().data.game;
		Game.FinishGame(game);
	}
};
