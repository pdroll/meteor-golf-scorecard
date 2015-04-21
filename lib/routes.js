Router.route('/', function () {
	this.render('Dashboard', {
		data: function () {
			return {title: 'Dashboard'}
		}
	});
});


Router.route('games', function () {
	this.render('Games', {
		data: function () {
			return {title: 'Or start a new game.'}
		}
	});
});


