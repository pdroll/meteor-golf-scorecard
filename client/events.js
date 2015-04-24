//
// Dashboard Events
Template.CreateGame.events({

	//
	// Create new Game
	'click #creategame': function (e) {

		// Get Input
		var playerIds =$('#players').val(),
			numberholes = parseInt($('input[name="numberholes"]:checked').val(), 10),
			existingCourse = $('#existingcourse').val(),
			courseName = 'New Course',
			users = [],
			holes = [],
			gameTemplate;

		if(playerIds && playerIds.length){
			playerIds.forEach(function(el, ix){
				users.push(User.findOne(el));
			});

			if(existingCourse){
				// @todo Handle Existing Course
			} else {
				courseName = $('#newcourse').val();

			}

			for (var i = 0; i < numberholes; ++i) {
				holes.push(Hole.CreateNew(users));
			}

			gameTemplate = Game.CreateNew(users,holes,courseName);

			var newGame = Meteor.call('InsertGame', gameTemplate);
			console.log(newGame);


		} else {
			alert('Please select at least one player.');
		}
	}
});
