const axios = require('axios');

/////////////////
// D E F I N E //
/////////////////

const url = 'https://slack.com/api';

/////////////////
// H E L P E R //
/////////////////

// Get array of user ids for a Slack channel
const getMemberIds = async (token, channelId) => {
	const output = await axios.get(`${url}/conversations.members?token=${token}&channel=${channelId}`);
	return output.data;
};

// Draw certain number of items from array
const drawItems = async (arr, qty) => {
	const output = [];
	for (let i = 0; i < qty; i++) {
		let elem = await arr[Math.floor(Math.random() * arr.length)];
		if (output.includes(elem)) {
			return;
		}
		output.push(elem);
	}
	return output;
};

// Retrieve additional member data for drawn items
const retrieveMemberData = async (arr, token) => {
	const output = {};
	await Promise.all(
		arr.map(async id => {
			const userData = await axios.get(`${url}/users.info?token=${token}&user=${id}`);
			if (userData.data.user.profile.email !== undefined) {
				output[userData.data.user.id] = {
					email: userData.data.user.profile.email,
					real_name: userData.data.user.profile.real_name,
					display_name: userData.data.user.profile.display_name,
					status_text: userData.data.user.profile.status_text,
					status_emoji: userData.data.user.profile.status_emoji
				};
			}
		})
	);
	return output;
};

// Post message in a Slack channel
const postSlackMessage = async (token, channelId, content) => {
	const request = await axios.post(
		`${url}/chat.postMessage`,
		{
			token: token,
			channel: channelId,
			text: content
		},
		{
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				Authorization: `Bearer ${token}`
			}
		}
	);
	return request;
};

/////////////////
// E X P O R T //
/////////////////

module.exports = {
	getMemberIds,
	drawItems,
	retrieveMemberData,
	postSlackMessage
};
