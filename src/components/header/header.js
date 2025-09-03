import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import styles from './style';
import { colors } from '../../colors/colors';
import Feather from '@expo/vector-icons/Feather';

export default  function Header(){
    function logoutButton(){
        Alert.alert(
            'Confirmação',
            'Você tem certeza que deseja sair',
            [
                { text: 'Cancelar', style: 'cancel'},
                {text: 'sim', onPress:() => console.log('saiu')}
            ]
        )
    }
    return(
        <View style={styles.container}>  
            <View style={styles.content}>
                 <Image source={require('../../image/logo/icon.png')} style={styles.logo} />
                <View styles={ styles.contentWelcome}>
                    <Text style={styles.welcomeText}>Bem-Vindo</Text>
                    <Text style={styles.textUser}>Fulano de Tal</Text>
                </View>
                <TouchableOpacity>
                    <Feather name="log-out" size={24} color={colors.secondary} style={styles.logoutButton}
                    onPress={logoutButton}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}