const {Client, Collection, GatewayIntentBits, IntentsBitField} = require('discord.js');
const {clientId} = require('./config.json');

const myIntents = new IntentsBitField();
myIntents.add(
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.MessageContent,
	IntentsBitField.Flags.GuildMessageReactions,
);

const client = new Client({ intents : myIntents, clientId: clientId });

module.exports = client;
