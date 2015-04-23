Course = new Meteor.Collection('Courses');

Course.CreateNew = function(name, holes){
	return {
		name : '',
		holes: holes
	};
};
