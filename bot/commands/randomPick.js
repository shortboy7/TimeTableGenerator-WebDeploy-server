const {SlashCommandBuilder} = require('discord.js');
const {pick} = require('../model/pick_func.js');

module.exports = {
	data : new SlashCommandBuilder()
			.setName('pick')
			.setDescription('random pick member from the channel'),
	async execute(channelID) {
		await pick(channelID);
	}
};