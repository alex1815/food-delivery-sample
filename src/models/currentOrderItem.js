import { weightToString } from "../helpers";

export class CurrentOrderItem {
    id;
    name;
    cost;
    amount;
    description;

    constructor({ id, name, cost, amount, description }) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.amount = amount || 0;

        if (description) {
            this.description = this.description.toLowerCase();
        }
    }

    weightToString() {
        return weightToString(this.weight);
    }
}