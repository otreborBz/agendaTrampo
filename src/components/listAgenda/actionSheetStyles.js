import { StyleSheet } from "react-native";
import { colors } from "../../themes/colors/Colors";


const actionSheetStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  container: {
    width: '95%',
    maxWidth: 320,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  mainIcon: { marginBottom: 15 },
  title: { fontSize: 20, fontWeight: '600', color: colors.darkGray, marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 16, color: colors.text, textAlign: 'center', marginBottom: 25 },
  buttonContainer: { width: '100%', gap: 12 },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 12, borderRadius: 10, gap: 8 },
  primaryButton: { backgroundColor: colors.primary },
  destructiveButton: { backgroundColor: colors.error },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  destructiveButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  cancelButton: { marginTop: 16, padding: 8 },
  cancelText: { fontSize: 15, color: colors.text, fontWeight: '500' },
});

export default actionSheetStyles;
