const client = require('../myClient');
const {clientId, guildId} = require('../config.json');

function pick(channelID){
	const guild = client.guilds.cache.get(guildId);
	const channel = guild.channels.cache.get(channelID);
	const names = channel.members.map(member => member.user.username);
	const randomPick = names[Math.floor(Math.random() * names.length)];
	channel.send('오늘의 발표자는 ' + randomPick + '님입니다!');
	return randomPick;
}
module.exports = pick;