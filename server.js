var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

const ROOT = "./public";

app.set('port', (process.env.PORT || 5000));

app.set('views', './views');
app.set('view engine', 'pug');

app.use(function(req, res, next){
    // console.log(req.method+ " request for "+ req.url);
    next();
});

app.get("/", function(req,res){
    res.render("index");
});

app.use(express.static(ROOT));

app.all("*", function(req,res){
    res.sendStatus(404);
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
