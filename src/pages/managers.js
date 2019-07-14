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
                        renderItem={ (internalItem) => this.renderListUsers(internalItem) }
                        extraData={ this.state.orders }
                    />
                </ScrollView>
            </View>);
    }

    async getAllOrderOnWeek() {
        const orders = await FoodService.getAllOrdersOnWeek();
        this.setState({ orders });
    }

    renderListUsers({ item }) {
        return (<View key={ item.name }>
            <Text style={ TEXT_STYLES.header }>{ `${ item.name } (${ item.costOnWeek }р)` }</Text>
            <FlatList
                data={ item.order }
                renderItem={ (internalItem) => this.renderListItems(internalItem) }
                extraData={ item.order } />
        </View>);
    }

    renderListItems({ item }) {
        return (<View key={ item.date }>
            <Text>{ (item.date).toDateString() }</Text>
            <FlatList
                data={ item.foods }
                renderItem={ (internalItem) => this.renderFoodsList(internalItem) }
                extraData={ item.foods } />
        </View>);
    }

    renderFoodsList({ item }) {
        return (<BlockFoodDescription
            key={ item.name }
            name={ item.name }
            description={ item.description }
            amount={ item.amount }
            cost={ item.cost } />);
    }
}
