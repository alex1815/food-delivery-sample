import React, { Component } from 'react';

import {
  TabNavigator,
  StackNavigator,
} from 'react-navigation';

import { ROUTES } from "../share/routesList";

import { DeliveredToday } from "./deliveredToday";
import { OrderFood } from "./orderFood";
import { AuthorizationScreen } from "./authoriaztion";
import { ManagerScreen } from "./managers";

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

export const app = StackNavigator(stackNavigatorRouting);
