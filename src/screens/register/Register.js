import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import CustomAlert from "../../components/customAlert/CustomAlert";
import { AuthContext } from "../../contexts/Auth";
import styles from "./styles";

export default function Register() {
  const { signUp, loading } = useContext(AuthContext);
  const navigation = useNavigation();

  const [loadingRegister, setLoadingRegister] = useState(loading);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estado para o alerta customizado
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ title: "", message: "" });

  const showAlert = (title, message) => {
    setAlertInfo({ title, message });
    setAlertVisible(true);
  };

  // Função para o cadastro
  async function handleRegister() {
    setLoadingRegister(true);
    if (name === "" || email === "" || password === "") {
      showAlert("Atenção", "Por favor, preencha todos os campos!");
      setLoadingRegister(false);
      return;
    }
    try {
      const result = await signUp(name, email, password);
      if (!result.success) {
        setAlertInfo({ title: "Erro", message: result.message });
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertInfo({ title: "Erro", message: error.message });
      setAlertVisible(true);
    }
    finally {
      setLoadingRegister(false);
    }
  }
  // Função para navegar de volta para a tela de login
  function goToLogin() {
    navigation.goBack("Login");
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
      <Image
        source={require("../../../assets/iconName.png")}
        style={styles.logo}
      />
      <Text style={styles.screenTitle}>Crie sua conta</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Nome completo"
          placeholderTextColor={"#869ab0"}
          style={styles.textInput}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          placeholderTextColor={"#869ab0"}
          style={styles.textInput}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Senha"
          placeholderTextColor={"#869ab0"}
          style={styles.textInput}
          secureTextEntry={true}
          autoCapitalize="none"
        />
        <Text style={styles.passwordHintText}>
          A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números.
        </Text>

        <TouchableOpacity
          onPress={handleRegister}
          style={styles.button}
          activeOpacity={0.8}
        >
          {
            loadingRegister ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.textButton}>Cadastrar</Text>
            )
          }
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Text style={styles.textButtonLogin}>Já tem uma conta?</Text>
        <TouchableOpacity onPress={goToLogin} activeOpacity={0.7}>
          <Text style={styles.textButtonLoginLink}>Faça login</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonTerms} activeOpacity={0.7}>
        <Text style={styles.textButtonTerms}>Termos de uso</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
