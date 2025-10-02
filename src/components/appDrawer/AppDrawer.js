import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { useContext, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../../contexts/Auth';
import Agendamentos from '../../screens/agendamentos/Agendamentos';
import Home from '../../screens/home/Home';
import Sobre from "../../screens/sobre/Sobre";
import { colors } from '../../themes/colors/Colors';
import ActionAlert from '../actionAlert/actionAlert';
import style from './styles';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function CustomDrawer(props) {
  const { user, signOut, deleteAccount } = useContext(AuthContext);
  const [actionAlertVisible, setActionAlertVisible] = useState(false);

  function getFirstName(fullName) {
    if (!fullName || typeof fullName !== 'string') return "Usuário";
    const firstName = fullName.split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
  }

  function handleDeleteAccount() {
    setActionAlertVisible(true);
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Cabeçalho */}
      <View style={style.cabecalho}>
        <Image
          source={require('../../../assets/iconName.png')}
          style={style.cabecalhoImage}
        />
        <Text style={style.cabecalhoText}>
          <Text style={style.greetingText}>Olá, </Text>
          <Text style={style.greetingName}>{getFirstName(user?.name)}</Text>
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

        <TouchableOpacity onPress={handleDeleteAccount} style={[style.rodapeContent, { marginTop: 10 }]}>
          <Ionicons name="trash-outline" size={22} color={colors.error} />
          <Text style={[style.rodapeText, { color: colors.error }]}>
            Excluir Conta
          </Text>
        </TouchableOpacity>
      </View>

      <ActionAlert
        visible={actionAlertVisible}
        title="Excluir Conta"
        message="Você tem certeza que deseja excluir sua conta? Todos os seus dados, incluindo agendamentos, serão apagados permanentemente. Esta ação não pode ser desfeita."
        onClose={() => setActionAlertVisible(false)}
        actions={[
          { text: "Cancelar", onPress: () => setActionAlertVisible(false) },
          {
            text: "Excluir",
            destructive: true,
            onPress: async () => {
              setActionAlertVisible(false);
              const result = await deleteAccount();
              if (!result.success) {
                // Usamos o Alert nativo para erros inesperados, pois é um fluxo secundário.
                Alert.alert("Erro", result.message);
              }
              // Se for sucesso, o onAuthStateChanged cuidará de redirecionar o usuário.
            },
          },
        ]}
      />
    </View >
  );
}

function DrawerNav() {
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

// Navegador Raiz que controla o Drawer e os Modais de tela cheia
export default function AppDrawer() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DrawerNav"
        component={DrawerNav}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Agendar"
        component={Agendamentos}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          transitionSpec: {
            open: {
              animation: 'timing',
              config: { duration: 600 },
            },
            close: {
              animation: 'timing',
              config: { duration: 600 },
            },
          },
        }}
      />
    </Stack.Navigator>
  );
}
