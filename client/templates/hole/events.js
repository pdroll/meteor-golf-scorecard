Template.Hole.events({

	//
	// Increase or Decrease Player's score
	'click .js-change-score' : function(e){
		var $btn = $(e.target);

		if(!$btn.is('.js-change-score')){
			$btn = $btn.closest('.js-change-score');
		}

		var	$input = $btn.closest('.js-hole-score-control').find('.js-hole-score'),
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
			Game.UpdateAllScores(game);
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

	'click #finish-game' : Game.FinishGamePrompt,

	'click .js-set-hole-location' : function(e, template){
		e.preventDefault();
		var templateData = Template.instance().data,
			hole = templateData.hole,
			game = templateData.game,
			$section = $(template.find('.hole-location'));

		$section.addClass('loading');

		getCurrentLocation(function(position){
			if(position.coords){
				hole.lat = position.coords.latitude;
				hole.lng = position.coords.longitude;
				// Convert accuracy from meters to feet
				hole.accuracy = (position.coords.accuracy * 3.28084);

				Game.SaveUpdate(game);
				$section.removeClass('loading');
			}
		});
	},

	'click .js-distance-to-hole' : function(e, template){
		e.preventDefault();
		var templateData = Template.instance().data,
			hole = templateData.hole,
			$btn = $(template.find('.js-distance-to-hole'));

		if(!$btn.is('.loading')){
			$btn.addClass('loading');

			if(hole.lat && hole.lng){
				getCurrentLocation(function(position){
					var distance = distanceBetweenPoints(position.coords.latitude, position.coords.longitude, hole.lat, hole.lng),
						currentAccuracy = (position.coords.accuracy * 3.28084),
						totalAccuracy  = currentAccuracy + hole.accuracy,
						message = '';

					message += "Current Distance to hole\n";
					message += "------------------------\n\n";
					message += Math.ceil(distance) + " Feet\n\n";
					message += 'Accurate within ' + Math.ceil(totalAccuracy) + ' feet.';
					alert(message);

					$btn.removeClass('loading');
				});
			}
		}
	}
});
