import React, { useEffect, useRef, useState, useContext } from 'react';
import { 
  View, Text, TextInput, Image, TouchableOpacity, 
  KeyboardAvoidingView, Platform, Animated, ActivityIndicator, Alert 
} from 'react-native';
import styles from './style';
import { AuthContext } from '../../contexts/auth';

export default function Login() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  const { signIn, loading } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Animação de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Abrir tela de registro
  function openRegister(navigation) {
    navigation.navigate('Register');
  }

  // Abrir tela de recuperação de senha
  function goToChangeRecord(navigation) {
    navigation.navigate('ChangeRecord');
  }

  // Função de login
  async function handleLogin() {
    if (email === '' || password === '') {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const result = await signIn(email, password);

      if (!result.success) {
        Alert.alert('Erro', 'Não foi possível fazer login. Verifique seus dados.');
      }

      // ❌ NÃO precisamos navegar manualmente para Home
      // A renderização de Routes.js cuidará disso
    } catch (error) {
      console.log("Erro ao logar:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login.');
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Animated.Image 
        source={require('../../image/logo/iconName.png')} 
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }]
          }
        ]}
      />

      <Text style={styles.screenTitle}>Bem-vindo de volta!</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder='Email'
          style={styles.textInput}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          value={password}
          onChangeText={setPassword} 
          placeholder='Senha'
          style={styles.textInput}
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8} 
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.textButton}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.buttonRecoveryPassword} 
        activeOpacity={0.7} 
        onPress={goToChangeRecord}
      >
        <Text style={styles.textRecoveryPassword}>Esqueceu sua senha?</Text>
      </TouchableOpacity>
     
      <View style={styles.buttonContainer}>
        <Text style={styles.textButtonCreate}>Não tem uma conta?</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={openRegister}>
          <Text style={styles.textButtonRegister}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonTerms} activeOpacity={0.7}>
        <Text style={styles.textButtonTerms}>Termos de uso</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
