import { Food, FoodTypes, ROLES } from "../models";

import { request } from "./request";
import { REQUEST_TYPE } from "./requestTypes";

export class SERVER {
    static async newOrder(data) {
        // return request(REQUEST_TYPE.post, "newOrder", {data});
        return new Promise((resolve, reject) => {
            resolve({
                error: null,
                data
            });
        });
    }

    static async getByDate(date) {
        //return request(REQUEST_TYPE.get, "getMenu/" + date);

        const foodsByDate = mockDataFromServer.data.find((item) => {
            return item.date.equalDate(date);
        });

        return foodsByDate;
    }

    static async getMyOrderByDate(date) {
        //return request(REQUEST_TYPE.get, "getMyOrder/" + date);

        return new Promise((resolve, reject) => {
            const myOrderByDate = mockDataFromServer.myOrders.find((item) => {
                return item.date.equalDate(date);
            });

            resolve(myOrderByDate);
        });
    }

    static async getMyOrderOnWeek(firstDay, lastDay) {
        //return request(REQUEST_TYPE.get, `$getMyOrderOnWeek/{firstDay}/{lastDay}`);
        return new Promise((resolve, reject) => {
            resolve(mockDataFromServer.myOrders);
        });
    }

    static async foodsReady() {
        // TODO send message to server that foods are here
    }

    static getSumOfOrderOnWeek() {
        //return request(REQUEST_TYPE.get, "getSumOfOrderOnWeek");
        return new Promise((resolve, reject) => {
            resolve(100);
        });
    }

    static cancelOrder(date) {
        //return request(REQUEST_TYPE.post, "cancelOrder", {date});
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    static getRole() {
        //return request(REQUEST_TYPE.get, "myRole");
        return new Promise((resolve, reject) => {
            //resolve(ROLES.USER);
            resolve(ROLES.MANAGER);
        });
    }

    static getAllOrdersOnWeek() {
        // server should check that is request from manager
        //return request(REQUEST_TYPE.get, "getAllOrdersOnWeek");
        return new Promise((resolve, reject) => {
            //resolve(ROLES.USER);
            // предполагается, что хранится типо { id: myId, orders: [{date: 1, foods: []}, {date:2, foods: []}] }
            resolve(mockDataFromServer.allOrders);
        });
    }
}

const mockDataFromServer = {
    data: [
        {
            date: new Date(),
            foods: [
                {
                    name: "Caesar",
                    cost: 35,
                    type: FoodTypes.salad,
                    description: "chicken, salad",
                    weight: 200
                },
                {
                    name: "Salad 1",
                    cost: 100,
                    type: FoodTypes.salad,
                    description: "decription",
                    weight: 1,
                    amount: 0
                },
                {
                    name: "Salad 2",
                    cost: 2,
                    type: FoodTypes.salad,
                    description: "decription 2",
                    weight: 2,
                    amount: 1
                },
                {
                    name: "First 1",
                    cost: 2,
                    type: FoodTypes.second,
                    weight: 2,
                    amount: 2
                },
                {
                    name: "First 2",
                    cost: 3,
                    type: FoodTypes.first,
                    description: "first decription 2",
                    weight: 3,
                    amount: 0
                },
            ]
        },
        {
            date: new Date((new Date()).setDate((new Date()).getDate() + 1)),
            foods: [
                {
                    name: "Venice",
                    cost: 30,
                    type: FoodTypes.salad,
                    description: "smt brilliant",
                    weight: 350
                },
                {
                    name: "Salad 1",
                    cost: 100,
                    type: FoodTypes.salad,
                    description: "decription",
                    weight: 1,
                    amount: 0
                },
                {
                    name: "Salad 2",
                    cost: 2,
                    type: FoodTypes.salad,
                    description: "decription 2",
                    weight: 2,
                    amount: 1
                },
                {
                    name: "First 1",
                    cost: 2,
                    type: FoodTypes.first,
                    description: "first decription 1",
                    weight: 2,
                    amount: 2
                },
                {
                    name: "First 2",
                    cost: 3,
                    type: FoodTypes.first,
                    description: "first decription 2",
                    weight: 3,
                    amount: 1
                },
            ]
        }
    ],
    myOrders: [
        {
            date: new Date(),
            foods: [
                {
                    name: "Caesar",
                    cost: 35,
                    type: FoodTypes.salad,
                    description: "chicken, salad",
                    weight: 200
                },
                {
                    name: "Potatoes",
                    description: "potatoes with butter",
                    cost: 2,
                    type: FoodTypes.second,
                    weight: 2,
                    amount: 2,
                },
                {
                    name: "Soup 1",
                    cost: 3,
                    type: FoodTypes.first,
                    description: "it has some description",
                    weight: 3,
                    amount: 1
                },
            ]
        },
        {
            date: new Date((new Date()).setDate((new Date()).getDate() + 1)),
            foods: [
                {
                    name: "Soup 2",
                    cost: 3,
                    type: FoodTypes.first,
                    description: "it's soup and it has description",
                    weight: 200,
                    amount: 2
                },
            ]
        }
    ],
    allOrders: [
        {
            costOnWeek: 81,
            name: "User1",
            order: [
                {
                    date: new Date(),
                    foods: [
                        {
                            name: "Caesar",
                            cost: 35,
                            type: FoodTypes.salad,
                            description: "chicken, salad",
                            weight: 200
                        },
                        {
                            name: "Potatoes",
                            description: "potatoes with butter",
                            cost: 2,
                            type: FoodTypes.second,
                            weight: 2,
                            amount: 2,
                        },
                        {
                            name: "Soup 2",
                            cost: 3,
                            type: FoodTypes.first,
                            description: "it's soup and it has description.",
                            weight: 3,
                            amount: 1
                        },
                    ],
                },
                {
                    date: new Date((new Date()).setDate((new Date()).getDate() + 1)),
                    foods: [
                        {
                            name: "Caesar",
                            cost: 35,
                            type: FoodTypes.salad,
                            description: "chicken, salad",
                            weight: 200
                        },
                        {
                            name: "Potatoes",
                            description: "potatoes with butter",
                            cost: 2,
                            type: FoodTypes.second,
                            weight: 2,
                            amount: 2,
                        },
                    ]
                }
            ]
        },
        {
            name: "User2",
            costOnWeek: 6,
            order: [
                {
                    date: new Date((new Date()).setDate((new Date()).getDate() + 1)),
                    foods: [
                        {
                            name: "Soup 3",
                            cost: 3,
                            type: FoodTypes.first,
                            description: "just soup, it's but not so bad.",
                            weight: 200,
                            amount: 2
                        },
                    ]
                }
            ]
        }
    ]
};