import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../colors/colors';

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
        marginBottom: 40,
        textAlign: 'center',
    },
    logo: {
        width: width * 0.5,
        height: width * 0.5,
        maxWidth: 300,
        maxHeight: 300,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    title: {
        fontSize: 16,
        color: colors.darkGray,
        textAlign: 'center',
        marginBottom: 25,
        maxWidth: 300,
        lineHeight: 22,
    },
    inputContainer: {
        width: '100%',
        maxWidth: 400,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        marginBottom: 25,
    },
    textInput:{
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
    buttonContainer: {
        width: '100%',
        maxWidth: 400,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
    },
    textButtonLogin: {
        fontSize: 15,
        color: colors.darkGray,
    },
    textButtonLoginLink: {
        fontSize: 15,
        color: colors.secondary,
        marginLeft: 5,
        fontWeight: '600',
    },
    buttonTerms: {
        marginTop: 30,
        padding: 5,
    },
    textButtonTerms: {
        color: colors.secondary,
        fontSize: 13,
        fontWeight: '500',
    }
});

export default styles;
