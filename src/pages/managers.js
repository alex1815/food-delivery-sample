import React from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ScrollView,
} from "react-native";

import { BlockFoodDescription } from "../components";
import { PAGE_STYLES, TEXT_STYLES } from "../share/styles";
import { FoodService } from "../services/foodService";

const PAGE_TITLE = "All orders"

export class ManagerScreen extends React.Component {
    static navigationOptions = {
        title: PAGE_TITLE
    }

    constructor(props) {
        super(props);

        this.state = {
            orders: []
        };

        this.renderListUsers = this.renderListUsers.bind(this);
        this.renderListOrders = this.renderListOrders.bind(this);
        this.renderListFoods = this.renderListFoods.bind(this);
    }

    async componentDidMount() {
        await this.getAllOrderOnWeek();
    }

    render() {
        return (
            <View style={ [ PAGE_STYLES.pageWithScrool ] }>
                <ScrollView style={ [ PAGE_STYLES.scrollForPageWithScroll ] }>
                    <FlatList
                        data={ this.state.orders }
                        renderItem={ this.renderListUsers }
                        extraData={ this.state.orders }
                    />
                </ScrollView>
            </View>);
    }

    async getAllOrderOnWeek() {
        const orders = await FoodService.getAllOrdersOnWeek();
        this.setState({ orders });
    }

    renderListUsers({ item: user }) {
        return (<View key={ user.name }>
            <Text style={ TEXT_STYLES.header }>{ `${ user.name } (${ user.costOnWeek }р)` }</Text>
            <FlatList
                data={ user.order }
                renderItem={ this.renderListOrders }
                extraData={ user.order } />
        </View>);
    }

    renderListOrders({ item: order }) {
        return (<View key={ order.date }>
            <Text>{ (order.date).toDateString() }</Text>
            <FlatList
                data={ order.foods }
                renderItem={ this.renderListFoods }
                extraData={ order.foods } />
        </View>);
    }

    renderListFoods({ item: food }) {
        return (<BlockFoodDescription
            key={ food.name }
            name={ food.name }
            description={ food.description }
            amount={ food.amount }
            cost={ food.cost } />);
    }
}
