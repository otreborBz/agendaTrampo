import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'ios' ? 88 : 76, // Mesmo valor da altura do header
    }
})

export default styles;