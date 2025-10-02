import { useNavigation } from '@react-navigation/native';
import { useCallback, useContext, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CustomAlert from '../../components/customAlert/CustomAlert';
import { AuthContext } from '../../contexts/Auth';
import styles from './styles';

export default function Login() {

  const navigation = useNavigation();

  const { signIn } = useContext(AuthContext);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Estado para o alerta customizado
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ title: '', message: '' });



  // Abrir tela de registro
  function gotoRegister() {
    navigation.navigate('Register');
  }

  // Abrir tela de recuperação de senha
  function gotoChangeRecord() {
    navigation.navigate('ChangeRecord');
  }

  // Função de login
  async function handleLogin() {
    setLoadingLogin(true);
    if (email === '' || password === '') {
      setAlertInfo({
        title: 'Atenção',
        message: 'Por favor, preencha todos os campos.',
      });
      setAlertVisible(true);
      return;
    }

    try {
      const result = await signIn(email, password);
      if (!result.success) {
        setAlertInfo({
          title: 'Erro no Login',
          message: result.message,
        });
        setAlertVisible(true);

      }
    } catch (error) {
      setAlertInfo({
        title: 'Erro',
        message: 'Ocorreu um erro inesperado ao fazer login.',
      });
      setAlertVisible(true);
    } finally {
      setLoadingLogin(false);
    }
  }

  const goToTerms = useCallback(() => {
    navigation.navigate("Terms");
  }, [navigation]);

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
      <Image source={require('../../../assets/iconName.png')} style={styles.logo} />

      <Text style={styles.screenTitle}>Bem-vindo de volta!</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder='Email'
          placeholderTextColor={"#869ab0"}
          style={styles.textInput}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder='Senha'
            placeholderTextColor={"#869ab0"}
            style={styles.passwordInput}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
            <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color={styles.eyeIcon.color} />
          </Pressable>
        </View>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleLogin}
        >
          {loadingLogin ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.textButton}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.buttonRecoveryPassword}
        activeOpacity={0.7}
        onPress={gotoChangeRecord}
      >
        <Text style={styles.textRecoveryPassword}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Text style={styles.textButtonCreate}>Não tem uma conta?</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={gotoRegister}>
          <Text style={styles.textButtonRegister}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonTerms} activeOpacity={0.7} onPress={goToTerms}>
        <Text style={styles.textButtonTerms}>Termos de uso</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
