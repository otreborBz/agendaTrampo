import { useNavigation } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import styles from './styles';

export default function Intro() {
    const navigation = useNavigation();

    function gotoScreen() {
        navigation.navigate('Login');
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/iconName.png')}
                style={styles.logo}
            />
            <Text style={styles.slogan}>
                Organize seus trabalhos, conquiste seus clientes.
            </Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={gotoScreen}>
                    <Text style={styles.buttonText}>Continuar</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.buttonContainerText}> CodeBr | Roberto Carvalho</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}