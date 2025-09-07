import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import Intro from '../screen/intro/intro';
import Login from '../screen/login/login';
import Register from '../screen/register/register';
import ChangeRecord from '../screen/changeRecord/changeRecord';
import Home from '../screen/home/home';

import { AuthContext } from '../contexts/auth';
import Loading from '../components/loading/loading'; // seu componente de loading

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
          // Usuário logado → Home
          <Stack.Screen name="Home" component={Home} />
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
