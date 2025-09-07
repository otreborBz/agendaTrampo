import { StyleSheet, Platform } from "react-native";
import { colors } from "../../colors/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "ios" ? 90 : 80,
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
    maxHeight: "85%",
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