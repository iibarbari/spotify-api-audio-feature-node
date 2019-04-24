const express = require('express'),
    port = process.env.PORT || 5555,
    keys = require('./config/keys'),
    bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//Routes
const endYear = require('./routes/endYear');
app.use(endYear);


app.get('/login', function(req, res) {
    var scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + keys.spotify_client_id +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent('http://localhost:5555/spoty'));
});

app.get('/spoty', (req, res) => {
    console.log(req.params);
    res.json({ success: true });
});



app.listen(port, () => console.log(`Server runs on ${port}`));