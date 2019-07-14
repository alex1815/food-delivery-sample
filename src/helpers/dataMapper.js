export function mapInPreparedFoodsList(preparedData, func) {
    return preparedData.map(({ data }, j) => {
        return data.map((item, i) => {
            return func(item, i, data, j);
        });
    });
}

