const SECRET_API_KEY = process.env.SECRET_API_KEY;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_SID = 'AC5540eacb75d9668617f65961396cb677';
const port = process.env.PORT || 5000
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Pushy = require('pushy');
const pushyAPI = new Pushy(SECRET_API_KEY);
const twilio = require('twilio');

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-CSRF-Token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/sms', (req, res) => {
	const client = new twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
	client.messages
		.create({
	   	body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
      to: '+14155687800',
      from: '+13164444424'
	 })
	.then(message => {
    console.log(message.sid)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({sid: message.sid}));
  })
});

app.post('/push/:device_token', (req, res) => {

	const data = {
		"amount": req.body.amount,
		"note": req.body.note,
		"firebase_token": req.body.firebase_token,
		"api_client_id": "kjsdjkhvkzxcjhjvzzxcv"
	};
	pushyAPI.sendPushNotification(data, [req.params.device_token], {}, function (err, id) {
		if (err) {
			console.log('Fatal Error', err);
			res.status(500).send('Something broke!')
		} else {
			console.log('Push sent successfully! (ID: ' + id + ')');
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({id: id}));
		}
	});
});
app.listen(port, () => console.log('Example app listening on port ' + port + '!'))
