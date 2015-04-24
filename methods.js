Meteor.methods({
	InsertGame : function(gameObj){
		if (! Meteor.userId()) {
	      throw new Meteor.Error("not-authorized");
	    }

		return Game.insert(gameObj);
	}
});
