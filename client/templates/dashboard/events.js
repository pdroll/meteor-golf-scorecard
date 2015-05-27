Template.Dashboard.events({

	'click .js-close-alert' : function(e){
		e.preventDefault();
		var alertDiv = e.target.parentNode;
		alertDiv.parentNode.removeChild(alertDiv);
	}

});
