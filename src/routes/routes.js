import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppDrawer from '../components/appDrawer/AppDrawer';

// Screens
import Intro from '../screen/intro/intro';
import Login from '../screen/login/login';
import Register from '../screen/register/register';
import ChangeRecord from '../screen/changeRecord/changeRecord';
import Agendamentos from "../screen/agendamentos/agendamentos";

import { AuthContext } from '../contexts/auth';
import Loading from '../components/loading/loading';

const Stack = createStackNavigator();

export default function Routes() {
  const { user, initializing } = useContext(AuthContext);

  if (initializing) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Usuário logado → Drawer
          <Stack.Screen name="AppDrawer" component={AppDrawer} options={{ headerShown: false }} />
          // <Stack.Screen name="Agendamentos" component={Agendamentos} />
        ) : (
          // Usuário não logado → Intro/Login/Register
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
