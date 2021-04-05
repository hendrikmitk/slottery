const express = require('express');
const cors = require('cors');
require('dotenv/config');

const app = express();
const port = process.env.PORT || 3000;

// Configuring CORS middleware
app.use(
	cors({
		origin: '*',
		methods: 'GET'
	})
);

app.use(express.json());

/////////////////
// I M P O R T //
/////////////////

const {
	getMemberIds,
	drawItems,
	retrieveMemberData,
	postSlackMessage
} = require('./utils/utilities');

/////////////////
// D E F I N E //
/////////////////

const token = process.env.TOKEN; // Slack API token
const drawChannel = process.env.DRAWCHANNEL; // Slack channel to draw from

/////////////////
// R O U T E S //
/////////////////

// Get data of all channel members
app.get('/members', (req, res) => {
	getMemberIds(token, drawChannel)
		.then(response => {
			return response.members;
		})
		.then(memberIds => {
			retrieveMemberData(memberIds, token).then(memberData => {
				res.status(200).json({
					code: res.statusCode,
					status: 'OK',
					description: `Data retrieved for members of channel ${drawChannel}`,
					data: memberData
				});
			});
		})
		.catch(err => {
			console.log(err);
		});
});

/////////////////
// L I S T E N //
/////////////////

app.listen(port, () => {
	console.log(`CORS-enabled web server running and listening on port ${port}`);
});
