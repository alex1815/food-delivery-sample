import { FoodTypes } from "../models/foodTypes";
import { Food } from "../models/food";
import { mapInPreparedFoodsList, getMonday, getSunday, getCurrentDayInRussia } from "../helpers";
import { SERVER } from "../server/server";

export class FoodService {
    static async getOnWeek() {
        const res = await SERVER.getByDate(new Date());
        return res && res.foods ? res.foods : [];
    }

    static async getByDate(date = new Date()) {
        const foodsByDate = await SERVER.getByDate(date);

        return foodsByDate && foodsByDate.foods ? foodsByDate.foods : [];
    }

    static async getMyOrderByDate(date = new Date()) {
        const myOrderByDate = await SERVER.getMyOrderByDate(date);

        return myOrderByDate && myOrderByDate.foods ? myOrderByDate.foods : [];
    }

    static async getMyOrdersOnWeek() {
        const mondayForOrder = FoodService.getMondayForOrder();
        const sundayForOrder = FoodService.getSundayForOrder();

        const myOrdersOnWeek = await SERVER.getMyOrdersOnWeek(mondayForOrder, sundayForOrder);

        return myOrdersOnWeek ? myOrdersOnWeek : [];
    }

    static async orderFood(foods, date) {
        const prepareFunc = ((item, i) => {
            const { amount, id } = item;
            if (amount > 0) {
                return { id, amount };
            }
        });

        const preparedDataForServer = mapInPreparedFoodsList(foods, prepareFunc);

        return await SERVER.newOrder({ date, data: preparedDataForServer });
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

    static getMondayForOrder() {
        return getMonday(FoodService.getDateOnWeekForOrder());
    }

    static getSundayForOrder() {
        return getSunday(FoodService.getDateOnWeekForOrder());
    }

    static getDateOnWeekForOrder() {
        const currentDate = new Date();

        if (getCurrentDayInRussia(currentDate.getDay()) < 5) {
            return currentDate;
        } else {
            return (new Date()).setDate(currentDate.getDate() + 6);
        }
    }
}

Date.prototype.equalDate = function (date) {
    return date && this.getDate() === date.getDate() && this.getMonth() === date.getMonth() && this.getFullYear() === date.getFullYear();
}
