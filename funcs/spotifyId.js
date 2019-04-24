const SpotifyWebApi = require('spotify-web-api-node'),
    path = require('path'),
    fs = require('fs'),
    keys = require('../config/keys');

var spotifyApi = new SpotifyWebApi({
    clientId: keys.client_id,
    clientSecret: keys.client_secret,
    redirectUri: keys.redirect_url
});

var year = 2018;
var jsonPath = path.join(__dirname, 'endYear', `${year}.json`);

var prom = [];

fs.readFile(jsonPath, (err, result) => {
    if (err) throw err;
    hitsongs = JSON.parse(result);

    spotifyApi
        .clientCredentialsGrant()
        .then(data => {
            spotifyApi.setAccessToken(data.body.access_token);
        }).then(() => {

            for (let i = 0; i < 100; i++) {
                var name = `${(hitsongs[i]|| '').artist.replace(/'/g,'') || ''}`;
                var track = `${(hitsongs[i] || '').name.replace(/'/g,'') || ''}`;
                var query = '';
                name.length + track.length > 30 ? query = track : query = `${name} ${track}`;
                prom.push(
                    spotifyApi.searchTracks(`${query}`)
                );
            }
            return prom;
        }).then((prom => {
            Promise.all(prom)
                .then(function(values) {
                    values.forEach((elem, i) => {
                        var obj = {
                            spotifyName: ((elem.body.tracks.items[0] || '').name) || '',
                            album: ((((elem.body.tracks || '').items || '')[0] || '').album || '').name || '',
                            id: ((elem.body.tracks || '').items || '')[0].id || '',
                            preview: ((elem.body.tracks || '').items || '')[0].preview_url || '',
                            album_artwork: ((elem.body.tracks || '').items || '')[0].album.images[0].url || '',
                        };
                        hitsongs[i].spotify = obj;
                        fs.writeFileSync(jsonPath, `${JSON.stringify(hitsongs)}`);
                    });

                })
                .catch(err => console.log(err));
        }))
        .catch(err => console.log(err));
});