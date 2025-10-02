import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

  // Estado para o aceite dos termos
  const [termsAccepted, setTermsAccepted] = useState(false);

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
    if (!termsAccepted) {
      showAlert("Atenção", "Você deve aceitar os Termos de Uso e a Política de Privacidade para continuar.");
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
  const goToLogin = useCallback(() => {
    navigation.goBack("Login");
  }, [navigation]);

  const goToTerms = useCallback(() => {
    navigation.navigate("Terms");
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: styles.container.backgroundColor }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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

          <View style={styles.termsContainer}>
            <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)} style={styles.checkbox}>
              {termsAccepted && <Ionicons name="checkmark" size={20} color={styles.checkbox.checkedColor} />}
            </TouchableOpacity>
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>Eu li e concordo com os </Text>
              <TouchableOpacity onPress={goToTerms}>
                <Text style={styles.termsLink}>Termos de Uso</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            style={[styles.button, (!termsAccepted || loadingRegister) && styles.buttonDisabled]}
            activeOpacity={0.8}
            disabled={!termsAccepted || loadingRegister}
          >
            {
              loadingRegister ? (
                <ActivityIndicator size="small" color={styles.textButton.color} />
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
