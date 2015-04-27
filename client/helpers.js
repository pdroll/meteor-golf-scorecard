Template.gameListItem.helpers({

	timeAgo : function(){
		return moment(this.created).fromNow();
	}
});
