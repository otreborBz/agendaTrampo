import { View, Text, Image } from 'react-native';
import styles from './style';
import { colors } from '../../colors/colors';
import Feather from '@expo/vector-icons/Feather';

export default  function Header(){
    return(
        <View style={styles.container}>  
            <Image source={require('../../image/logo/icon.png')} style={styles.logo} />
            <View style={styles.content}>
                <Text style={styles.welcomeText}>Bem-Vindo Fulano de Tal</Text>
                <Feather 
                    name="log-out" 
                    size={24} 
                    color={colors.secondary}
                    style={styles.logoutButton}
                />
            </View>
        </View>
    )
}