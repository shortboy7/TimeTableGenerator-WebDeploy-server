const {SlashCommandBuilder} = require('discord.js');
const parser = require('cron-parser');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

const {scheduler} = require('../model/scheduler.js');
const pick = require('../model/pick_func.js');

module.exports = {
	data : new SlashCommandBuilder()
			.setName('schedule')
			.setDescription('reserve a job')
			.addStringOption(option =>
				option.setName('cron')
					.setDescription('cron expression for the job')
					.setRequired(true)
			)
			.addNumberOption(option =>
				option.setName('command')
					.setDescription('command to execute')
					.setRequired(true)
					.addChoices(
						{name : 'pick', value : 0}
					)
			),
	async execute(interaction) {
		const expression = interaction.options.getString('cron');
		console.log(expression);
		console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
		const command = interaction.options.getNumber('command');
		try{
			let interval = parser.parseExpression(expression, {
				tz: 'Asia/Seoul'
			});
			scheduler.pushCronTask(interval, (channelID) => {
					console.log(moment().toString() + 'test');
					console.log(pick(channelID));
				}
			, interaction.channelId);
			console.log(interval.next().toDate().toLocaleString());
			await interaction.reply('Job scheduled');
		}catch(err){
			console.log(err);
			await interaction.reply('Invalid cron expression');
		}
	}
};