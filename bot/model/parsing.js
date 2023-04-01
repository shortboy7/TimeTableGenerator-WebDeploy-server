const axios = require('axios');
const cheerio = require('cheerio');

function getTodaySolved(id) {
	const url = `https://www.acmicpc.net/status?user_id=${id}&result_id=4`;
	axios.get(url, {
		headers: {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'}
	})
	.then( (res) => {
		let result = [];
		const now = new Date();
		const nextDay = new Date(now.getTime() + 24 * 60 *60 *1000);
		const [cur, next] = [now.setHours(6, 0, 0, 0), nextDay.setHours(6, 0, 0, 0)];
		const body = res.data;
		const $ = cheerio.load(body);
		const tbody = $(`#status-table > tbody`);
		let i, size = tbody[0].children.length;
		for (i = 1; i <= size; i++) {
			const id = $(`#status-table > tbody tr:nth-child(${i}) td:nth-child(2) a`).text();
			const pid = $(`#status-table > tbody tr:nth-child(${i}) td:nth-child(3) a`).text();
			const timestamp = $(`#status-table > tbody tr:nth-child(${i}) td:nth-child(9) a`).attr()['data-timestamp'] * 1000;
			const date = new Date(timestamp);
			if (cur > timestamp || timestamp >= next) break ;
			result.push({
				'id' : id,
				'pid' : pid,
				'date' : date,
			});
		}
		console.log(result.length);
		result.forEach((obj) => {
			console.log(obj);
		})
		return result;
	})
	.catch((err) => {console.log(err);})
}

module.exports = {
	getTodaySolved

}

getTodaySolved('thdwldnd7');