Template.gameListItem.helpers({

	timeAgo : function(){
		return moment(this.created).fromNow();
	},

	finishedTime :  function(){
		return moment(this.completed).calendar();
	}

});
