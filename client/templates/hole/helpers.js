Template.Hole.helpers({

	playerName : function(player){
		var game = Template.instance().data.game,
			name = '';

		game.players.forEach(function(el){
			if(el.id === player.id){
				name = el.name;
				return;
			}
		});

		return name;
	},

	accuracy : function(val){

		return Math.ceil(val);

	}
});
