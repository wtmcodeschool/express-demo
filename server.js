var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var uriUtil = require('mongodb-uri');
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/giff';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
mongoose.connect(mongooseUri, options);
var Giff = require('./models/giff');

// var gifs = [{
//     keyword: 'funny cat',
//     url: 'http://.....',
//     description: "A funny cat on the beach."
// },
// {
//     keyword: 'bear',
//     url: 'http://.....',
//     description: "A bear in the bitterroot that is very friendly."
// },
// ]

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.set('view engine', 'ejs');
// redirect(app);

app.get('/', function(req, res){
  Giff.find(function(error, Giff){
    if(error){
      next(error);
    } else {
      res.render('index',{gifs: ""});
    }
  })
});

app.get('/v1/gifs/delete', function(req, res){
  var query = req.query.q;
  Giff.findByIdAndRemove(query, function(err, response){
        if(err) res.json({message: "Error in deleting record id " + query});
        else res.json({message: "Image with id " + query + " removed."});
    });
});

app.get('/v1/gifs/search', function(req, res){
    var query = req.query.q;
    Giff.find({ 'keyword': query },function(err, results){
      if(err){
        return next(err);
      } else {
        res.render('index',{gifs: results});
        // req.method = 'get';
        // res.redirect('/');
        // res.json(results);
      }
    })
    // res.json(gifs.filter(function(gif){
    //     return gif.keyword === query;
    // }));
});


app.post('/v1/gifs', function(req, res){
    var giff = new Giff();
    giff.keyword = req.body.keyword;
    giff.url = req.body.url;
    giff.description = req.body.description;
    giff.save(function(err, giff){
      if(err){
        res.send(err);
      } else {
        console.log(giff);
        res.render('index',{gifs: [giff]});
      }
    })
    // gifs.push(req.body.gif);
    // return res.json({
    //     success: true,
    //     gif: req.body.gif,
    //     totalGifs: gifs.length
    // });
});

// app.get('*', function(req, res){
//     res.send('<html><head></head><body><h1>404 page not found: ' + req.url +'</h1>' +req.veryImportantInformation + '</body></html>');
//     res.end();
// })

var port = process.env.PORT || 3000;

app.listen(port, function(req, res){
  console.log('listening on this port: ' + port);
});
