Hole = {
	CreateNew : function(users, ix){

		var players = [];

		users.forEach(function(el,ix){
    			players.push({
				id : el.id,
				score : null
			});
		});

		return {
			number: ix,
			lat: null,
			lng: null,
			accuracy: null,
			notes : '',
			par : 3,
			players : players
		};
	},

	AddUsers : function(hole,users){

		users.forEach(function(el){
    			hole.players.push({
				id : el.id,
				score : null
			});
		});

	}
};


