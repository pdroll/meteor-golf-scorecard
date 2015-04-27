Hole = {
	CreateNew : function(users){

		var players = [];

		users.forEach(function(el,ix){
    			players.push({
				id : el.id,
				score : null
			});
		});

		return {
			lat: null,
			lng: null,
			notes : '',
			par : 3,
			players : players
		}
	}
};
