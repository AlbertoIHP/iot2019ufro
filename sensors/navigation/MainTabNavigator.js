import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import LuxScreen from '../screens/LuxScreen';
import HumidityScreen from '../screens/HumidityScreen';
import TemperatureScreen from '../screens/TemperatureScreen';

//Este representa un stack, con todas las vistas que incluyan o relacionen esta tab.
const LightSensorTabStack = createStackNavigator({
  Home: LuxScreen,
});

LightSensorTabStack.navigationOptions = {
  tabBarLabel: 'Luz', //Nombre del tab
  tabBarIcon: ({ focused }) => ( //Componente que se dibujara en la tab
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-sunny'
          : 'ios-sunny'
      }
    />
  ),
};

const TemperatureSensorTabStack = createStackNavigator({
  Links: TemperatureScreen,
});

TemperatureSensorTabStack.navigationOptions = {
  tabBarLabel: 'Temperatura',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-thermometer' : 'ios-thermometer'}
    />
  ),
};

const HumiditySensorTabStack = createStackNavigator({
  Settings: HumidityScreen,
});

HumiditySensorTabStack.navigationOptions = {
  tabBarLabel: 'Humedad',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'md-water' : 'md-water'}
    />
  ),
};

export default createBottomTabNavigator({
  LightSensorTabStack,
  TemperatureSensorTabStack,
  HumiditySensorTabStack,
});
