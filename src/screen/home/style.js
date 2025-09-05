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


});

export default styles;
