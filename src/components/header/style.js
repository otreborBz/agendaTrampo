import { StyleSheet, Platform } from "react-native";
import { colors } from '../../colors/colors';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        height: Platform.OS === 'ios' ? 88 : 76, // Ajuste para notch no iOS
        paddingTop: Platform.OS === 'ios' ? 40 : 12,
    },
    logo: {
        width: 120,
        height: 40,
        resizeMode: 'contain',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    welcomeText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.secondary,
        marginRight: 8,
    },
    logoutButton: {
        padding: 8,
    }
})

export default styles;