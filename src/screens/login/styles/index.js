import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../../themes/colors/Colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 20,
    },
    screenTitle: {
        fontSize: 26,
        color: colors.secondary,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 20,
        textAlign: 'center',
    },
    logo: {
        width: width * 0.5,
        height: width * 0.5,
        maxWidth: 300,
        maxHeight: 300,
        resizeMode: 'contain',
        marginBottom: 5,
    },
    inputContainer: {
        width: '100%',
        maxWidth: 400,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        marginBottom: 25,
    },
    textInput: {
        width: '100%',
        height: 55,
        borderColor: colors.gray,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.white,
        fontSize: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 55,
        borderColor: colors.gray,
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: colors.white,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
        paddingHorizontal: 16,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: colors.darkGray,
    },
    eyeIcon: {
        padding: 5,
        color: colors.gray,
    },
    button: {
        width: '100%',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderRadius: 12,
        marginTop: 10,
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    textButton: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    buttonRecoveryPassword: {
        marginTop: 15,
        marginBottom: 30,
        padding: 5,
    },
    textRecoveryPassword: {
        color: colors.secondary,
        fontSize: 14,
        fontWeight: '500',
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 400,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
    },
    textButtonCreate: {
        fontSize: 15,
        color: colors.darkGray,
    },
    textButtonRegister: {
        fontSize: 15,
        color: colors.secondary,
        marginLeft: 5,
        fontWeight: '600',
    },
    buttonTerms: {
        marginTop: 10,
        padding: 5,
    },
    textButtonTerms: {
        color: colors.secondary,
        fontSize: 13,
        fontWeight: '500',
    },



});

export default styles;