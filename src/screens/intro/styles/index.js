import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../../themes/colors/Colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingVertical: 20,
    },
    logo: {
        width: width * 0.7,
        height: width * 0.7,
        maxWidth: 350,
        maxHeight: 350,
        resizeMode: 'contain',
    },

    buttonContainer: {
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    slogan: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.darkGray,
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 24,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        shadowColor: colors.secondary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainerText: {
        marginTop: 20,
        color: colors.darkGray,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    }
});

export default styles;