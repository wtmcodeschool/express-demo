var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var gifs = [{
    keyword: 'funny cat',
    url: 'http://.....',
    description: "A funny cat on the beach."
},
{
    keyword: 'bear',
    url: 'http://.....',
    description: "A bear in the bitterroot that is very friendly."
},
]

var app = express();

app.use(bodyParser.json())
app.use(morgan('dev'));

app.use(function(req, res, next){
    req.veryImportantInformation = 'Super crucial to the request';
    next();
})

app.get('/v1/gifs/search', function(req, res){
    var query = req.query.q;
    res.json(gifs.filter(function(gif){
        return gif.keyword === query;
    }));
})


app.post('/v1/gifs', function(req, res){
    gifs.push(req.body.gif);
    return res.json({
        success: true,
        gif: req.body.gif,
        totalGifs: gifs.length
    });
});

app.get('*', function(req, res){
    res.send('<html><head></head><body><h1>404 page not found: ' + req.url +'</h1>' +req.veryImportantInformation + '</body></html>');
    res.end();
})

app.listen(3000);