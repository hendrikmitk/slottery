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
const slackBotId = process.env.SLACKBOT; // Slack bot ID;

// Draw number of items from channel
router.get('/:qty', (req, res) => {
	getMemberIds(token, drawChannel)
		.then(response => {
			const selectedItems = drawItems(response.members, req.params.qty, slackBotId);
			res.status(200).json({
				code: res.statusCode,
				status: 'OK',
				description: `${selectedItems.length} items selected from channel`,
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
	const messageText = getMessageText(items);
	postSlackMessage(token, announceChannel, messageText)
		.then(() => {
			res.status(200).json({
				code: res.statusCode,
				status: 'OK',
				description: `Sent message to Slack channel`,
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
