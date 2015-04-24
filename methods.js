Meteor.methods({
	InsertGame : function(gameObj){
		var newGame = Game.insert(gameObj);

		console.log(newGame);
	}
});
