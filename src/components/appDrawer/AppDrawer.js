
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { colors } from '../../colors/colors';
import Feather from '@expo/vector-icons/Feather';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import Home from '../../screen/home/home';
import Sobre from "../../screen/sobre/sobre";
import Agendamentos from '../../screen/agendamentos/agendamentos';
import stylesDrawer from './style';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  
  const { user, logout } = useContext(AuthContext);

  function getFirstName(string) {
    if (!string) return "";
    const firstName = string.split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <DrawerContentScrollView {...props} style={{ backgroundColor: colors.white }} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={stylesDrawer.header}>
          <Image source={require('../../image/logo/icon.png')} style={stylesDrawer.logo} />
          <Text style={stylesDrawer.greetingText}>
            👋 Olá, <Text style={stylesDrawer.greetingName}>{user?.name ? getFirstName(user.name) : 'Usuário'}</Text>!
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: colors.white }}>
          <DrawerItemList {...props} labelStyle={{ color: colors.secondary, fontWeight: 'bold', fontSize: 16 }} activeTintColor={colors.primary} inactiveTintColor={colors.secondary} />
        </View>
        
      </DrawerContentScrollView>
      <View style={stylesDrawer.logoutContainer}>
        <TouchableOpacity onPress={logout} style={stylesDrawer.logoutBtn}>
          <Feather name="log-out" size={22} color={colors.secondary} />
          <Text style={stylesDrawer.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


export default function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: colors.secondary,
        drawerInactiveTintColor: colors.darkGray,
        drawerLabelStyle: { fontWeight: 'bold', fontSize: 16 },
        drawerStyle: { backgroundColor: colors.white },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Início',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Agendar"
        component={Agendamentos}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Sobre"
        component={Sobre}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
