import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './style';

export default function Intro(){

    const navigation = useNavigation();

    function goScreen(){
        navigation.navigate('Login');
    }


    return(
        <View style={styles.container}>
            <Image source={require('../../image/logo/iconName.png')} style={styles.logo} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={goScreen}>
                    <Text style={ styles.buttonText}>Continuar</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.buttonContainerText}> CodeBr | Roberto Carvalho</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    )
}