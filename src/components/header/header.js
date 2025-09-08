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

  // Função para pegar só o primeiro nome e deixar a primeira letra maiúscula
  function getFirstName(string) {
    if (!string) return "";
    const firstName = string.split(" ")[0]; // pega só a primeira palavra
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../image/logo/icon.png')} 
          style={styles.logo} 
        />
        
        <View style={styles.contentWelcome}>
          <Text style={styles.greetingText}>
            👋 Olá,{' '}
            <Text style={styles.greetingName}>
              {user?.name ? getFirstName(user.name) : 'Usuário'}
            </Text>
            !
          </Text>
        </View>

        <TouchableOpacity onPress={handleLogout}>
          <Feather 
            name="log-out" 
            size={24} 
            color={colors.secondary} 
            style={styles.logoutButton} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
