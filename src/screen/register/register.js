import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import styles from "./style";
import { AuthContext } from "../../contexts/auth";

export default function Register() {
  const { signUp, loading } = useContext(AuthContext);
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    if (name === "" || email === "" || password === "") {
      alert("Preencha todos os campos!");
      return;
    }
    const result = await signUp(name, email, password);
    if (result.success) {
      navigation.goBack("Login"); 
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
      <Image
        source={require("../../image/logo/iconName.png")}
        style={styles.logo}
      />
      <Text style={styles.screenTitle}>Crie sua conta</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Nome completo"
          style={styles.textInput}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          style={styles.textInput}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Senha"
          style={styles.textInput}
          secureTextEntry={true}
          autoCapitalize="none"
        />

        <TouchableOpacity
          onPress={handleRegister}
          style={styles.button}
          activeOpacity={0.8}
        >
          {
            loading ? (
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
