import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../../themes/colors/Colors";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  // ===== Grid Container =====
  gridItemContainer: {
    width: '100%', // Ocupa a largura total para um item por linha
    paddingVertical: 5, // Aumenta o espaçamento vertical entre os cards
  },

  // ===== Card =====
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 16, // Bordas mais arredondadas
    borderRightWidth: 6,
    borderRightColor: colors.lightGray, // Define uma cor padrão que será sobrescrita
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    flex: 1,
    paddingVertical: 8, // Mais preenchimento vertical
    paddingHorizontal: 20, // Mais preenchimento horizontal
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'center'
  },

  cardNome: {
    fontSize: 16,
    fontWeight: "bold", // Nome mais forte
    color: colors.text,
    marginBottom: 4, // Mais espaço abaixo do nome
  },
  moreButton: { padding: 8, alignSelf: 'center' },
  cardServico: {
    fontSize: 14,
    color: colors.text, // Cor do serviço um pouco mais escura
    opacity: 0.7, // Leve transparência para hierarquia
  },
  cardTime: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    width: 55,
    textAlign: 'center',
    marginRight: 16, // Mais espaço entre a hora e o texto
  },

  // ===== Status Badge =====
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  statusConfirmado: {
    backgroundColor: colors.confirm, // verde suave
    color: colors.success,
  },
  statusPendente: {
    backgroundColor: colors.pending, // amarelo suave
    color: colors.warning,
  },
  statusCancelado: {
    backgroundColor: colors.canceled, // vermelho suave
    color: colors.error,
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
    maxHeight: height * 0.85,
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
  },

  // ===== Modal Header =====
  modalHeader: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalHeaderText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: { padding: 8 },

  // ===== Conteúdo do Modal =====
  modalScrollView: { padding: 20, maxHeight: height * 0.85 },
  infoBlock: {
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
    marginBottom: 12,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  infoIcon: { width: 24, marginRight: 16 },
  infoText: { fontSize: 16, color: colors.text, flex: 1 },

  // ===== Status Badge Modal =====
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  // ===== Swipeable Actions =====
  swipeActionText: {
    color: colors.white,
    fontSize: 12,
    marginTop: 4,
  },
  swipeRightContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    width: 180,
    gap:5,
  },
  swipeEditButton: {
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  swipeDeleteButton: {
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default styles;
