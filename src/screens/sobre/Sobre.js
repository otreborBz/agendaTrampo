import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../themes/colors/Colors';
import styles from './styles';

import AdBanner from '../../components/adBanner/AdBanner';

export default function Sobre() {
  const navigation = useNavigation();
  // Pega a versão do app dinamicamente do app.json
  const appVersion = Constants.expoConfig.version;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.logoBox}>
        <Image source={require('../../../assets/iconName.png')} style={styles.logo} />
      </View>

      <Text style={styles.desc}>Facilite o agendamento de serviços e organize seu dia a dia de forma prática e moderna.</Text>

      <View style={styles.versionBox}>
        <Ionicons name="information-circle-outline" size={18} color={colors.darkGray} />
        <Text style={styles.versionText}>Versão {appVersion}</Text>
      </View>
      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Fale Conosco</Text>
        <View style={styles.contactActionsRow}>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('mailto:codebr.contato@gmail.com')} activeOpacity={0.7}>
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <Text style={styles.contactBtnText}>E-mail</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('https://agendatrampo.com')} activeOpacity={0.7}>
            <Ionicons name="globe-outline" size={20} color={colors.primary} />
            <Text style={styles.contactBtnText}>Website</Text>
          </TouchableOpacity>
        </View>
      </View>
      <AdBanner />
    </View>
  );
}
