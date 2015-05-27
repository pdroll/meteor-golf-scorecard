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
	'click #finish-game' : Game.FinishGamePrompt,

	'click .viewToggle' : function(e){
		e.preventDefault();

		var currentView = Session.get('scorecardView');

		if(!currentView || currentView !== 'classic') {
			Session.set('scorecardView', 'classic');
		} else {
			Session.set('scorecardView', 'grid');
		}

	}
});
