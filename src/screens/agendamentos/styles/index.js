import { Platform, StyleSheet } from 'react-native';
import { colors } from '../../../themes/colors/Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'center',
    marginVertical: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border || '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },

  inputIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border || '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginBottom: 12,
    height: 50,
  },

  inputIconRowBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border || '#ddd',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
  },

  inputBox: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0,
    paddingHorizontal: 8,
    height: '100%',
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
  },

  buttonEndereco: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 12,
  },

  inputIcon: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 12,
  },

  textButton: {
    width: '100%',
    height: 50,
    backgroundColor: colors.secondary,
    borderRadius: 10,
  },

  textButtonEndereco: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: colors.secondary,
  },

  // Estilos específicos para o Modal de Endereço
  modalEnderecoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  modalEnderecoInputContainer: {
    height: 44,
    marginBottom: 8,
  },
  modalEnderecoCepContainer: {
    marginBottom: 8,
  },
  // Fim dos estilos específicos

  servicoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#eee',
  },

  servicoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  buttonAddServico: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonCloseModal: {
    // backgroundColor: colors.error,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  buttonTextCloseModal: {
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 15,
  },

  buttonSaveModal: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  buttonTextSaveModal: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  buttonBuscarCep: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  footerRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-around',
  },

  buttonFooter: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    width: '48%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  buttonFooterCancel: {
    width: '30%',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 10,
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  buttonTextFooter: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  buttonTextCancel: {
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
