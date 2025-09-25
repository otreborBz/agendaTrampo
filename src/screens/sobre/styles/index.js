import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../../themes/colors/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 12,
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 20,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  desc: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 22,
    maxWidth: 320,
  },
  versionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  versionText: {
    marginLeft: 6,
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  contactBox: {
    width: '100%',
    marginTop: 8,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
    width: 240,
    justifyContent: 'center',
    elevation: 1,
  },
  contactBtnText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
});

export default styles;
