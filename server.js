var express = require('express');
var app = express();
var hat = require('hat');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
const ROOT = "./public";

app.set('port', (process.env.PORT || 5000));

app.set('views', './views');
app.set('view engine', 'pug');

app.use(function(req,res,next){
	console.log(req.method+" request for "+req.url);
	next();
});
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
app.get(['/', '/index.html', '/home', '/index'], cookieParser(), function(req,res){
    db.collection("users").findOne({username:req.cookies.username},function(err,user){ //assume unique usernames.
        if(user && user.auth===req.cookies.token){
            console.log("User authenticated.");
            res.render('index',{user: {username:req.cookies.username, auth:user.auth}});
        }else{
            res.render('index',{});
        }
    });
});

app.use(["/feedback", '/login'], bodyParser.urlencoded({extended:false}));

//handle user login
app.post('/login', function(req,res){
	//console.log(req.body);  //uncomment to see the login data object

	db.collection("users").findOne({username:req.body.username},function(err,user){
		console.log("user found: ",user);
		if(err){
			console.log("Error performing find : ", err);
			res.sendStatus(500);
		}else if(!user){ //not found
			res.render('index',{warning:"Username not found"});
		}else if(user.password!==req.body.password){  //user exists, wrong password
			console.log("incorrect password: ", user.password+"!="+req.body.password);
			res.render('index',{warning:"Incorrect password"});
		}else{	//user exists && pwd correct
			console.log("Log in successful");
			//create auth token
			var token = hat(); //create a random token
			user.auth=token; //save token with the specific user

			db.collection("users").update({_id:user._id},user,function(err,result){ //update the document
				if(err){
					console.log("Error updating the database: ",err);
					res.sendStatus(500);
				}else{
					createAuthCookies(user,res);
					res.redirect("/");
				}
			});
		}
	});
});


app.get('/logout',function(req,res){
	res.clearCookie("token",{path:'/'});
	res.clearCookie("username",{path:'/'});
	res.redirect('/');
});

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


function createAuthCookies(user,res){
	//create auth cookie
	res.cookie('token', user.auth, {path:'/', maxAge:3600000});
	res.cookie('username', user.username, {path:'/', maxAge:3600000});
}
