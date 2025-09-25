import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../themes/colors/Colors';
import styles from './styles';

export default function Sobre() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Início')}>
        <Ionicons name="arrow-back" size={28} color={colors.secondary} />
      </TouchableOpacity>
      <View style={styles.logoBox}>
        <Image source={require('../../../assets/iconName.png')} style={styles.logo} />
      </View>
      {/* <Text style={styles.title}>AgendaTrampo</Text> */}
      <Text style={styles.desc}>Facilite o agendamento de serviços e organize seu dia a dia de forma prática e moderna.</Text>
      <View style={styles.versionBox}>
        <Ionicons name="information-circle-outline" size={18} color={colors.secondary} />
        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </View>
      <View style={styles.contactBox}>
        <Text style={styles.contactTitle}>Contato</Text>
        <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('mailto:contato@agendatrampo.com')}>
          <Ionicons name="mail-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.contactBtnText}>contato@agendatrampo.com</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('https://agendatrampo.com')}>
          <Ionicons name="globe-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.contactBtnText}>agendatrampo.com</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
