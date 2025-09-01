import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './style';

export default function ChangeRecord(){
    const navigation = useNavigation();

    function goToLogin(){
        navigation.replace('Login');
    }

    return(
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Image 
                source={require('../../image/logo/iconName.png')} 
                style={styles.logo}
            />
            <Text style={styles.screenTitle}>Recuperar Senha</Text>
            <Text style={styles.title}>
                Não se preocupe! Vamos ajudar você a recuperar seu acesso.
            </Text>
            <View style={styles.inputContainer}>
                <TextInput 
                    placeholder='Email'
                    style={styles.textInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity 
                    style={styles.button}
                    activeOpacity={0.8}
                >
                    <Text style={styles.textButton}>Alterar Senha</Text>
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
