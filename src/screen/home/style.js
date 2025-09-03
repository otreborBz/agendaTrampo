import { StyleSheet, Platform } from "react-native";
import { colors } from "../../colors/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "ios" ? 90 : 80, 
    paddingHorizontal: 12
  },

  // Botão de novo agendamento
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

  // Card da FlatList
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  cardNome: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },

  cardTelefone: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },

  cardDataHora: {
    fontSize: 14,
    color: "#777",
  },

  cardStatus: {
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },

  // Status com cores diferentes
  statusConfirmado: {
    backgroundColor: colors.confirm, // verde claro
    color: colors.black, // verde escuro
  },

  statusPendente: {
    backgroundColor: colors.pending, // amarelo claro
    color: colors.black, // amarelo escuro
  },

  statusCancelado: {
    backgroundColor: colors.canceled, // vermelho claro
    color: colors.black, // vermelho escuro
  },
});

export default styles;
