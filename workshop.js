var request = require('request-promise');

// Euclidian distance between two points
function getDistance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos1.lat - pos2.lat, 2) + Math.pow(pos1.lng - pos2.lng, 2));
}

function getIssPosition() {
    return request('http://api.open-notify.org/iss-now.json')
        .then(
            function(response) {
                var data = JSON.parse(response);
                
                var newOutput = {"lat":data.iss_position.latitude, "lng":data.iss_position.longitude};
                
                return newOutput;
            }
        );
}

function getAddressPosition(address) {
    return request('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
    .then(function(response) {
        var data = JSON.parse(response);
        
        return data.results[0].geometry.location;
    });
}

function getCurrentTemperatureAtPosition(position) {
    return request('https://api.darksky.net/forecast/e1f4da53d6f0d0889607627a1fe13360/position')
    .then(function(response) {
        var data = JSON.parse(response);
        
        return data.currently.temperature;
    })

}

function getCurrentTemperature(address) {
    return getAddressPosition(address) // gets the lat and lng from the address
    .then(function(pos) { // returns the position as pos
        return getCurrentTemperatureAtPosition(pos); // gets the temperature at the lat and lng in pos
    });
}



function getDistanceFromIss(address) {
    var issPos;
    
    var p1 = getIssPosition();
    var p2 = getAddressPosition(address);
    
    Promise.all([p1, p2]).then(values => {
        return getDistance(values);
    });
}

exports.getIssPosition = getIssPosition;
exports.getAddressPosition = getAddressPosition;
exports.getCurrentTemperatureAtPosition = getCurrentTemperatureAtPosition;
exports.getCurrentTemperature = getCurrentTemperature;
exports.getDistanceFromIss = getDistanceFromIss;