import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import styles from './style';
import { colors } from '../../colors/colors';
import Feather from '@expo/vector-icons/Feather';
import { AuthContext } from '../../contexts/auth';

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  // Função para confirmar e realizar logout
async function handleLogout() {
  Alert.alert(
    "Sair",
    "Você realmente quer sair?",
    [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Sim",
        onPress: async () => {
          const success = await logout();
          if (!success) {
            Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
          }
  
        }
      }
    ],
    { cancelable: false }
  );
}

  //funcao para deixar aprimeira letra do usaurio maiuscula
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../../image/logo/icon.png')} style={styles.logo} />
        <View style={styles.contentWelcome}>
          <Text style={styles.welcomeText}>Bem-Vindo</Text>
          <Text style={styles.textUser}>{ capitalizeFirstLetter(user?.name || "olá usuário") }</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={24} color={colors.secondary} style={styles.logoutButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
