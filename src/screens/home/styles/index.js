
import { Platform, StyleSheet } from "react-native";
import { colors } from "../../../themes/colors/Colors";

const styles = StyleSheet.create({
  statusFilterWrapper: {
    width: '100%',
    marginBottom: 8,
  },
  statusFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 2,
  },
  statusFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: colors.white,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  statusFilterButtonActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  statusFilterText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  statusFilterTextActive: {
    color: colors.white,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "ios" ? 90 : 10,
    paddingHorizontal: 12,
  },

  buttonAgenda: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  textButtonAgenda: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },

  // Container de modal escuro
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Caixa do modal
  modalBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    width: "95%",
    maxHeight: "95%",
    overflow: "hidden",
  },

  modalServicoBox: {
    maxHeight: "70%",
  },

  // Conteúdo do modal com scroll
  modalContent: {
    paddingHorizontal: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.secondary,
    textAlign: "center",
  },
  cepContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },

  buttonSearchCep: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  textButtonSearchCep: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
  },

  buttonEndereco: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },

  textButtonEndereco: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },

  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: colors.white,
  },

  buttonFooter: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  buttonFooterCancel: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  buttonTextCancel: {
    fontSize: 16,
    fontWeight: "600",
    color: '#666',
  },

  buttonTextFooter: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "600",
  },

  // Estilos para o modal de serviços
  novoServicoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  novoServicoInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 10,
  },

  addButton: {
    // backgroundColor: colors.secondary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  servicosList: {
    maxHeight: 200,
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  servicoItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  servicoOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    flex: 1,
  },

  deleteServicoButton: {
    padding: 5,
  },

  servicoOptionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  colorsSave: {
    color: colors.secondary
  }
});

export default styles;