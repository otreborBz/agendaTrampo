
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../contexts/auth';
import { colors } from '../colors/colors';
import Feather from '@expo/vector-icons/Feather';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import Home from '../screen/home/home';
import Sobre from "../screen/sobre/sobre";

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
          <Image source={require('../image/logo/icon.png')} style={stylesDrawer.logo} />
          <Text style={stylesDrawer.greetingText}>
            👋 Olá, <Text style={stylesDrawer.greetingName}>{user?.name ? getFirstName(user.name) : 'Usuário'}</Text>!
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: colors.white, paddingTop: 8 }}>
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

const stylesDrawer = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    borderRadius: 30,
  },
  greetingText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  greetingName: {
    fontWeight: 'bold',
    color: colors.secondary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 6,
    borderRadius: 8,
  },
  logoutText: {
    marginLeft: 6,
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    backgroundColor: colors.white,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
});

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
