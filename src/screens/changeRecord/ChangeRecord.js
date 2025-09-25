import React,{useState} from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { redefinirSenha} from '../../services/firebase/userService'
import CustomAlert from '../../components/customAlert/CustomAlert';

import styles from './styles';

export default function ChangeRecord(){
    const navigation = useNavigation();
    const [email, setEmail] = React.useState('');

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ title: "", message: "" });

    const [loadingVisible, setLoadingVisible] = useState(false);

    function goToLogin(){
        navigation.replace('Login');
    }

    async function redefinir () {
        setLoadingVisible(true);
        if (!email) {
            setAlertInfo({ title: 'Atenção', message: 'Por favor, digite seu e-mail.' });
            setAlertVisible(true);
            setLoadingVisible(false);
            return;
        }
        try {
            await redefinirSenha(email);
            setEmail('');
            setAlertInfo({ title: 'Sucesso', message: 'E-mail de redefinição de senha enviado! Verifique sua caixa de entrada.' });
            setAlertVisible(true);   
        } catch (error) {
            setAlertInfo({ title: 'Erro', message: error.message });
            setAlertVisible(true);
        }finally{
            setLoadingVisible(false);
            setEmail('');
        }
    
    }

    return(
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Image 
                source={require('../../../assets/iconName.png')} 
                style={styles.logo}
            />
            <Text style={styles.screenTitle}>Recuperar Senha</Text>
            <Text style={styles.title}>
                Não se preocupe! Vamos ajudar você a recuperar seu acesso.
            </Text>
            <View style={styles.inputContainer}>
                <TextInput 
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder='Email'
                    style={styles.textInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity
                    onPress={redefinir}
                    style={styles.button}
                    activeOpacity={0.8}
                >
                    {loadingVisible ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.textButton}>Redefinir Senha</Text>
                    )}
 
                </TouchableOpacity>
            </View>
              <CustomAlert
                    visible={alertVisible}
                    title={alertInfo.title}
                    message={alertInfo.message}
                    onClose={() => setAlertVisible(false)}
                />
           
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
