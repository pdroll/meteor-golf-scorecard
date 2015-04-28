//
// Dashboard Events
Template.CreateGame.events({


	'submit #add-one-time-player' : function(e, template){
		e.preventDefault();
		var $input = $('#onetimeplayers'),
			$playersSelect = $('#players'),
			$oneTimeGroup = $('#oneTimeGroup'),
			name = $input.val();

		if(name){
			if(!$oneTimeGroup.length){
				$oneTimeGroup = $('<optgroup id="oneTimeGroup" label="One Time Players">').appendTo($playersSelect);
			}

			$oneTimeGroup.append('<option value="' + name + '" selected>' + name + '</option>');

			$input.val('');
		}

	},

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
				var u = User.findOne(el);

				if(u){
					users.push({
						name : u.username,
						_id  : u. _id,
						id   : u. _id
					});
				} else {
					// Random ID for one-time players
					users.push({
						name : el,
						id : Math.random().toString(36).substring(7)
					});
				}
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

			var newGameId = Game.InsertTemplate(gameTemplate);

			window.location.href = '/game/' + newGameId;

		} else {
			alert('Please select at least one player.');
		}
	},
});


Template.GameDashboard.events({

	//
	// Add Users to Existing Games
	'change #addplayerstogame' : function(e, template){
		var $select = $('#addplayerstogame'),
			newUser = User.findOne($select.val());

		Game.AddPlayer($('#gameid').val(), newUser);
		$select.val('');
	},

	'submit #add-one-time-player' : function(e,template){
		e.preventDefault();

		var $input = $('#onetimeplayers'),
			playerName = $input.val();

		if(playerName){
			Game.AddPlayer($('#gameid').val(), playerName);
			$input.val('');
		}
	},

	'click .removePlayerFromGame' : function(e){
		e.preventDefault();
		Game.RemovePlayer($('#gameid').val(), this.id);
	}
});
