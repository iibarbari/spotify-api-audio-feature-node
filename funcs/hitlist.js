// import the npm module as a class constructor
const BillboardCrawler = require('billboard-crawler'),
    fs = require('fs');

// new it up
const billboard = new BillboardCrawler();

billboard.getYearEndChart('Hot 100 Songs', 2018)
    .then(response => {
        var list = [];
        response.entries.forEach(element => {
            var obj = {
                name: element.title,
                rank: element.rank,
                artist: element.artistNames[0],
                year: response.year
            };
            list.push(obj);
        });
        fs.writeFile(`${__dirname}/endYear/${response.year}.json`, `${JSON.stringify(list)}\n`, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("End year list gained");
        });
    })
    .catch(err => console.log(err));