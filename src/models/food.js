class IFood {
	id;
	name;
	description;
	cost;
	type;
	weight;
	amount;
}

export class Food extends IFood {
	constructor({id, name, cost, type, description, weight, amount})
	{
		super();
		this.id = id;
		this.name = name;
		this.cost = cost;
		this.type = type;
		this.description = description;
		this.weight = weight;
		this.amount = amount || 0;

		if (this.description)
		{
		 	this.description = this.description.toLowerCase();
		}	
	}

	weightToString()
	{
		return this.weight = this.weight ? this.weight + " грамм" : "";
	}
}