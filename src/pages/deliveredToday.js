import React, { Component } from 'react';

import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ScrollView,
	TouchableHighlight,
  } from 'react-native';

  import { NavigationActions } from 'react-navigation';

import { BlockFoodDescription, TouchableButton, FlexBlock } from "../components/exportCopmonents";
import { FoodService } from "../services/foodService";
import { PAGE_STYLES, TEXT_STYLES } from "../share/styles";
import { canChangeOrder, getCurrentDayInRussia } from "../helpers/helpers";

import { RoleService } from "../services/roleService";
import { ROUTES } from "../share/routesList";

const MESSAGE = {
	FOOD_READY: "Еду принесли!",
	NO_FOOD: "Вы не заказывали еду на сегодня",
}

const LIST_OF_DAYS = [];
const MONDAY = FoodService.getMondayForOrder();

const NAMES_OF_DAYS = [
	"Понедельник",
	"Вторник",
	"Среда",
	"Четверг",
	"Пятница"
]

const DESCRIPTION_OF_DAYS = {
	ORDERED: "Редактировать заказ",
	NEW_ORDER: "Заказать",
}

export class DeliveredToday extends React.Component {
	static navigationOptions = {
		title: "Заказ на сегодня"
	}

	constructor(props){
		super(props);

		this._foodReady = this._foodReady.bind(this);
		this._removeOrder = this._removeOrder.bind(this);
		this._renderListOfDays = this._renderListOfDays.bind(this);
		this._renderListItem = this._renderListItem.bind(this);
		this._orderFoodOnDay = this._orderFoodOnDay.bind(this);
		this._navigateToAllOrders = this._navigateToAllOrders.bind(this);

		this.listOfDays = [];
		generateListOfDays();
		this.state = {
			foodsToday: [],
			ready: false,
			loaded: false,
			currentSumOnWeek: 0,
			itemForDeleting: null,
			isManager: false,
		};
	}

	async componentDidMount() {
		const foodsToday = await FoodService.getMyOrderByDate(new Date());
		this.listOfDays = await this._getListOfDays();
		const currentSumOnWeek = await FoodService.getMySumOfOrderOnWeek();
		const isManager = await RoleService.iIsManager();

		this.setState({ foodsToday, currentSumOnWeek, isManager },
			() => this.setState({ loaded: true })
		);
	}
		
	render() {
		return (
			<View style={[PAGE_STYLES.pageWithScrool]}>
				<ScrollView style={[PAGE_STYLES.scrollForPageWithScroll]}>
				{ this.state.loaded
				? <View>{
						this.state.foodsToday && this.state.foodsToday.length > 0
						? <View>
								<Text style={[TEXT_STYLES.header]}>Заказ на сегодня:</Text>
								<FlatList
									data={ this.state.foodsToday }
									renderItem={ this._renderListItem }
									extraData={this.state}
								/>
								{
									this.state.isManager
										?<TouchableButton
										title={"Перейти ко всем заказам"}
										onPress={this._navigateToAllOrders}
										style={styles.shiftDown} />
									: null
								}
								<View style={styles.shiftDown}>{
									this.state.ready
									? <Text style={[TEXT_STYLES.header]}>{ MESSAGE.FOOD_READY }</Text>
									: <TouchableButton onPress={this._foodReady} title={ MESSAGE.FOOD_READY }/>
								}</View>

								<Text style={[TEXT_STYLES.header, styles.shiftDown]}>{`Заказ на неделю с ${MONDAY.getDate()} по ${FoodService.getSundayForOrder().getDate()}:`}</Text>
								<FlatList
									data={ this.listOfDays }
									renderItem={ this._renderListOfDays }
									extraData={this.state}
								/>

								<View>
									<Text style={[TEXT_STYLES.subHeader, styles.shiftDown]}>{`Сумма к оплате за неделю: ${this.state.currentSumOnWeek}р.`}</Text>
								</View>
						</View>
						: <Text style={[TEXT_STYLES.header]}>{ MESSAGE.NO_FOOD }</Text>
					}</View>
				: <Text style={[TEXT_STYLES.header]}>Загрузка...</Text>
				}
				</ScrollView>
			</View>
		);
	}

	_renderListItem({item}) {
		return ( <BlockFoodDescription 
			name={item.name}
			description={item.description}
			amount={item.amount} />)
	}

	_renderListOfDays({item}) {
		const CAN_CHANGE_ORDER = item.description === DESCRIPTION_OF_DAYS.ORDERED 
								 && canChangeOrder(item.date);
		return (<View>
					<View style={[styles.flex]}>
					
						<TouchableHighlight onPress={()=>this._orderFoodOnDay(item)}>
							<View>
								<FlexBlock name={item.name} 
									description={item.description} 
									blockWidth={CAN_CHANGE_ORDER ? styles.blockWithButton : styles.blockWithoutButton }
									/>
							</View>
						</TouchableHighlight>

						<View>{
							CAN_CHANGE_ORDER
							? <TouchableButton
									title={"X"}
									onPress={()=>this._showAcceptionOfDeleting(item)}
									style={styles.removeButton} 
									/>
							: null
						}</View>
					</View>
					<View>{
							this.state.itemForDeleting && this.state.itemForDeleting === item
							? <TouchableButton title={`Удалить заказ на ${item.name.toLowerCase()}?`} onPress={this._removeOrder}/>
							: null
					}</View>
				</View>);
	}

	_foodReady() {
		FoodService.foodsReady();
		this.setState({ ready: true });
	}

	async _getListOfDays() {
		const foodsOnWeek = await FoodService.getMyOrderOnWeek();
		const res = [];
		LIST_OF_DAYS.map( (day) => {
			const isFound = foodsOnWeek.find( (dateAndFood) => {
				return dateAndFood.date.getDay() === day.day;
			});
			// TODO - check what orfers from server have a same start day (monday)
			res.push({ name: day.name, description: isFound ? DESCRIPTION_OF_DAYS.ORDERED : DESCRIPTION_OF_DAYS.NEW_ORDER, date: new Date(day.date) });
		});

		return res;
	}

	_showAcceptionOfDeleting(itemForDeleting) {
		this.state.itemForDeleting === itemForDeleting
		? this.setState({ itemForDeleting : null })
		: this.setState({ itemForDeleting });
	}

	_removeOrder(item) {
		FoodService.cancelOrder(this.state.itemForDeleting.date)
			.then( () => {
				this.setState({itemForDeleting: null});
			});
	}

	_orderFoodOnDay(item) {
		const navigateAction = NavigationActions.navigate({
			routeName: ROUTES.ORDER_FOOD,
			params: { date: (new Date(item.date.getTime())) },
		});

		this.props.navigation.dispatch(navigateAction);
	}

	_navigateToAllOrders() {
		this.props.navigation.navigate(ROUTES.MANAGER_SCREEN);
	}
}

const styles = StyleSheet.create({
	flex: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	shiftDown: {
		paddingTop: 15
	},
	blockWithButton: {
		width: "90%",
	},
	blockWithoutButton: {
		width: "100%",
	},
});

function generateListOfDays() {
	NAMES_OF_DAYS.map( (name, i) => {
		LIST_OF_DAYS.push({
			day: i,
			name,
			date: (new Date()).setDate(MONDAY.getDate() + i),
		});
	});
}
