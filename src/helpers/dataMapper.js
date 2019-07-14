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

