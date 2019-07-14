import * as AdditionalInfo from "./additionalInfo";

const FoodTypes = (function () {
    let result = {};
    const names = [];
    const descriptions = [];

    AdditionalInfo.foodTypes.map(({ name, description }) => {
        names.push(name);
        descriptions.push(description);
    })

    result.descriptions = new Object();
    descriptions.map((description, i) => {
        const name = names[i];
        result[ name ] = name;
        result.descriptions[ name ] = description;
    });

    return result;
})();

export { FoodTypes };