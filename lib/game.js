Game = new Meteor.Collection('Games');

Game.CreateNew = function(users, holes, courseName){
	var usersArr = [];

	users.forEach(function(el, ix){
		usersArr.push({
			name : el.username,
			score : 0,
			strokes : 0
		});
	});

	return {
		isCompleted : false,
		isFavorite : false,
		created : (new Date),
		createdFormatted : moment().format('MM/D/YY h:mm a'),
		course : courseName,
		users : usersArr,
		holes : holes
	}
};
