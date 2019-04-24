var express = require("express"),
    fs = require('fs'),
    path = require('path'),
    router = express.Router();

//Year Base Data Pages
router.get('/year/:year', (req, res) => {
    var year = `${req.params.year >= 2008 && req.params.year <= 2018 ? req.params.year: 2008}`;
    var jsonPath = path.join(__dirname, '..', 'lists', `${year}.json`);
    fs.readFile(jsonPath, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        
        res.render('index', {data:data});
    });
});

module.exports = router;


