Hole = {
	CreateNew : function(users){

		var players = [];

		users.forEach(function(el, ix){
			players.push({
				UserIndex : ix,
				Score : null
			});
		});

		return {
			par : 3,
			notes : '',
			users : players
		}
	}
};
