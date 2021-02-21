function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// The following are intended to interpret the maps API journey length
// \/\/\/                 and distance fields                   \/\/\/

// Returns distance in miles
function parseDistance(distance) {
    return parseFloat(distance.replace(/[ A-Za-z,]/g, ""));
}

// Returns time in hours
function parseTime(time) {
    let tokens = time.split(" ");
    tokens = tokens.filter(token => token.length && token == +token);

    if (tokens.length == 1) {
        return tokens[0];
    }

    return tokens[0] + (tokens[1] / 60);
}
