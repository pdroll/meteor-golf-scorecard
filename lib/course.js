Course = new Meteor.Collection('Courses');

Course.CreateNew = function(name, holes){
	return {
		name : name,
		holes: holes
	};
};

Course.SaveCourse = function(course){

	if(course._id){

		Course.update(course._id, { $set : {
			holes : course.holes
		}});

	} else {

		var newCourse = Course.insert(course);

	}
};
