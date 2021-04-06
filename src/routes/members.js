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

// Get all channel members
router.get('/', (req, res) => {
	getMemberIds(token, drawChannel)
		.then(response => {
			res.status(200).json({
				code: res.statusCode,
				status: 'OK',
				description: `Members retrieved`,
				data: response.members
			});
		})
		.catch(err => {
			console.log(err);
		});
});

// Get details of all channel members
router.get('/details', (req, res) => {
	getMemberIds(token, drawChannel)
		.then(response => {
			return response.members;
		})
		.then(memberIds => {
			retrieveMemberData(memberIds, token).then(memberData => {
				const vacayMembers = {};
				const workingMembers = {};
				Object.keys(memberData).forEach(key => {
					if (memberData[key].status_text == 'Im Urlaub' || memberData[key].status_emoji == ':palm_tree:') {
						vacayMembers[key] = memberData[key];
					} else {
						workingMembers[key] = memberData[key];
					}
				});

				if (req.query.vacationing == 'true' || req.query.vacationing == '1') {
					res.status(200).json({
						code: res.statusCode,
						status: 'OK',
						description: `Member on vacation details retrieved`,
						data: vacayMembers
					});
					return;
				}
				if (req.query.vacationing == 'false' || req.query.vacationing == '0') {
					res.status(200).json({
						code: res.statusCode,
						status: 'OK',
						description: `Member not on vacation details retrieved`,
						data: workingMembers
					});
					return;
				}
				res.status(200).json({
					code: res.statusCode,
					status: 'OK',
					description: `Member details retrieved`,
					data: memberData
				});
			});
		})
		.catch(err => {
			console.log(err);
		});
});

// Get details of single channel member
router.get('/details/:id', (req, res) => {
	retrieveMemberData([req.params.id], token)
		.then(memberData => {
			res.status(200).json({
				code: res.statusCode,
				status: 'OK',
				description: `Details retrieved for member ${req.params.id}`,
				data: {
					email: memberData[req.params.id].email,
					real_name: memberData[req.params.id].real_name,
					display_name: memberData[req.params.id].display_name,
					status_text: memberData[req.params.id].status_text,
					status_emoji: memberData[req.params.id].status_emoji
				}
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
