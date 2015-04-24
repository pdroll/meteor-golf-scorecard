//
// Dashboard Events
Template.CreateGame.events({

	//
	// Create new Game
	'click #creategame': function (e, template) {

		// Get Input
		var playerIds = $('#players').val(),
			numberholes = parseInt($('input[name="numberholes"]:checked').val(), 10),
			existingCourse = $('#existingcourse').val(),
			newCourse = $('#newcourse').val(),
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
			} else if(newCourse) {
				courseName = $('#newcourse').val();

			}

			for (var i = 0; i < numberholes; ++i) {
				holes.push(Hole.CreateNew(users));
			}

			gameTemplate = Game.CreateNew(users,holes,courseName);

			var newGame = Meteor.call('InsertGame', gameTemplate, function(err, gameId){
				if(err){
					console.log('Error with InsertGame');
					console.log(err)
				}

				window.location.href = '/game/' + gameId;
			});

		} else {
			alert('Please select at least one player.');
		}
	}
});
