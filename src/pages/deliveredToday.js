import React from "react";

import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ScrollView,
    TouchableHighlight,
} from "react-native";

import { NavigationActions } from "react-navigation";

import { BlockFoodDescription, TouchableButton, FlexBlock } from "../components";
import { FoodService } from "../services/foodService";
import { PAGE_STYLES, TEXT_STYLES } from "../share/styles";
import { canChangeOrder, generateListOfDays } from "../helpers";

import { RoleService } from "../services/roleService";
import { ROUTES } from "../share/routesList";

const MESSAGE = {
    FOOD_IS_READY: "Food is here!",
    NO_FOOD: "You didn't order food for today",
    MOVE_TO_ALL_ORDER: "Move to all order",
    ORDER_FOR_TODAY: "Order for today",
    ORDER_ON_WEEK_FROM: "Orders on week from",
    ORDER_ON_WEEK_TO: "to",
    SUM_FOR_PAY: "Bill",
    LOADING: "Loading...",
    REMOVE_ORDER_FOR: "Remove order for"
}

const TAB_TITLE = "Order for today";

const MONDAY = FoodService.getMondayForOrder();
const LIST_OF_DAYS = generateListOfDays(MONDAY);

const DAYS_DESCRIPTION = {
    ORDERED: "Change order",
    NEWORDER: "Order",
}

export class DeliveredToday extends React.Component {
    static navigationOptions = {
        title: TAB_TITLE
    }

    constructor(props) {
        super(props);

        this.listOfDays = [];
        this.state = {
            foodsToday: [],
            isReady: false,
            isLoaded: false,
            currentSumOnWeek: 0,
            itemForDeleting: null,
            isManager: false,
        };
    }

    async componentDidMount() {
        const foodsToday = await FoodService.getMyOrderByDate(new Date());
        this.listOfDays = await this.getListOfDays();
        const currentSumOnWeek = await FoodService.getMySumOfOrderOnWeek();
        const isManager = await RoleService.isManager();

        this.setState({ foodsToday, currentSumOnWeek, isManager },
            () => this.setState({ isLoaded: true })
        );
    }

    render() {
        const { isLoaded, foodsToday, isManager, isReady, currentSumOnWeek } = this.state;
        return (
            <View style={ [ PAGE_STYLES.pageWithScrool ] }>
                <ScrollView style={ [ PAGE_STYLES.scrollForPageWithScroll ] }>
                    { isLoaded
                        ? <View>{
                            foodsToday && foodsToday.length > 0
                                ? <View>
                                    <Text style={ [ TEXT_STYLES.header ] }>{ MESSAGE.ORDER_FOR_TODAY }</Text>
                                    <FlatList
                                        data={ foodsToday }
                                        renderItem={ (item) => this.renderListItem(item) }
                                        extraData={ this.state }
                                    />
                                    {
                                        isManager && <TouchableButton
                                            title={ MESSAGE.MOVE_TO_ALL_ORDER }
                                            onPress={ () => this.navigateToAllOrders() }
                                            style={ styles.shiftDown } />
                                    }
                                    <View style={ styles.shiftDown }>{
                                        isReady
                                            ? <Text style={ [ TEXT_STYLES.header ] }>{ MESSAGE.FOOD_IS_READY }</Text>
                                            : <TouchableButton onPress={ () => this.foodIsReady() } title={ MESSAGE.FOOD_IS_READY } />
                                    }</View>

                                    <Text style={ [ TEXT_STYLES.header, styles.shiftDown ] }>
                                        { `${ MESSAGE.ORDER_ON_WEEK_FROM } ${ MONDAY.getDate() } ${ MESSAGE.ORDER_ON_WEEK_TO } ${ FoodService.getSundayForOrder().getDate() }:` }
                                    </Text>
                                    <FlatList
                                        data={ this.listOfDays }
                                        renderItem={ (item) => this.renderListOfDays(item) }
                                        extraData={ this.state }
                                    />

                                    <View>
                                        <Text style={ [ TEXT_STYLES.subHeader, styles.shiftDown ] }>{ `${ MESSAGE.SUM_FOR_PAY } : ${ currentSumOnWeek }р.` }</Text>
                                    </View>
                                </View>
                                : <Text style={ [ TEXT_STYLES.header ] }>{ MESSAGE.NO_FOOD }</Text>
                        }</View>
                        : <Text style={ [ TEXT_STYLES.header ] }>{ MESSAGE.LOADING }</Text>
                    }
                </ScrollView>
            </View>
        );
    }

    renderListItem({ item }) {
        return (<BlockFoodDescription
            name={ item.name }
            description={ item.description }
            amount={ item.amount } />)
    }

    renderListOfDays({ item }) {
        const isCanChangeOrder = item.description === DAYS_DESCRIPTION.ORDERED && canChangeOrder(item.date);
        return (<View>
            <View style={ [ styles.flex ] }>

                <TouchableHighlight onPress={ () => this.orderFoodOnDay(item) }>
                    <View>
                        <FlexBlock name={ item.name }
                            description={ item.description }
                            blockWidth={ isCanChangeOrder ? styles.blockWithButton : styles.blockWithoutButton }
                        />
                    </View>
                </TouchableHighlight>

                <View>{
                    isCanChangeOrder && <TouchableButton
                        title={ "x" }
                        onPress={ () => this.setItemForDeleting(item) }
                        style={ styles.removeButton }
                    />
                }</View>
            </View>
            <View>{
                this.state.itemForDeleting && this.state.itemForDeleting === item &&
                <TouchableButton title={ `${ MESSAGE.REMOVE_ORDER_FOR } ${ item.name.toLowerCase() }?` } onPress={ (item) => this.removeOrder(item) } />
            }</View>
        </View>);
    }

    async foodIsReady() {
        await FoodService.foodsReady();
        this.setState({ isReady: true });
    }

    async getListOfDays() {
        const foodsOnWeek = await FoodService.getMyOrderOnWeek();
        const res = [];
        LIST_OF_DAYS.map(({ day, name, date }) => {
            const isFound = foodsOnWeek.find((dateAndFood) => {
                return dateAndFood.date.getDay() === day;
            });
            // TODO - check what orfers from server have same first day of week (monday)
            res.push({
                name,
                description: isFound ? DAYS_DESCRIPTION.ORDERED : DAYS_DESCRIPTION.NEWORDER,
                date: new Date(date)
            });
        });

        return res;
    }

    setItemForDeleting(itemForDeleting) {
        this.state.itemForDeleting === itemForDeleting
            ? this.setState({ itemForDeleting: null })
            : this.setState({ itemForDeleting });
    }

    removeOrder() {
        FoodService.cancelOrder(this.state.itemForDeleting.date)
            .then(() => {
                this.setState({ itemForDeleting: null });
            });
    }

    orderFoodOnDay(item) {
        const navigateAction = NavigationActions.navigate({
            routeName: ROUTES.ORDER_FOOD,
            params: { date: (new Date(item.date.getTime())) },
        });

        this.props.navigation.dispatch(navigateAction);
    }

    navigateToAllOrders() {
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
        width: "98%",
    },
});
