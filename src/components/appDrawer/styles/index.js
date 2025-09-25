import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../../themes/colors/Colors";

const styles = StyleSheet.create({
  cabecalho: {
    padding: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  cabecalhoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
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
  header: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    borderRadius: 30,
  },
  greetingText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  greetingName: {
    fontWeight: 'bold',
    color: colors.secondary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 14,
    padding: 6,
    borderRadius: 8,
  },
  logoutText: {
    marginLeft: 6,
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 8,
    backgroundColor: colors.white,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
});

export default styles;
