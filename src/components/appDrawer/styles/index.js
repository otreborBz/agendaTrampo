import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../../themes/colors/Colors";

const styles = StyleSheet.create({
  cabecalho: {
    padding: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  cabecalhoImage: {
    width: 180,
    height: 180,
    backgroundColor: '#fff',
  },
  cabecalhoText: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  rodapeContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: colors.white,
  },
  rodapeContent: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rodapeText: {
    color: colors.text,
    fontSize: 15,
    marginLeft: 10,
    fontWeight: '500',
  },
  greetingText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  greetingName: {
    fontWeight: 'bold',
    color: colors.secondary,
  }
});

export default styles;
