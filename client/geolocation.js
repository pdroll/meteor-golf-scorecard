//
// Global function to geolocate user
//
// Example Usage:
//
// getCurrentLocation(function(position){
//		console.log(position);
// });

getCurrentLocation = function(callback){
	if ("geolocation" in navigator) {
		geolocate(callback);
		return 'Fetching position...';
	}
	return false;
}

var geolocate = function(callback){
	navigator.geolocation.getCurrentPosition(
		// Success
		function(position){
			if(callback){
				callback(position);
			} else {
				console.log(position);
			}
		},

		// Error
		function(error){
			if(error.code && error.code !== 1) {
				// Try, try again
				geolocate(callback);
			}
		},

		// Options
		{
		  enableHighAccuracy: true,
		  timeout           : 27000
		}
	);
};
