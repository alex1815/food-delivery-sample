import { FoodTypes } from "../models/foodTypes";
import { Food } from "../models/food";
import { mapInPreaparingFoodsList, getMonday, getSunday, getCurrentDayInRussia } from "../helpers";
import { SERVER } from "../server/server";

export class FoodService {
	static getOnWeek () {
		return mockDataFromServer;
	}

	static async getByDate(date = new Date()) {
		 const foodsByDate = await SERVER.getByDate(date);

		 return foodsByDate && foodsByDate.foods ? foodsByDate.foods : [];
	}

	static async getMyOrderByDate(date = new Date()) {
		const myOrderByDate = await SERVER.getMyOrderByDate(date);
		
		return myOrderByDate && myOrderByDate.foods ? myOrderByDate.foods : [];
	}

	static async getMyOrderOnWeek() {
		const mondayForOrder = FoodService.getMondayForOrder();
		const sundayForOrder = FoodService.getSundayForOrder();
		
		const myOrderOnWeek = await SERVER.getMyOrderOnWeek(mondayForOrder, sundayForOrder);
		
		return myOrderOnWeek ? myOrderOnWeek : [];
	}

	static async orderFood(foods, date) {
		const func = ( (item, i) => {
			if (item.amount > 0) return { id: item.id, amount: item.amount };
		});

		const preparedDataForServer = mapInPreaparingFoodsList(foods, func);

		result = await SERVER.newOrder( {date, data: preparedDataForServer} );
		return !!result;
	}

	static async foodsReady() {
		 return SERVER.foodsReady();
	}

	static getMySumOfOrderOnWeek() {
		 return SERVER.getSumOfOrderOnWeek();
	}

	static async cancelOrder(date) {
		 return SERVER.cancelOrder(date);
	 }

	static async getAllOrdersOnWeek() {
		 return SERVER.getAllOrdersOnWeek();
	}

	static getMondayForOrder () {
		return getMonday(FoodService.getDateOnWeekForOrder());
	}

	static getSundayForOrder () {
		return getSunday(FoodService.getDateOnWeekForOrder());
	}

	static getDateOnWeekForOrder () {
		const currentDate = new Date();

		if (getCurrentDayInRussia(currentDate.getDay()) < 5) {
			return currentDate;
		} else {
			return new Date((new Date()).setDate(currentDate.getDate() + 6 ));
		}
	}
}

Date.prototype.equalDate = function(date) {
	return date && this.getDate() === date.getDate() && this.getMonth() === date.getMonth() && this.getFullYear() === date.getFullYear();
}
