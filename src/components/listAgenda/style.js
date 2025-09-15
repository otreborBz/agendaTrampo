import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../colors/colors";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  // ===== Grid Container =====
  gridItemContainer: {
    width: '50%', // Garante que cada item ocupe metade da tela
    padding: 3,   // Cria o espaçamento visual entre os cards
  },

  // ===== Card =====
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: colors.darkGray,
    borderLeft: 6, // Adiciona a borda na esquerda
    borderRightWidth: 6, // Adiciona a borda na direita
    borderRightColor: '#ccc', // Cor padrão, será sobrescrita
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.15,
  },
  cardContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between', // Empurra o conteúdo para o topo e para o fundo
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardNome: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.secondary,
    flex: 1, // Permite que o nome ocupe o espaço disponível
    marginRight: 8, // Adiciona um espaço antes do botão de opções
  },
  moreButton: { padding: 4 },
  cardServico: {
    fontSize: 14,
    color: "#555",
    marginTop: 4, // Adiciona um pequeno espaço abaixo do nome
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Alinha o status à esquerda
    alignItems: 'center',
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1, // Permite que este container encolha se necessário
    marginBottom: 6, // Espaço entre as linhas de informação
  },
  cardIcon: {
    marginRight: 8,
    width: 16, // Garante alinhamento consistente dos ícones
  },
  cardDataHora: {
    fontSize: 13,
    color: "#666",
  },

  // ===== Status Badge =====
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 14,
    overflow: 'hidden',
  },
  statusConfirmado: {
    backgroundColor: "#E6F4EA", // verde suave
    color: "#388E3C",
  },
  statusPendente: {
    backgroundColor: "#FFF9E6", // amarelo suave
    color: "#FFA000",
  },
  statusCancelado: {
    backgroundColor: "#FDEAEA", // vermelho suave
    color: "#D32F2F",
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
  closeButton: { padding: 4 },

  // ===== Conteúdo do Modal =====
  modalScrollView: {
    paddingHorizontal: 20,
    maxHeight: height * 0.85,
  },
  infoSection: { marginTop: 10, marginBottom: 10 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 14 },
  infoIcon: { width: 24, marginRight: 12, marginTop: 2 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 13, color: "#777", marginBottom: 2, fontWeight: "500" },
  infoText: { fontSize: 15, color: "#444" },

  // ===== Status Badge Modal =====
  statusBadge: {
    paddingHorizontal: 3,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "transparent",
  },
});

export default styles;
