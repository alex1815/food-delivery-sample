export class CurrentOrderItem {
	constructor({id, name, cost, amount, description})
	{
		this.id = id;
		this.name = name;
		this.cost = cost;
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