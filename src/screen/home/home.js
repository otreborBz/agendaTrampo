import {} from 'react';
import { View, Text, Image } from 'react-native';
import styles from './style';

import Header from '../../components/header/header';

export default function Home(){
    return(
        <View style={styles.container}>
            <Header />
        </View>
    )
}