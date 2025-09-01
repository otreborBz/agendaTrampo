import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../colors/colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.background,
    },

});

export default styles;