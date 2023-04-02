const {Client, Collection, GatewayIntentBits, IntentsBitField} = require('discord.js');
require('dotenv').config({path: '../.env'});
const clientId = process.env.CLIENT_ID;

const myIntents = new IntentsBitField();
myIntents.add(
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.MessageContent,
	IntentsBitField.Flags.GuildMessageReactions,
);

const client = new Client({ intents : myIntents, clientId: clientId });

module.exports = client;
