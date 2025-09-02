import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//screns
import Intro from '../screen/intro/intro'
import Login from '../screen/login/login'
import Register from '../screen/register/register'
import ChangeRecord from '../screen/changeRecord/changeRecord'
import Home from '../screen/home/home'

const Stack = createStackNavigator();

export default function Routes() {
    return(
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Intro"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen
                    name="Intro"
                    component={Intro}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                />
                <Stack.Screen
                    name="Register"
                    component={Register}
                />
                <Stack.Screen
                    name="ChangeRecord"
                    component={ChangeRecord}
                />

                <Stack.Screen
                    name="Home"
                    component={Home}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}