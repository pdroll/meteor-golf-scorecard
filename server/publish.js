Meteor.publish("games", function () {
	return Game.find();
});

Meteor.publish("users", function () {
	return User.find();
});

Meteor.publish("courses", function () {
	return Course.find();
});