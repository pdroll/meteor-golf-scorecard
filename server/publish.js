Meteor.publish("games", function () {

	//
	// Only publish a game to a user if they
	// created the game OR are a player in the game
	return Game.find({
		$or: [
			{createdBy : this.userId},
			{players : {$elemMatch : {id: this.userId }}}
		]
	});
});

Meteor.publish("users", function () {
	return User.find();
});

Meteor.publish("courses", function () {
	return Course.find();
});

User.allow({

	//
	// Don't allow updates to user other than scores
	update : function(userId, document, fieldNames, modifier){
		console.log('UPDATE USER');
		console.log(fieldNames);

		if(fieldNames.length === 1 && fieldNames[0] === 'scores'){
			return true;
		}

		return false;
	}
});


Game.allow({

	//
	// Allow Inserts only from logged in users
	insert : function(userId, document){

		if(!userId){
			return false;
		}

		if(document.players && document.holes && document.created && document.createdBy){
			return true;
		}

		return false;
	},

	//
	// Only Allow Creators to remove Games
	remove : function(userId, document){

		return userId === document.createdBy;

	},

	//
	// Protect certain fields, and only let players or creators update a game
	update: function (userId, document, fieldNames, modifier) {


		//
		// Only allow updates to active games
		if(document.completed){
			return false;
		}


		//
		// Protected  Fields
		var protectedField = false;
		['createdBy', '_id', 'created'].forEach(function(el){

			if( fieldNames.indexOf(el) >= 0){
				protectedField = true;
			}
		});

		if(protectedField){
			return false;
		}

		//
		// Only allow updates from creator or game players
		if(userId === document.createdBy){
			return true;
		}
		var playerIds = [];
		document.players.forEach(function(el){
			if(el._id){
				playerIds.push(el._id);
			}
		});

		if(playerIds.indexOf(userId) >= 0){
			return true;
		}

		return false;
	}
});

Course.allow({
	//
	// Allow Inserts only from logged in users
	insert : function(userId, document){

		if(!userId){
			return false;
		}

		if(document.name && document.holes){
			return true;
		}

		return false;
	},

	//
	// Allow Updates only from logged in users
	update: function (userId, document, fieldNames, modifier) {
		if(!userId){
			return false;
		}

		if(document.name && document.holes){
			return true;
		}

		return false;
	}
});
