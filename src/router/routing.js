import {
    TabNavigator,
    StackNavigator,
} from "react-navigation";

import { ROUTES } from "./routes";

import { DeliveredToday } from "../pages";
import { OrderFood } from "../pages";
import { AuthorizationScreen } from "../pages";
import { ManagerScreen } from "../pages";

const { DELIVERED_TODAY, ORDER_FOOD, AUTHORIZATION, HOME, MANAGER_SCREEN, TABS } = ROUTES;

const tabNavigatorRoutes = {};
tabNavigatorRoutes[ DELIVERED_TODAY ] = { screen: DeliveredToday };
tabNavigatorRoutes[ ORDER_FOOD ] = { screen: OrderFood };

const TabNavigatorSceen = new TabNavigator(tabNavigatorRoutes);

const stackNavigatorRouting = {
    [ HOME ]: { screen: AuthorizationScreen },
    [ TABS ] : { screen: TabNavigatorSceen },
    [ AUTHORIZATION ] : { screen: AuthorizationScreen },
    [ MANAGER_SCREEN ] : { screen: ManagerScreen }
};

const app = StackNavigator(stackNavigatorRouting);

export default app;
