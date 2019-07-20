import React from "react";

import {
    StyleSheet,
    Text,
    View,
    SectionList,
    ScrollView,
} from "react-native";

import { TouchableButton, IncreaseAmount, DecreaseAmount, NextDayButton, BackDayButton, BlockFoodDescription } from "../components";
import { FoodService } from "../services/foodService";
import { PAGE_STYLES, TEXT_STYLES } from "../share/styles";
import { FoodTypes, CurrentOrderItem } from "../models";
import { mapInPreparedFoodsList, canChangeOrder } from "../helpers";

const STATE = {
    LOADING_DATA: "Loading...",
    LOADING_ORDER: "Sending order...",
    LOADED_ORDER_SUCCESS: "Order was successfully sent!",
    LOADING_ORDER_ERROR: "Error during sending. Please try again.",
    DONE: ""
};

const MESSAGE = {
    CURRENT_ORDER: "Current order",
    PRICE: "Price of current order",
    SEND_ORDER: "Order",
    CAN_NOT_ORDER: "You can't order on this date"
}

const PAGE_TITLE = "Send order";

const SECONDS_FOR_SHOWING_MESSAGE = 1.5;

export class OrderFood extends React.Component {
    static navigationOptions = {
        title: PAGE_TITLE
    }

    constructor(props) {
        super(props);

        this.state = {
            message: STATE.LOADING_DATA,
            foods: [],
            date: new Date(),
            changed: false,
            currentOrders: [],
            currentSum: 0,
        };

        this.setNewDate = this.setNewDate.bind(this);
        this.renderListFoods = this.renderListFoods.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.orderFood = this.orderFood.bind(this);
        this.showButtonsForChangingAmount = this.showButtonsForChangingAmount.bind(this);
    }

    componentDidMount() {
        this.loadDataByDateFromState();
    }

    componentWillReceiveProps(nextProps) {
        const { params } = nextProps.navigation.state;
        if (params && params.date && params.date != this.state.date) {
            this.setState({ date: params.date }, this.loadDataByDateFromState);
        }
    }

    render() {
        const { date, message, foods, currentOrders, currentSum } = this.state;

        // can use memoization here (check preporty manualy and they are same - return saved copy) - slighty improve performance
        const currentOrdersView = currentOrders.length > 0
            ? <View style={ styles.paddingBottom }>
                <Text style={ [ TEXT_STYLES.header ] }>{ MESSAGE.CURRENT_ORDER }</Text>
                <Text style={ [ TEXT_STYLES.header, styles.paddingLeft ] }>
                    { currentOrders.map(({ name, amount }) => `${ name }(${ amount })`).join(", ") }
                </Text>
                <Text style={ [ TEXT_STYLES.header ] }>{ MESSAGE.PRICE }</Text>
                <Text style={ [ TEXT_STYLES.header, styles.paddingLeft ] }>{ `${ currentSum }р.` }</Text>
            </View>
            : null;

        const foodsForOrder = this.showButtonsForChangingAmount()
            ? <View>
                <SectionList
                    renderItem={ this.renderListFoods }
                    renderSectionHeader={ this.renderSectionHeader }
                    sections={ foods } />
                <TouchableButton style={ [ styles.marginTop10 ] } onPress={ this.orderFood } title={ MESSAGE.SEND_ORDER } />
            </View>
            : null;

        return (
            <View style={ [ PAGE_STYLES.pageWithScrool ] }>
                <ScrollView style={ [ PAGE_STYLES.scrollForPageWithScroll ] }>
                    <View style={ [ styles.row, styles.elementsByCenter ] }>
                        <BackDayButton
                            date={ date }
                            setNewDate={ this.setNewDate } />
                        <Text style={ [ TEXT_STYLES.header ] }>{ date.toDateString() }</Text>
                        <NextDayButton
                            date={ date }
                            setNewDate={ this.setNewDate } />
                    </View>
                    <View style={ [ styles.marginTop10 ] }>{
                        message === STATE.DONE
                            ? <View>{
                                foods.length > 0
                                    ? <View>
                                        <View>
                                            { currentOrdersView }
                                        </View>
                                        <View>
                                            { foodsForOrder }
                                        </View>
                                    </View>
                                    : <Text style={ [ TEXT_STYLES.header ] }>{ MESSAGE.CAN_NOT_ORDER }</Text>
                            }</View>
                            : <Text style={ [ TEXT_STYLES.header ] }>{ message }</Text>
                    }</View>
                </ScrollView>
            </View>
        );
    }

    renderSectionHeader({ section }) {
        return <Text style={ [ TEXT_STYLES.subHeader ] }> { `${ section.title }:` } </Text>;
    }

    renderListFoods({ item }) {
        const { name, description, cost, amount } = item;
        return <View style={ [ styles.row, styles.listItem ] }>
            <BlockFoodDescription
                key={ name }
                name={ name }
                description={ description }
                cost={ cost }
                content
                blockWidth={ styles.blockWidth } />
            {
                this.showButtonsForChangingAmount() &&
                <View style={ [ styles.row, styles.buttonsWidth ] }>
                    <IncreaseAmount value={ amount } setNewValue={ (newValue) => this.increaseAmount(item, newValue) } />
                    <Text style={ [ TEXT_STYLES.header, styles.amountText ] }>
                        { amount }
                    </Text>
                    <DecreaseAmount value={ amount } setNewValue={ (newValue) => this.decreaseAmount(item, newValue) } />
                </View>
            }
        </View>
    }

