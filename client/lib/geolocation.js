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

distanceBetweenPoints = function(lat1, lon1, lat2, lon2) {
	if(lat1 && lon1 && lat2 && lon2){
		var radlat1 = Math.PI * lat1/180,
			radlat2 = Math.PI * lat2/180,
			radlon1 = Math.PI * lon1/180,
			radlon2 = Math.PI * lon2/180,
			theta = lon1-lon2,
			radtheta = Math.PI * theta/180,
			dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515 * 5280;
		return dist;
	}
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
