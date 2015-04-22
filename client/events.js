//
// Dashboard Events
Template.Dashboard.events({

	//
	// Create new Game
	'click #createGame': function (e) {

		Games.insert({

			isCompleted : false,
			isFavorite : false,
			created : (new Date),
			createdFormatted : moment().format('MM/D/YY h:mm a'),
			course : null,
			users : [
				{
					name : 'Pete',
					score : -1,
					strokes : 13
				}
			],
			holes : [
				{
					par : 3,
					users : [
						{
							userIndex : 0,
							score : 3
						}
					]
				}
			]

		}, function(err, gameId){
			if(err){
				console.log('ERROR : ' + err);
			}
			if(gameId){
				console.log('Success : ' + gameId);
			}
		});


	}
});
