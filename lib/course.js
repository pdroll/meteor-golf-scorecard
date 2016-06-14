Course = new Meteor.Collection('Courses');

Course.CreateNew = function(name, holes){
	return {
		name : name,
		holes: holes
	};
};

Course.SaveCourse = function(course, callback){
	console.log(course, callback);
	if(course._id){

		Course.update(course._id, { $set : {
			holes : course.holes
		}}, function() {
			if(callback){
				callback();
			}
		});

	} else {

		var newCourse = Course.insert(course, function() {
			if(callback){
				callback();
			}
		});

	}
};
