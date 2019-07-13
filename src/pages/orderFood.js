import React, { Component } from 'react';

import {
	StyleSheet,
	Text,
	View,
	SectionList,
	ScrollView,
} from 'react-native';

import { MyButton, IncreaseAmount, DecreaseAmount, NextDayButton, BackDayButton, BlockFoodDescription } from "../components/exportCopmonents";
import { FoodService } from "../services/foodService";
import { PAGE_STYLES, TEXT_STYLES } from "../share/styles";
import { findInPreaparingFoodsList } from "../helpers/helpers";
import { FoodTypes, CurrentOrderItem } from "../models/exportModels";
import { mapInPreaparingFoodsList, canChangeOrder } from "../helpers/helpers";

const STATE = {
	LOADING_DATA: "Загрузка данных...",
	LOADING_ORDER: "Отправка заказа",
	LOADED_ORDER_SUCCESS: "Заказ успено отправлен!",
	LOADING_ORDER_ERROR: "Ошибка отправки заказа! Повторите отправку",
	DONE: ""
}

const SECONDS_FOR_SHOWING_MESSAGE = 1.5;

export class OrderFood extends React.Component {
	static navigationOptions = {
		title: "Сделать заказ"
	}

	constructor(props){
		super(props);

		this._setNewDate = this._setNewDate.bind(this);
		this._getDataByDateFromState = this._getDataByDateFromState.bind(this);
		this._updatedAmountForItem = this._updatedAmountForItem.bind(this);
		this._renderListItem = this._renderListItem.bind(this);
		this._orderFood = this._orderFood.bind(this);

		this.state = {
			message: STATE.LOADING_DATA,
			foods: [],
			date: new Date(),
			changed: false,
			currentOrder: [],
			currentSum: 0,
		};
	}

