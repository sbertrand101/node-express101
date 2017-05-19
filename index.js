//console.log('Hello world');

var Bandwidth = require("node-bandwidth");

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http").Server(app);

var client = new Bandwidth({
	userId    : process.env.BANDWIDTH_USER_ID, // <-- note, this is not the same as the username you used to login to the portal
	apiToken  : process.env.BANDWIDTH_API_TOKEN,
	apiSecret : process.env.BANDWIDTH_API_SECRET
});

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));

app.get("/", function(req, res){				//at certain address, takes in request and resposne
	console.log(req);
	res.send("my AWESOME WEBSITE");
});

app.post("/message-callback", function(req, res){
	var body = req.body;
	res.sendStatus(200);
	if (body.direction === "in"){
		var numbers = {
			to   : body.from,
			from : body.to
		}
		sendMesage(numbers);

	}
});

app.post("/call-callback", function (req, res){
	var body = req.body;
	res.sendStatus(200);
	if (body.eventType === "answer"){
		client.Call.speakSentence(body.callId, "asd;flknwe poisdfjlk wpeoiru")
		.then(function (res) {
			console.log("speakSentence sent");
		})
		.catch(function (err){
			console.log(err);
		});
	}
	else if (body.eventType === "speak" && body.state === "PLAYBACK_STOP"){
		client.Call.hangup(body.callId)
		.then(function (){
			console.log("Hanging up call");
		})
		.catch(function (err){
			console.log("Error hanging up the call, it was probably already over.");
			console.log(err);
		});
	}
	else{
		console.log(body);
	}
});


var messagePrinter = function (message){
	console.log('Using the message printer');
	console.log(message);
}

var sendMesage = function(params){
	return client.Message.send({
		from : params.from,
		to   : params.to,
		text : "Changing this sentence to Bey is Bae",
		media: "http://i.huffpost.com/gen/5095340/thumbs/o-BEYONCE-GRAMMY-570.jpg"
	})
	.then(function(message){
		messagePrinter(message);				//print message sent
		return client.Message.get(message.id); 	//print message id
	})
	.then(messagePrinter)						//else, print error message
	.catch(function(err){
		console.log(err);
	});
}

var numbers = {
	to   : "+18286385873",
	from : "+18284498539"
};

//sendMesage(numbers);

http.listen(app.get('port'), function(){
    console.log('listening on *:' + app.get('port'));
});









