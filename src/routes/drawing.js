const express = require('express');
const router = express.Router();
require('dotenv/config');

const app = express();

/////////////////
// M I D D L E //
/////////////////

app.use(express.json());

/////////////////
// I M P O R T //
/////////////////

const { getMemberIds, drawItems } = require('../utils/utilities');

/////////////////
// D E F I N E //
/////////////////

const token = process.env.TOKEN; // Slack API token
const drawChannel = process.env.DRAWCHANNEL; // Slack channel to draw from

// Draw number of items from channel
router.get('/:qty', (req, res) => {
	getMemberIds(token, drawChannel)
		.then(response => {
			return response.members;
		})
		.then(memberIds => {
			// TODO Output comprehensible message when qry param is missing
			drawItems(memberIds, req.params.qty).then(winnerIds => {
				res.status(200).json({
					code: res.statusCode,
					status: 'OK',
					description: `${req.params.qty} items drawn from channel ${drawChannel}`,
					data: winnerIds
				});
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
