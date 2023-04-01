const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

class CronTask{
	constructor(interval, execute, args){
		this.interval = interval;
		this.execute = execute;
		this.args = args;
	}
	generateTask() {
		const now =	moment().toDate().getTime();
		const next = this.interval.next().toDate().getTime();
		setTimeout(this.execute, next - now, ...this.args);
		setTimeout(this.generateTask.bind(this), next - now);
	}
};

class Scheduler{
	constructor(){
		this.cronTasks = [];
	}
	pushCronTask(interval, execute, ...args){
		const task = new CronTask(interval, execute, args);
		this.cronTasks.push(task);
		task.generateTask();
	}
};

module.exports = {
	scheduler : new Scheduler()
};