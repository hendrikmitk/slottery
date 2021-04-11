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
const drawItems = (arr, qty) => {
	if (!Array.isArray(arr)) return;
	if (qty == undefined) return arr;
	if (qty > arr.length) return;
	if (isNaN(qty)) return;

	const output = [];
	for (let i = 0; i < Math.round(qty); i++) {
		let random = Math.floor(Math.random() * arr.length);
		if (output.indexOf(arr[random]) !== -1) {
			continue;
		}
		output.push(arr[random]);
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

// Get Slack message text
const getMessageText = arr => {
	if (arr == undefined) return;

	if (arr.length == 1) return `:tada: Congratulations to the one-and-only lucky winner <@${arr[0]}> :rocket:`;

	let list = [];
	for (let i = 0; i < arr.length - 1; i++) {
		list.push('<@' + arr[i] + '>');
	}
	return `:tada: Congratulations to the lucky winners ${list.join(', ')} and <@${arr.slice(-1)}> :rocket:`;
};

/////////////////
// E X P O R T //
/////////////////

module.exports = {
	getMemberIds,
	drawItems,
	retrieveMemberData,
	postSlackMessage,
	getMessageText
};
