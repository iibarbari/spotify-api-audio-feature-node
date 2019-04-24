var Spotify = require('node-spotify-api'),
    path = require('path'),
    fs = require('fs'),
    keys = require('../config/keys');

var spotify = new Spotify({
    id: keys.client_id,
    secret: keys.client_secret
});

var year = 2010;
var jsonPath = path.join(__dirname, '..', 'lists', `${year}.json`);
var jsonPath2 = path.join(__dirname, '..', 'lists', `deneme.json`);
var searchIds = [];

fs.readFile(jsonPath, (err, result) => {
    if (err) throw err;
    hitsongs = JSON.parse(result);
    for (elem in hitsongs) {
        searchIds.push(hitsongs[elem].spotify.id || '');
    }
    var promises = searchIds.map(function(id) {
        spotify
            .request(`https://api.spotify.com/v1/audio-features/${id}`)
            .then(function(data) {
                var obj = {
                    danceability: data.danceability || '',
                    energy: data.energy || '',
                    key: data.key || '',
                    loudness: data.loudness || '',
                    mode: data.mode || '',
                    speechiness: data.speechiness || '',
                    acousticness: data.acousticness || '',
                    instrumentalness: data.instrumentalness || '',
                    tempo: data.tempo || '',
                    time_signature: data.time_signature || '',
                };
                hitsongs[searchIds.indexOf(id)].analyze = obj;
                fs.writeFileSync(jsonPath, `${JSON.stringify(hitsongs)}`);
            })
            .catch(function(err) {
                console.error('Error occurred: ' + err);
            });
    });
    Promise.all(promises).then(() =>
        console.log('done')
    );
});