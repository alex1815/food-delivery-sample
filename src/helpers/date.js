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
	d = typeof d === "number"
		? new Date(d)
		: d;
	let day = d.getDay(),
		diff = d.getDate() - getCurrentDayInRussia(day);
	return new Date(d.setDate(diff));
}

export function getSunday(d) {
	d = typeof d === "number"
		? new Date(d)
		: d;
	let day = d.getDay(),
		diff = d.getDate() + (6 - getCurrentDayInRussia(day));
	return new Date(d.setDate(diff));
}

// can be changed to name of days on any language, on Russian for example
export const NAMES_OF_DAYS = [
	// "Понедельник",
	// "Вторник",
	// "Среда",
	// "Четверг",
    // "Пятница"
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

export function generateListOfDays(firstDay) {
    return NAMES_OF_DAYS.map((name, i) => {
        return ({
            day: i,
            name,
            date: (new Date()).setDate(firstDay.getDate() + i),
        });
    });
}
