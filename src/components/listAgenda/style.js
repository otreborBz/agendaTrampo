import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../colors/colors";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  // ===== Card =====
  card: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardPressed: {
    backgroundColor: "#fafafa",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary,
    flex: 1,
    marginRight: 8,
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  cardDataHora: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  cardServico: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },

  // ===== Status Badge =====
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  statusConfirmado: {
    backgroundColor: "#4CAF50",
  },
  statusPendente: {
    backgroundColor: "#FFC107",
  },
  statusCancelado: {
    backgroundColor: "#F44336",
  },

  // ===== Modal Overlay =====
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

  // ===== Modal Header =====
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

  // ===== Conteúdo do Modal =====
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
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
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
    fontSize: 15,
    color: "#444",
  },

  // ===== ActionSheet Android =====
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
    padding: 14,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#f8f8f8",
  },
  actionSheetDestructive: {
    backgroundColor: "#fff0f0",
  },
  actionSheetText: {
    fontSize: 15,
    textAlign: "center",
  },
  actionSheetDestructiveText: {
    color: "red",
  },
  actionSheetCancel: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    marginTop: 5,
  },
  actionSheetCancelText: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default styles;
