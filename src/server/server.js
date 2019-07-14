import { Food, FoodTypes, ROLES } from "../models";

import { request } from "./request";
import { REQUEST_TYPE } from "./requestTypes";

export class SERVER {
	static async newOrder (data) {
		// we think what FALSE - it's when NO ERROR
		return request(REQUEST_TYPE.post, "newOrder", {data});
	}

	static async getByDate (date) {
		//return request(REQUEST_TYPE.get, "getMenu/" + date);

		let foodsByDate = mockDataFromServer.data.find( (item) => {
			return item.date.equalDate(date);
		 });

		 return foodsByDate;
	}

	static async getMyOrderByDate(date) {
		//return request(REQUEST_TYPE.get, "getMyOrder/" + date);
		
		let myOrderByDate = mockDataFromServer.myOrders.find( (item) => {
			return item.date.equalDate(date);
		 });

		return myOrderByDate; 
	}

	static async getMyOrderOnWeek(firstDay, lastDay) {
		//return request(REQUEST_TYPE.get, `$getMyOrderOnWeek/{firstDay}/{lastDay}`);
		return new Promise( (resolve, reject) => {
			resolve(mockDataFromServer.myOrders);
		});
	}

	static foodsReady() {
		// todo send message to server that foods bring
	}

	static getSumOfOrderOnWeek () {
		//return request(REQUEST_TYPE.get, "getSumOfOrderOnWeek");
		return new Promise( (resolve, reject) => {
			resolve(100);
		});
	}

	static cancelOrder(date) {
		//return request(REQUEST_TYPE.post, "cancelOrder", {date});
		return new Promise( (resolve, reject) => {
			resolve();
		});
	}

	static getRole() {
		//return request(REQUEST_TYPE.get, "myRole");
		return new Promise( (resolve, reject) => {
			//resolve(ROLES.USER);
			resolve(ROLES.MANAGER);
		});
	}

	static getAllOrdersOnWeek() {
		// server should check that is request from manager
		//return request(REQUEST_TYPE.get, "getAllOrdersOnWeek");
		return new Promise( (resolve, reject) => {
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
				new Food({name: "Цезарь", cost: 35, type: FoodTypes.salad, description: "курица, гренки", weight: 200}),
				{
					name: "salad 1",
					cost: 100,
					type: FoodTypes.salad,
					description: "decription",
					weight: 1,
					amount: 0
				},
				{
					name: "salad 2",
					cost: 2,
					type: FoodTypes.salad,
					description: "decription 2",
					weight: 2,
					amount: 1
				},
				{
					name: "first 1",
					cost: 2,
					type: FoodTypes.second,
					weight: 2,
					amount: 2
				},
				{
					name: "first 2",
					cost: 3,
					type: FoodTypes.first,
					description: "first decription 2",
					weight: 3,
					amount: 0
				},
			]
		},
		{
			date: new Date((new Date()).setDate( (new Date()).getDate() + 1 )),
			foods: [
				new Food({name: "Венеция", cost: 30, type: FoodTypes.salad, description: "что-то, новое", weight: 350}),,
				{
					name: "salad 1",
					cost: 100,
					type: FoodTypes.salad,
					description: "decription",
					weight: 1,
					amount: 0
				},
				{
					name: "salad 2",
					cost: 2,
					type: FoodTypes.salad,
					description: "decription 2",
					weight: 2,
					amount: 1
				},
				{
					name: "first 1",
					cost: 2,
					type: FoodTypes.first,
					description: "first decription 1",
					weight: 2,
					amount: 2
				},
				{
					name: "first 2",
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
					name: "Цезарь", cost: 35, type: FoodTypes.salad, description: "курица, гренки", weight: 200},
				{
					name: "Пюре",
					description: "cказано, что тут есть картошка. Еще пишут много других слов, слов, слов, слов, слов, слов, может столько.",
					cost: 2,
					type: FoodTypes.second,
					weight: 2,
					amount: 2,
				},
				{
					name: "Гороховый суп",
					cost: 3,
					type: FoodTypes.first,
					description: "cказано, что тут есть горошек. Еще пишут много других слов, слов, слов, слов, слов, слов, может столько.",
					weight: 3,
					amount: 1
				},
			]
		},
		{
			date: new Date((new Date()).setDate( (new Date()).getDate() + 1 )),
			foods: [
				{
					name: "Какой-то суп",
					cost: 3,
					type: FoodTypes.first,
					description: "cказано, что это суп. слов, слов, слов, слов, слов, может столько.",
					weight: 200,
					amount: 2
				},
			]
		}
	],
	allOrders: [
		{
			costOnWeek: 50,
			name: "User1",
			order: [
				{
					date: new Date(),
					foods: [
						{
							name: "Цезарь", cost: 35, type: FoodTypes.salad, description: "курица, гренки", weight: 200},
						{
							name: "Пюре",
							description: "cказано, что тут есть картошка. Еще пишут много других слов, слов, слов, слов, слов, слов, может столько.",
							cost: 2,
							type: FoodTypes.second,
							weight: 2,
							amount: 2,
						},
						{
							name: "Гороховый суп",
							cost: 3,
							type: FoodTypes.first,
							description: "cказано, что тут есть горошек. Еще пишут много других слов, слов, слов, слов, слов, слов, может столько.",
							weight: 3,
							amount: 1
						},
					],
				},
				{
					date: new Date((new Date()).setDate( (new Date()).getDate() + 1 )),
					foods: [
						{
							name: "Салат", cost: 35, type: FoodTypes.salad, description: "курица, гренки", weight: 200},
						{
							name: "Пюре",
							description: "cказано, что тут есть картошка. Еще пишут много других слов, слов, слов, слов, слов, слов, может столько.",
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
			costOnWeek: 3,
			order: [
			{
				date: new Date((new Date()).setDate( (new Date()).getDate() + 1 )),
				foods: [
					{
						name: "Какой-то суп",
						cost: 3,
						type: FoodTypes.first,
						description: "cказано, что это суп. слов, слов, слов, слов, слов, может столько.",
						weight: 200,
						amount: 2
					},
				]
			}
			]
		}
	]
};