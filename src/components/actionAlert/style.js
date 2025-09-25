import { StyleSheet } from "react-native";
import { colors } from "../../themes/colors/Colors";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.darkGray,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    marginBottom: 20,
    color: colors.text,
    textAlign: "center",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  primary: { backgroundColor: colors.primary },
  destructive: { backgroundColor: colors.error },
  buttonText: { color: "#fff", fontWeight: "600" },
});

export default styles;