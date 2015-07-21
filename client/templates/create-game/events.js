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
			course,
			users = [],
			holes = [],
			gameTemplate;


		if((playerIds && playerIds.length ) && (newCourse.length || existingCourse.length)){
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

				for (var i = 0; i < numberholes; ++i) {
					holes.push(Hole.CreateNew(users, (i + 1)));
				}
				// Create and Save New Course
				course = Course.CreateNew(newCourse, holes);
				Course.SaveCourse(course);

			}

			gameTemplate = Game.CreateNew(users,holes,course);

			var newGameId = Game.InsertTemplate(gameTemplate);

			window.location.href = '/game/' + newGameId;

		} else {

			var str = '';
			if(!playerIds || !playerIds.length){
				str += 'Please select at least one player.';
			}

			if(!newCourse.length && !existingCourse.length){
				str += ' Please select a course or enter the name of a new course.';
			}

			alert(str);
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
