const express = require('express');
const router = express.Router();
require('dotenv/config');

/////////////////
// I M P O R T //
/////////////////

const { getMemberIds, drawItems, postSlackMessage, getMessageText } = require('../utils/utilities');

/////////////////
// D E F I N E //
/////////////////

const token = process.env.TOKEN; // API token
const drawChannel = process.env.DRAWCHANNEL; // Channel to draw from
const announceChannel = process.env.ANNOUNCECHANNEL; // Channel to announce to

// Draw number of items from channel
router.get('/:qty', (req, res) => {
	getMemberIds(token, drawChannel)
		.then(response => {
			const selectedItems = drawItems(response.members, req.params.qty);
			res.status(200).json({
				code: res.statusCode,
				status: 'OK',
				description: `${req.params.qty} items drawn from channel ${drawChannel}`,
				data: selectedItems
			});
		})
		.catch(err => {
			console.log(err);
		});
});

// Announce lottery winners in Slack channel
router.post('/', (req, res) => {
	const items = req.body;
	const messageText = getMessageText(items[0], items[1], items[2], items[3]);
	postSlackMessage(token, announceChannel, messageText)
		.then(() => {
			res.status(200).json({
				code: res.statusCode,
				status: 'OK',
				description: `Sent message to Slack channel ${announceChannel}`,
				data: messageText
			});
		})
		.catch(err => {
			console.log(err);
		});
});

/////////////////
// E X P O R T //
/////////////////

module.exports = router;