    setNewDate(dateMS) {
        this.setState({ date: new Date(dateMS) }, () => {
            this.loadDataByDateFromState();
        });
    }

    async loadDataByDateFromState() {
        const foods = await this.getDataByDateFromState();
        this.generateCurrentOrder(foods);
        this.setState({ foods }, () => this.setState({ message: STATE.DONE }));
    }

    async getDataByDateFromState() {
        this.setState({ message: STATE.LOADING_DATA });

        const data = await FoodService.getByDate(this.state.date);
        const preparedData = [];

        data && data.map((item) => {
            const foundValue = preparedData.find(({ title }) => title === item.type);
            if (foundValue) {
                foundValue.data.push(item);
            } else {
                preparedData.push({ data: [ item ], title: item.type });
            }
        });

        const result = preparedData.map(({ data, title }) => {
            const mappedTitle = FoodTypes.descriptions[ title ];
            return { data, title: mappedTitle };
        });

        return result;
    }

    async increaseAmount(item, newValue) {
        const increaseAmountIntoCurrentOrder = (foundItem, foundIndexOfItem, updatedCurrentOrder) => {
            let costOfCurrentItem;
            if (foundIndexOfItem > -1) {
                foundItem.amount += 1;
                costOfCurrentItem = foundItem.cost;
            } else {
                const { id, name, cost } = item;
                updatedCurrentOrder.push(new CurrentOrderItem({ id, name, amount: 1, cost }));
                costOfCurrentItem = cost;
            }
            this.setState({ currentSum: this.state.currentSum + costOfCurrentItem });
        };

        this.changeAmountIntoCurrentOrder(item, increaseAmountIntoCurrentOrder);
        this.updatedAmountForItem(item, newValue);
    }

    decreaseAmount(item, newValue) {
        const decreaseAmountIntoCurrentOrder = (foundItem, foundIndexOfItem, updatedCurrentOrder) => {
            if (foundIndexOfItem > -1) {
                if (foundItem.amount == 1) {
                    updatedCurrentOrder.splice(foundIndexOfItem, 1);
                } else {
                    foundItem.amount -= 1;
                }
                this.setState({ currentSum: this.state.currentSum - foundItem.cost });
            }
        };

        this.changeAmountIntoCurrentOrder(item, decreaseAmountIntoCurrentOrder);
        item.amount > 0 && this.updatedAmountForItem(item, newValue);
    }

    updatedAmountForItem(itemForUpdate, newAmount) {
        const foods = this.state.foods.slice();

        foods.filter(({ data }, j) => {
            return data.filter((item, i) => {
                if (item == itemForUpdate) {
                    foods[ j ].data[ i ].amount = newAmount;
                    return true;
                }
                return false;
            });
        });

        this.setState({ foods });
    }

    async orderFood() {
        const { foods, date } = this.state;
        this.setState({ message: STATE.LOADING_ORDER });

        const result = await FoodService.orderFood(foods, date);
        // here we can add some logger for keeping data about errors \ handle this in more clear way
        this.showTemporaryMessage(result.error ? STATE.LOADING_ORDER_ERROR : STATE.LOADED_ORDER_SUCCESS);
    }

    showTemporaryMessage(text, time = SECONDS_FOR_SHOWING_MESSAGE) {
        let self = this;
        this.setState({ message: text });
        setTimeout(() => {
            self.setState({ message: STATE.DONE });
        }, time * 1000);
    }

    changeAmountIntoCurrentOrder(item, changeAmountFunc) {
        const foundIndexOfItem = this.findIntoCurrentOrder(item);
        const updatedCurrentOrder = this.state.currentOrders.slice();

        if (foundIndexOfItem > -1) {
            let foundItem = updatedCurrentOrder[ foundIndexOfItem ];
            changeAmountFunc(foundItem, foundIndexOfItem, updatedCurrentOrder);
        } else {
            changeAmountFunc(null, foundIndexOfItem, updatedCurrentOrder);
        }

        this.setState({ currentOrders: updatedCurrentOrder });
    }

    findIntoCurrentOrder(item) {
        return this.state.currentOrders.findIndex(({ name }) => name === item.name);
    }

    generateCurrentOrder(newOrder) {
        const newCurrentOrder = [];
        let currentSum = 0;
        const getItems = ({ id, name, amount, cost }) => {
            if (amount > 0) {
                newCurrentOrder.push(new CurrentOrderItem({ id, name, amount, cost }));
                currentSum += cost * amount;
            }
        };

        mapInPreparedFoodsList(newOrder, getItems);
        this.setState({ currentOrders: newCurrentOrder, currentSum });
    }

    showButtonsForChangingAmount() {
        return canChangeOrder(this.state.date);
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    listItem: {
        justifyContent: "center",
        alignItems: "center"
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