	componentDidMount() {
		this._loadDataByDateFromState();
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.navigation.state.params
			&& nextProps.navigation.state.params.date
			&& nextProps.navigation.state.params.date != this.state.date) {

			this.setState({ date: nextProps.navigation.state.params.date }, this._loadDataByDateFromState);
		}
	}

	render(){
		return (
			<View style={[PAGE_STYLES.pageWithScrool]}>
				<ScrollView style={[PAGE_STYLES.scrollForPageWithScroll]}>
					<View style={[styles.row, styles.elementsByCenter]}>
						<BackDayButton date={ this.state.date } setNewDate={this._setNewDate}/>
						<Text style={[TEXT_STYLES.header]}>{`Еда на ${(this.state.date).toDateString()}`}</Text>
						<NextDayButton date={this.state.date} setNewDate={this._setNewDate}/>
					</View>
					<View style={[styles.marginTop10]}>{
						this.state.message == STATE.DONE
						? <View>{
							this.state.foods.length > 0
							? <View>
									{
										this.state.currentOrder.length > 0
										? <View style={styles.paddingBottom}>
											<Text style={[TEXT_STYLES.header]}> Текущий заказ: </Text>
											<Text style={[TEXT_STYLES.header, styles.paddingLeft]}>{this.state.currentOrder.map(({name, amount}) => {return `${name}(${amount})`;}).join(", ")}</Text> 
											<Text style={[TEXT_STYLES.header]}> Сумма текущего заказа: </Text>
											<Text style={[TEXT_STYLES.header, styles.paddingLeft]}>{`${this.state.currentSum}р.`}</Text>
											</View>
										: null
									}
									<SectionList
									renderItem={this._renderListItem}
									renderSectionHeader={this._renderSectionHeader}
									sections={ this.state.foods }/>
									<View>{
										this._showButtonsForChangingAmount()
										? <MyButton style={[styles.marginTop10]} onPress={this._orderFood} title={"Заказать"}/>
										: null
									}</View>
								</View> 
							: <Text style={[TEXT_STYLES.header]}>На этот день нельзя сделать заказ.</Text>
						}</View>
						: <Text style={[TEXT_STYLES.header]}>{this.state.message}</Text>
					}</View>
				</ScrollView>
			</View>
		);
	}

	_renderSectionHeader({section}) {
		return <Text style={[TEXT_STYLES.subHeader]}> {`${section.title}:`} </Text>;
	}

	_renderListItem({item}) {
		return <View style={[styles.row, {justifyContent:"center", alignItems: "center"}]}>
					<BlockFoodDescription 
						name={item.name} 
						description={item.description} 
						cost={item.cost}
						content
						blockWidth={styles.blockWidth}/>
					{
						this._showButtonsForChangingAmount()
						? <View style={[styles.row, styles.buttonsWidth]}>
							<IncreaseAmount value={item.amount} setNewValue={newValue => this._increaseAmount(item, newValue)}/>
							<Text style={[TEXT_STYLES.header, styles.amountText]}>
								{item.amount}
							</Text>
							<DecreaseAmount value={item.amount} setNewValue={newValue => this._decreaseAmount(item, newValue)}/>
						</View>
						: null
					}
					</View>
	}

	_setNewDate(dateMS) {
		this.setState({ date: new Date(dateMS) }, () => {
			this._loadDataByDateFromState();
		});
	}

	async _loadDataByDateFromState() {
		this.setState({ message: STATE.LOADING_DATA });
		const result = await this._getDataByDateFromState();
		this.setState({ foods: result }, () => this.setState({ message: STATE.DONE }));
		this._generateCurrentOrder(result);
	}

	async _getDataByDateFromState() {
		this.setState({ message: STATE.LOADING_DATA });

		const data = await FoodService.getByDate(this.state.date);
		let preparingData = [];
		const result = [];
		
		data && data.map((item) => {
			let foundSection = false;

			preparingData.map(( {data, title}, i ) => {
				if (!foundSection && title == item.type) {
					foundSection = true;
					preparingData[i].data.push(item);
					return;
				}
			});

			if (!foundSection) {
				preparingData.push( {data: [item], title: item.type} );
			}
		});
		preparingData.map(({data, title}) => {
			const translatedTitle = FoodTypes.descriptions[title];
			result.push({data, title: translatedTitle});
		});
		
		return Promise.resolve(result);
	}

	async _increaseAmount(item, newValue) {
		const increaseAmountIntoCurrentOrder = (foundItem, foundIndexOfItem, updatedCurrentOrder) => {
			let costOfCurrentItem;
			if (foundIndexOfItem > -1) {
				foundItem.amount += 1;
				costOfCurrentItem = foundItem.cost;
			} else {
				addItemToCurrentOrder(updatedCurrentOrder, foundIndexOfItem);
				costOfCurrentItem = item.cost;
			}
			this.setState({ currentSum: this.state.currentSum + costOfCurrentItem });
		};

		const addItemToCurrentOrder = (updatedCurrentOrder) => {
			updatedCurrentOrder.push(new CurrentOrderItem({id: item.id, name: item.name, amount: item.amount, cost: item.cost}));
		};

		await this._updatedAmountForItem(item, newValue);
		this._changeAmountIntoCurrentOrder(item, increaseAmountIntoCurrentOrder, addItemToCurrentOrder);
	}

	_decreaseAmount(item, newValue) {
		const decreaseAmountIntoCurrentOrder = (foundItem, foundIndexOfItem, updatedCurrentOrder) => {			
			if (foundIndexOfItem > -1) {
				if (foundItem.amount == 1) {
					removeItemFromCurrentOrder(updatedCurrentOrder, foundIndexOfItem);
				} else {
					foundItem.amount -= 1;
				}
				this.setState({ currentSum: this.state.currentSum - foundItem.cost });
			}
		};

		const removeItemFromCurrentOrder = (updatedCurrentOrder, foundIndexOfItem) => {
			updatedCurrentOrder.splice(foundIndexOfItem, 1);
		};

		this._changeAmountIntoCurrentOrder(item, decreaseAmountIntoCurrentOrder, removeItemFromCurrentOrder);

		if (item.amount > 0) {
			this._updatedAmountForItem(item, newValue);
		}
	}
	
	_updatedAmountForItem(itemForUpdate, newAmount) {
		let newData;
		const callback = ((item, i, data, j) => {
			if (item == itemForUpdate) {
				newData = Object.assign([], this.state.foods);
				newData[j].data[i].amount = newAmount;
				
				return true;
			}
		});

		findInPreaparingFoodsList(this.state.foods, callback);

		return new Promise( (resolve, reject) => {
			this.setState({foods: newData}, 
				() => resolve()
			);
		});
	}

	async _orderFood () {
		this.setState({ message: STATE.LOADING_ORDER });

		error = await FoodService.orderFood(this.state.foods, this.state.date)
		this._showTemporaryMessage(error ?  STATE.LOADING_ORDER_ERROR : STATE.LOADED_ORDER_SUCCESS);
	}

	_showTemporaryMessage(text, time = SECONDS_FOR_SHOWING_MESSAGE) {
		let self = this;
		this.setState({ message: text});
		setTimeout(() => {
			 self.setState({ message: STATE.DONE });
		}, time * 1000);
	}

	_changeAmountIntoCurrentOrder(item, changeAmountFunc, operationWithArray) {
		const foundIndexOfItem = this._findIntoCurrentOrder(item);
		const updatedCurrentOrder = Object.assign([], this.state.currentOrder);

		let foundItem = updatedCurrentOrder[foundIndexOfItem];
		changeAmountFunc(foundItem, foundIndexOfItem, updatedCurrentOrder);
		
		this.setState({ currentOrder: updatedCurrentOrder });
	}

	_findIntoCurrentOrder(item) {
		return this.state.currentOrder.findIndex( ({name, amount}) => {
			return name === item.name;
		});
	}

	_generateCurrentOrder(newOrder) {
		const newCurrentOrder = [];
		let currentItems = [];
		let currentSum = 0;
		const getItems = (item) => {
			if (item.amount > 0) {
				newCurrentOrder.push(new CurrentOrderItem({id: item.id, name: item.name, amount: item.amount, cost: item.cost }));
				currentSum += item.cost;
			}
		};

		mapInPreaparingFoodsList(newOrder, getItems);
		this.setState({ currentOrder: newCurrentOrder, currentSum: currentSum });
	}

	_showButtonsForChangingAmount() {
		return canChangeOrder(this.state.date);
	}
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	elementsByCenter: {
		justifyContent: "space-between",
	},
	marginTop10: {
		marginTop: 10,
	},
	blockWidth: {
		width: "75%"
	},
	buttonsWidth: {
		width: "20%"
	},
	amountText: {
		margin: 3
	},
	paddingLeft: {
		paddingLeft: 10,
	},
	paddingBottom: {
		paddingBottom: 10,
	}
});