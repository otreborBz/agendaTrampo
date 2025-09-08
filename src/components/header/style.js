
  import { StyleSheet, Platform } from "react-native";
  import { colors } from "../../colors/colors";

const styles = StyleSheet.create({
  greetingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 0.2,
  },

  greetingName: {
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 17,
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,

    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,

    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    width: 90,
    height: 50,
    resizeMode: "contain",
  },

  contentWelcome: {
    flex: 1,
    marginLeft: 12,
  },

  welcomeText: {
    fontSize: 12,
    color: colors.darkGray,
  },

  textUser: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary,
  },

  logoutButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
  },
});

export default styles;
