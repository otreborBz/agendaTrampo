import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';

export default function Login(){
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(50)).current;

    const navigation = useNavigation();

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
            })
        ]).start();
    }, []);

    function openRegister(){
        navigation.navigate('Register');
    }

    function goToChangeRecord(){
        navigation.navigate('ChangeRecord');
    }
    function goToHome(){
        navigation.replace('Home');
    }

    return(
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
                ]}/>
            <Text style={styles.screenTitle}>Bem-vindo de volta!</Text>
            <View style={styles.inputContainer}>
                <TextInput 
                    placeholder='Email'
                    style={styles.textInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TextInput 
                    placeholder='Senha'
                    style={styles.textInput}
                    secureTextEntry
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={ goToHome }>
                    <Text style={styles.textButton}>Entrar</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.buttonRecoveryPassword} activeOpacity={0.7} onPress={ goToChangeRecord }>
                <Text style={styles.textRecoveryPassword}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
           
            <View style={styles.buttonContainer}>
                <Text style={styles.textButtonCreate}>Não tem uma conta?</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={ openRegister }>
                    <Text style={styles.textButtonRegister}>Cadastre-se</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.buttonTerms} activeOpacity={0.7}>
                <Text style={styles.textButtonTerms}>Termos de uso</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}