import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Colors from '../constaint/Colors';
import { NavigationContainer } from '@react-navigation/native';

import LogOutScreen from '../screens/LogOutScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';
import DeviceOverviewScreen from '../screens/transport/DeviceOverviewScreen';
//import TripOverviewScreen from '../screens/transport/TripOverviewScreen';
//import TripDetailScreen from '../screens/transport/TripDetailScreen';
import VehicleLocationScreen from '../screens/transport/VehicleLocationScreen';
import NotificationScreen from '../screens/transport/NotificationScreen';
import PermisionScreen from '../screens/transport/PermisionScreen';
//import TripMapScreen from '../screens/transport/TripMapScreen';


const DeviceStack = createStackNavigator();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const DeviceTab = createBottomTabNavigator();



const DeviceNavigator = () => {
    return (
        <DeviceStack.Navigator screenOptions={
            {
                headerStyle: {
                    backgroundColor: Colors.primary
                },
                headerTintColor: 'white',


            }
        }>
            <DeviceStack.Screen name="DeviceTabNavigator" component={DeviceTabNavigator} />
            <DeviceStack.Screen name="VehicleLocationScreen" component={VehicleLocationScreen} />
            <DeviceStack.Screen name="NotificationScreen" component={NotificationScreen} />
            
          
        </DeviceStack.Navigator>

    );

}

const DeviceTabNavigator = () => {
    return (
        <DeviceTab.Navigator>
            
            <DeviceTab.Screen name="DeviceOverviewScreen" component ={DeviceOverviewScreen} />
            <DeviceTab.Screen name="PermisionScreen" component ={PermisionScreen} />

            
        
        </DeviceTab.Navigator>
    )
}



const TransportNavigator = () => {
    return (

        <Drawer.Navigator drawerContentOptions={{


            activeTintColor: Colors.primary,


        }} >
            <Drawer.Screen  name="DeviceNavigator" component={DeviceNavigator} />
            <Drawer.Screen  name="LogOutScreen" component={LogOutScreen} />



        </Drawer.Navigator>

    );
}


const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={
            {
                headerStyle: {
                    backgroundColor: Colors.primary
                },
                headerTintColor: 'white',


            }
        }>
            <AuthStack.Screen name="AuthScreen" component={AuthScreen} />


        </AuthStack.Navigator>

    );

}



const MainNavigator = () => {
    return (
        <NavigationContainer>
            <MainStack.Navigator mode="modal" screenOptions={
                {
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: Colors.primary
                    },
                    headerTintColor: 'white',



                }
            }>
                <MainStack.Screen name="StartUpScreen" component={StartUpScreen} />


                <MainStack.Screen name="AuthNavigator" component={AuthNavigator} />



                <MainStack.Screen name="TransportNavigator" component={TransportNavigator} />



            </MainStack.Navigator>
        </NavigationContainer>

    );

}


export default MainNavigator;





