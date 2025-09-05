import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import styles from './style';

import Header from '../../components/header/header';
import ListAgenda from '../../components/listAgenda/listAgenda';

import  data  from '../../../data.json';


export default function Home() {
  function CreateAgenda() {
    Alert.alert("Agendamento", "Novo agendamento criado!");
  }

  return (
    <View style={styles.container}>
      <Header />

      {/* Botão de novo agendamento */}
      <TouchableOpacity style={styles.buttonAgenda} onPress={CreateAgenda}>
        <Text style={styles.textButtonAgenda}>+ Agendamentos</Text>
      </TouchableOpacity>

      {/* Lista de agendamentos */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListAgenda item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
