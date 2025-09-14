import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, ActivityIndicator } from 'react-native';
import styles from './style';
import { AuthContext } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../../components/customAlert/CustomAlert';

export default function Login() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  const navigation = useNavigation();

  const { signIn, loading } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estado para o alerta customizado
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ title: '', message: '' });

  const showAlert = (title, message) => {
    setAlertInfo({ title, message });
    setAlertVisible(true);
  };

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
  function openRegister() {
    navigation.navigate('Register');
  }

  // Abrir tela de recuperação de senha
  function goToChangeRecord() {
    navigation.navigate('ChangeRecord');
  }

  // Função de login
  async function handleLogin() {
    if (email === '' || password === '') {
      showAlert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const result = await signIn(email, password);
      if (!result.success) {
        showAlert('Erro no Login', result.message);
      }
    } catch (error) {
      showAlert('Erro', 'Ocorreu um erro inesperado ao fazer login.');
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <CustomAlert
        visible={alertVisible}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={() => setAlertVisible(false)}
      />
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
