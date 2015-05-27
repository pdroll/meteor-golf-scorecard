Template.Hole.helpers({

	playerName : function(player){
		var game = Template.instance().data.game;

		return Game.GetPlayerName(game, player);
	},

	accuracy : function(val){

		return Math.ceil(val);

	}
});
