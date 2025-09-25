import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppDrawer from '../components/appDrawer/AppDrawer';

// Screens
import Intro from '../screens/intro/Intro';
import Login from '../screens/login/Login';
import Register from '../screens/register/Register';
import ChangeRecord from '../screens/changeRecord/ChangeRecord';

import { AuthContext } from '../contexts/Auth';
import { ActivityIndicator } from "react-native";
import { colors } from "../themes/colors/Colors";

const Stack = createStackNavigator();

export default function Routes() {
  const { user, initializing } = useContext(AuthContext);

  if (initializing) {
    return <ActivityIndicator size="large" color={ colors.secondary} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="AppDrawer" component={AppDrawer} options={{ headerShown: false }} />

        ) : (

          <>
            <Stack.Screen name="Intro" component={Intro} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ChangeRecord" component={ChangeRecord} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
