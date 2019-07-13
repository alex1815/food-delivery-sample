import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
	FlatList,
	ScrollView,
} from 'react-native';

import { BlockFoodDescription, MyButton, FlexBlock } from "../components/exportCopmonents";
import { PAGE_STYLES, TEXT_STYLES } from "../share/styles";
import { FoodService } from "../services/foodService";

export class ManagerScreen extends React.Component {
	static navigationOptions = {
		title: "Все заказы"
	}

	constructor(props){
		super(props);

		this._renderFoodsList = this._renderFoodsList.bind(this);
		this._renderListItems = this._renderListItems.bind(this);
		this._renderListUsers = this._renderListUsers.bind(this);

		this.state = {
			orders: []
		};
	}

	async componentDidMount() {
		this._getAllOrderOnWeek();
	}

	render() {
		return (
			<View style={[PAGE_STYLES.pageWithScrool]}>
				<ScrollView style={[PAGE_STYLES.scrollForPageWithScroll]}>
					<FlatList
						data={ this.state.orders }
						renderItem={ this._renderListUsers }
						extraData={this.state.orders }
					/>
				</ScrollView>
			</View>);
	}

	async _getAllOrderOnWeek() {
		const orders = await FoodService.getAllOrdersOnWeek();
		this.setState({ orders });
	}

	_renderListUsers({item}) {
		return (<View>
			<Text style={TEXT_STYLES.header}>{`${item.name} (${item.costOnWeek}р.)`}</Text>
				<FlatList
					data={ item.order }
					renderItem={ this._renderListItems }
					extraData={ item.order } />
			</View>);
	}

	_renderListItems({ item }) {
		return (<View>
					<Text>{ (item.date).toDateString()}</Text>
					<FlatList
						data={ item.foods }
						renderItem={ this._renderFoodsList }
						extraData={ item.foods } />
				</View>);
	}

	_renderFoodsList({item}) {
		return ( <BlockFoodDescription
			name={item.name}
			description={item.description}
			amount={item.amount}
			cost={item.cost} />);
	}
}

const styles = StyleSheet.create({
	title: {
	  fontSize: 30,
	  alignSelf: 'center',
	  marginBottom: 50
	},
});
