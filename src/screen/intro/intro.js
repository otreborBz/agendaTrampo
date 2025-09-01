import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './style';

const { height } = Dimensions.get('window');

export default function Intro(){
    const navigation = useNavigation();
    const fallAnim = useRef(new Animated.Value(-height)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in rápido
        Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();

        // Animação de queda com bounce
        Animated.spring(fallAnim, {
            toValue: 0,
            tension: 30,    
            friction: 7,   
            useNativeDriver: true,
        }).start();
    }, []);

    function goToScreen(){
        navigation.replace('Login');
    }

    return(
        <View style={styles.container}>
            <Animated.Image 
                source={require('../../image/logo/iconName.png')} 
                style={[
                    styles.logo,
                    {
                        opacity: opacityAnim,
                        transform: [
                            { translateY: fallAnim }
                        ]
                    }
                ]} 
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={goToScreen}>
                    <Text style={ styles.buttonText}>Continuar</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.buttonContainerText}> CodeBr | Roberto Carvalho</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    )
}