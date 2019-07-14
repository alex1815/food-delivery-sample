import { weightToString } from "../helpers";

export class Food {
    id;
    name;
    cost;
    type;
    description;
    weight;
    amount;

    constructor({ id, name, cost, type, description, weight, amount }) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.type = type;
        this.description = description;
        this.weight = weight;
        this.amount = amount || 0;

        if (this.description) {
            this.description = this.description.toLowerCase();
        }
    }

    weightToString() {
        return weightToString(this.weight);
    }
}