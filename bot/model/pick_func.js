const client = require('../myClient');
require('dotenv').config({path: '../.env'});
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

function pick(channelID){
	const guild = client.guilds.cache.get(guildId);
	const channel = guild.channels.cache.get(channelID);
	let names = channel.members.map(member => member.user.username);
	names = names.filter(name => name != '스터디 봇');
	const randomPick = names[Math.floor(Math.random() * names.length)];
	channel.send('오늘의 발표자는 ' + randomPick + '님입니다!');
	return randomPick;
}
module.exports = pick;