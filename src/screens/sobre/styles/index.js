import { StyleSheet } from 'react-native';
import { colors } from '../../../themes/colors/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 60, // Aumenta o padding vertical para centralizar melhor com ScrollView
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 36,
    left: 16,
    zIndex: 10,
    backgroundColor: 'transparent',
    padding: 4,
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    maxWidth: 320,
  },
  versionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  versionText: {
    marginLeft: 6,
    color: colors.darkGray,
    fontWeight: '600',
    fontSize: 14,
  },
  contactSection: {
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 24,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  contactActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1, // Faz com que os botões dividam o espaço
    marginHorizontal: 6, // Adiciona um pequeno espaço entre eles
  },
  contactBtnText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8, // Espaço entre o ícone e o texto
  },
});

export default styles;
