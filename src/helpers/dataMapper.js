export function findInPreaparingFoodsList(preparedData, func) {
	preparedData.find(({data}, j) => {
		return data.find((item, i) => {
			return func(item, i, data, j);
		});
	});
}

export function mapInPreaparingFoodsList(preparedData, func) {
	return preparedData.map(({data}, j) => {
		return data.map((item, i) => {
			return func(item, i, data, j);
		});
	});
} 

export function canChangeOrder(date) {
	const currentDate = new Date();
	return date
		&& date.getMonth() >= currentDate.getMonth() 
		&& date.getFullYear() >= currentDate.getFullYear()
		&& ( 
			(date.getDate() > currentDate.getDate())
			||
			(date.getDate() == currentDate.getDate() && currentDate.getHours() < 10)
		);
}

export function getCurrentDayInRussia(day) {
	return day == 0 ? 6: day-1;
}

export function getMonday(d) {
	d = typeof d === 'number'
		? new Date(d)
		: d;
	let day = d.getDay(),
		diff = d.getDate() - getCurrentDayInRussia(day);
	return new Date(d.setDate(diff));
}

export function getSunday(d) {
	d = typeof d === 'number'
		? new Date(d)
		: d;
	let day = d.getDay(),
		diff = d.getDate() + (6 - getCurrentDayInRussia(day));
	return new Date(d.setDate(diff));
}
