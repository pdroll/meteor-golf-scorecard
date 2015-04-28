Template.gameListItem.helpers({

	timeAgo : function(){
		return moment(this.created).fromNow();
	}
});

Template.GameDashboard.helpers({

	canDeletePlayer : function(){

		var game = Template.instance().data.game,
			currentUserId = Meteor.userId();

		if(currentUserId === game.createdBy || this._id === currentUserId){
			return true;
		} else {
			return false;
		}

	},

	creatorName : function(){
		var game = Template.instance().data.game,
			creator =  User.findOne(game.createdBy);

		if(creator){
			return creator.username;
		} else {
			return null;
		}
	},

	formattedTime : function(dateStr){
		return moment(dateStr).format('llll');
	}
});
