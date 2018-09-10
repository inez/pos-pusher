const SECRET_API_KEY = process.env.SECRET_API_KEY;
const port = process.env.PORT || 5000
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Pushy = require('pushy');
const pushyAPI = new Pushy(SECRET_API_KEY);

app.use(bodyParser.json());

app.post('/:device_token', (req, res) => {
	const data = {
		"amount": req.body.amount,
		"note": req.body.note,
		"firebase_token": req.body.firebase_token,
		"api_client_id": "kjsdjkhvkzxcjhjvzzxcv"
	};
	pushyAPI.sendPushNotification(data, [req.params.device_token], {}, function (err, id) {
		if (err) {
			console.log('Fatal Error', err);
			res.send('Fatal Error');
		} else {
			console.log('Push sent successfully! (ID: ' + id + ')');
			res.send(id);
		}
	});
});
app.listen(port, () => console.log('Example app listening on port ' + port + '!'))
