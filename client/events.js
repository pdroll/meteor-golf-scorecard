var finishGame = function(e, template){
	e.preventDefault();
	if(confirm('Are you sure you want to finish this game? You will not be able to edit any scores after you do this.')){
		var game = Template.instance().data.game;
		Game.FinishGame(game);
	}
}


Template.Dashboard.events({

	'click .js-close-alert' : function(e){
		e.preventDefault();
		var alertDiv = e.target.parentNode;
		alertDiv.parentNode.removeChild(alertDiv);
	}

});

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
				course = Course.findOne(existingCourse);
				holes = course.holes;

				holes.forEach(function(h){
					Hole.AddUsers(h, users);
				});

				courseName = course.name;

			} else if(newCourse) {
				courseName = $('#newcourse').val();

				for (var i = 0; i < numberholes; ++i) {
					holes.push(Hole.CreateNew(users, (i + 1)));
				}

			}

			gameTemplate = Game.CreateNew(users,holes,courseName);

			var newGameId = Game.InsertTemplate(gameTemplate);

			window.location.href = '/game/' + newGameId;

		} else {
			alert('Please select at least one player.');
		}
	},

	'change #existingcourse' : function(e){
		var $select = $(e.target),
			val = $select.val(),
			$newcourse = $('#newcourse'),
			$newCourseHoles = $('#newcourse-holes');

		if(val) {
			$newcourse.val('');
			$newCourseHoles.hide();

		}
	},

	'change #newcourse': function(e){
		var $select = $(e.target),
			val = $select.val(),
			$existingcourse = $('#existingcourse'),
			$newCourseHoles = $('#newcourse-holes');

		if(val) {
			$existingcourse.val('');
			$newCourseHoles.show();
		}
	}
});


Template.GameDashboard.events({

	//
	// Toggle Add player form

	'click #addplayertogame' : function(e, template){
		var section = template.find('#addplayersform');

		if(section.getAttribute('data-ui-open')){
			section.removeAttribute('data-ui-open');
		} else {
			section.setAttribute('data-ui-open', true);
		}
	},

	//
	// Add Users to Existing Games
	'change #addplayerstogame' : function(e, template){
		var game = Template.instance().data.game,
			$select = $('#addplayerstogame'),
			newUser = User.findOne($select.val());

		Game.AddPlayer(game, newUser);
		$select.val('');
	},

	//
	// Add one time player to game
	'submit #add-one-time-player' : function(e,template){
		e.preventDefault();

		var game = Template.instance().data.game,
			$input = $('#onetimeplayers'),
			playerName = $input.val();

		if(playerName){
			Game.AddPlayer(game, playerName);
			$input.val('');
		}
	},


	//
	// Remove any player from game
	'click .removePlayerFromGame' : function(e){
		e.preventDefault();
		if(confirm('Are you sure you want to remove ' + this.name + ' from the game? Their scores will not be able to be recovered.')){
			var game = Template.instance().data.game;
			Game.RemovePlayer(game, this.id);
		}
	},

	// Finish Game
	'click #finish-game' : finishGame
});

Template.Hole.events({

	//
	// Increase or Decrease Player's score
	'click .js-change-score' : function(e){
		var $btn = $(e.target),
			$input = $btn.closest('.js-hole-score-control').find('.js-hole-score'),
			currentScore = parseInt($input.val(), 10),
			newScore;

		if(!currentScore) {
			newScore = parseInt($('#hole-par').val(), 10);
		} else {
			if($btn.is('.js-decrease')){
				newScore = (currentScore <= 1) ?  1 :  (currentScore - 1);
			} else {
				newScore = currentScore + 1;
			}
		}

		if(newScore !== currentScore){
			$input.val(newScore).trigger('blur');
		}
	},

	//
	// Save Player Score Update
	'blur .js-hole-score' : function(e){
		var $input = $(e.target),
			val = parseInt($input.val(), 10);

		if(val){
			var game = Template.instance().data.game;
			this.score = val;

			Game.SaveUserScore(game,this.id);

			$input.val(val);
		} else {
			$input.val('');
		}

	},

	//
	// Edit a hole's Par
	'click #edit-par' : function(e, template){
		e.preventDefault();
		$('#hole-par').removeAttr('disabled').focus();
		$('#edit-par').hide();
	},


	//
	// Save a change to a hole's par
	'blur #hole-par' : function(e, template){
		var templateData = Template.instance().data,
			hole = templateData.hole,
			game = templateData.game,
			$input = $('#hole-par'),
			newPar = parseInt($input.val(), 10);

		if(newPar && newPar > 1 && newPar !== hole.par) {
			hole.par = newPar;
			Game.UpdateAllScores(game)
			Game.SaveUpdate(game);

		} else {
			$input.val(hole.par);
		}

		$input.attr('disabled', 'disabled');
		$('#edit-par').show();
	},

	//
	// Edit a Hole's Notes
	'click #edit-hole-notes' : function(e, template){
		e.preventDefault();
		$('#hole-notes').removeAttr('disabled').focus();
		$('#edit-hole-notes').hide();
	},

	//
	// Save Update to a hole's notes
	'blur #hole-notes' : function(e, template){
		var templateData = Template.instance().data,
			hole = templateData.hole,
			game = templateData.game,
			newNotes = $('#hole-notes').val();

		if(newNotes !== hole.notes){
			hole.notes = newNotes;
			Game.SaveUpdate(game);
		}

		$('#hole-notes').attr('disabled', 'disabled');
		$('#edit-hole-notes').show();
	},

	'click #finish-game' : finishGame
});
