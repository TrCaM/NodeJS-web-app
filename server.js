var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
const ROOT = "./public";

app.set('port', (process.env.PORT || 5000));

app.set('views', './views');
app.set('view engine', 'pug');

//Connect to MongoDB server
MongoClient.connect("mongodb://Tri:1234@ds155490.mlab.com:55490/tricao", function(err, database){
    if(err){
        console.log('FAILED TO CONNECT TO DATABASE');
        throw error;
    }else{
        console.log('CONNECTED TO DATABASE');
        db = database;
        app.listen(app.get('port'), function() {
          console.log('Node app is running on port', app.get('port'));
        });
    }
});
// Basic routes
app.get("/", function(req,res){
    res.render("index");
});

app.use("/feedback", bodyParser.urlencoded({extended:false}));

app.post("/feedback", function(req,res){
    console.log("New feedback!");
    var feedback = req.body;
    var collection = db.collection("feedbacks");
    var fb = {};
    fb.name = feedback.name;
    fb.email = feedback.email;
    fb.message = feedback.message;
    collection.insertOne(fb, function(err){
        if (err) res.sendStatus(500);
        else res.send({name: fb.name});
    });
});

app.use(express.static(ROOT));

app.all("*", function(req,res){
    res.sendStatus(404);
});

// Chat routes
