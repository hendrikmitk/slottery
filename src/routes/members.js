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

const { getMemberIds, retrieveMemberData } = require('../utils/utilities');

/////////////////
// D E F I N E //
/////////////////

const token = process.env.TOKEN; // Slack API token
const drawChannel = process.env.DRAWCHANNEL; // Slack channel to draw from

// Get data of all channel members
router.get('/', (req, res) => {
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

// Get data of single channel member
router.get('/:id', (req, res) => {
	getMemberIds(token, drawChannel)
		.then(response => {
			return response.members;
		})
		.then(memberIds => {
			retrieveMemberData(memberIds, token).then(memberData => {
				Object.keys(memberData).forEach(key => {
					if (key === req.params.id) {
						res.status(200).json({
							code: res.statusCode,
							status: 'OK',
							description: `Data retrieved for member with ID ${req.params.id}`,
							data: (memberData[key] = {
								email: memberData[key].email,
								real_name: memberData[key].real_name,
								display_name: memberData[key].display_name,
								status_text: memberData[key].status_text,
								status_emoji: memberData[key].status_emoji
							})
						});
					}
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
