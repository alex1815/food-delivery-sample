import {
  TabNavigator,
  StackNavigator,
} from "react-navigation";

import { ROUTES } from "./routesList";

import { DeliveredToday } from "../pages";
import { OrderFood } from "../pages";
import { AuthorizationScreen } from "../pages";
import { ManagerScreen } from "../pages";

const { DELIVERED_TODAY, ORDER_FOOD, AUTHORIZATION, HOME, MANAGER_SCREEN } = ROUTES;

const tabNavigator = new TabNavigator({
    DELIVERED_TODAY: { screen: DeliveredToday },
    ORDER_FOOD: { screen: OrderFood },
});

const stackNavigatorRouting = {
    //TODO change home to authorization screen
    HOME: { screen: AuthorizationScreen },
    home: { screen: ManagerScreen },
    TABS: { screen: tabNavigator },
    AUTHORIZATION:  { screen: AuthorizationScreen },
    MANAGER_SCREEN: { screen: ManagerScreen },
}

const app = StackNavigator(stackNavigatorRouting);

export default app;
