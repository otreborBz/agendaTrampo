import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useContext } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../../contexts/Auth';
import Agendamentos from '../../screens/agendamentos/Agendamentos';
import Home from '../../screens/home/Home';
import Sobre from "../../screens/sobre/Sobre";
import { colors } from '../../themes/colors/Colors';
import style from './styles';

const Drawer = createDrawerNavigator();

function CustomDrawer(props) {
  const { user, signOut } = useContext(AuthContext);

  function getFirstName(fullName) {
    if (!fullName || typeof fullName !== 'string') return "Usuário";
    const firstName = fullName.split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Cabeçalho */}
      <View style={style.cabecalho}>
        <Image
          source={require('../../../assets/icon.png')}
          style={style.cabecalhoImage}
        />
        <Text style={style.cabecalhoText}>
          Olá, {getFirstName(user?.name)}
        </Text>
      </View>

      {/* Itens de Navegação Roláveis */}
      <DrawerContentScrollView {...props} style={{ backgroundColor: colors.white }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Rodapé Fixo com Botão Sair */}
      <View style={style.rodapeContainer}>
        <TouchableOpacity onPress={() => signOut()} style={style.rodapeContent}>
          <Ionicons name="exit-outline" size={22} color={colors.text} />
          <Text style={style.rodapeText}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Início"
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerTitleStyle: {
          color: colors.white,
          fontWeight: 'bold',
          fontSize: 18,
          marginLeft: 10,
          marginRight: 10,
        },
        headerTintColor: colors.white, // Cor do ícone do menu (hamburger) e do botão de voltar
        drawerActiveBackgroundColor: colors.secondary,
        drawerActiveTintColor: colors.white,
        drawerInactiveTintColor: colors.text, // Revertendo para a cor original do texto inativo
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: 'bold',
          marginLeft: 10,
          marginRight: 10,
        }

      }}
    >
      <Drawer.Screen
        name="Início"
        component={Home}
        options={{
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
