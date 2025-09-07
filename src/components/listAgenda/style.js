import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../colors/colors";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Estilos do card
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardPressed: {
    backgroundColor: "#f9f9f9",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary,
    marginLeft: 6,
  },
  optionsButton: {
    padding: 5,
    marginLeft: 10,
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTelefone: {
    fontSize: 14,
    color: "#555",
    marginLeft: 6,
  },
  cardDataHora: {
    fontSize: 14,
    color: "#777",
    marginLeft: 6,
  },
  cardServico: {
    fontSize: 14,
    color: "#777",
    marginLeft: 6,
    flex: 1,
  },

  // Status badge
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.black,
  },
  statusConfirmado: {
    backgroundColor: colors.confirm,
  },
  statusPendente: {
    backgroundColor: colors.pending,
  },
  statusCancelado: {
    backgroundColor: colors.canceled,
  },

  // Modal Centralizado
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlayPressable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentCentered: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalHeaderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },

  // Conteúdo do modal
  modalScrollView: {
    paddingHorizontal: 20,
    maxHeight: height * 0.9,
  },
  infoSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoIcon: {
    width: 24,
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#777",
    marginBottom: 2,
    fontWeight: "500",
  },
  infoText: {
    fontSize: 16,
    color: "#444",
  },

  // Botões do modal (escondidos)
  modalActionsHidden: {
    display: "none",
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    flexDirection: "row",
    minHeight: 50,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },

  // Estilos para o ActionSheet (Android)
  actionSheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  actionSheetContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  actionSheetButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f8f8f8",
  },
  actionSheetDestructive: {
    backgroundColor: "#fff0f0",
  },
  actionSheetText: {
    fontSize: 16,
    textAlign: "center",
  },
  actionSheetDestructiveText: {
    color: "red",
  },
  actionSheetCancel: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    marginTop: 5,
  },
  actionSheetCancelText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  // Adicione ao final do seu StyleSheet
statusButton: {
  flex: 1,
  paddingVertical: 10,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
},
statusButtonText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 14,
  textTransform: "uppercase",
},

});

export default styles;