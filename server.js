var express = require('express');
var http = require('http');
var app = express();
var hat = require('hat');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
var server = http.createServer(app);
var io = require('socket.io')(server);
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
        server.listen(app.get('port'), function() {
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

app.get("/chat",cookieParser(), function(req,res){
    db.collection("users").findOne({username:req.cookies.username},function(err,user){ //assume unique usernames.
        if(user && user.auth===req.cookies.token){
            console.log("User authenticated.");
            res.render('chat',{user: {username:req.cookies.username, auth:user.auth}});
        }else{
            res.render('index',{warning: "Please log in to chat"});
        }
    });
});

var clients= [];

io.on("connection", function(socket){
	console.log("Got a connection");
	socket.on("intro",function(data){
		socket.username = data;
		clients.push(socket);
		socket.broadcast.emit("message", timestamp()+": "+socket.username+" has entered the chatroom.");
		io.emit("userList", {users: getUserList()});
		socket.emit("message","Welcome, "+socket.username+".");
	});

	socket.on("message", function(data){
		console.log("got message: "+data);
		for (var i in clients){
			if (socket !== clients[i] && (!clients[i].blocks || !clients[i].blocks.includes(socket.username))){
				clients[i].emit("message",timestamp()+", "+socket.username+": "+data);
			}
		}
	});

	socket.on("disconnect", function(){
		console.log(socket.username+" disconnected");
		io.emit("message", timestamp()+": "+socket.username+" disconnected.");
		clients = clients.filter(function(ele){
       		return ele!==socket;
		});
		io.emit("userList", {users: getUserList()});
	});
});


app.use(express.static(ROOT));

app.all("*", function(req,res){
    res.sendStatus(404);
});


function timestamp(){
	return new Date().toLocaleTimeString();
}

function getUserList(){
    var ret = [];
    for(var i=0;i<clients.length;i++){
        ret.push(clients[i].username);
    }
    return ret;
}


function createAuthCookies(user,res){
	//create auth cookie
	res.cookie('token', user.auth, {path:'/', maxAge:3600000});
	res.cookie('username', user.username, {path:'/', maxAge:3600000});
}
