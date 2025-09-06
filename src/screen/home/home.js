import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import styles from './style';

import Header from '../../components/header/header';
import ListAgenda from '../../components/listAgenda/listAgenda';
import { AuthContext } from '../../contexts/auth';

export default function Home() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (user) {
      setData([user]); // transforma em array para o FlatList
    }
  }, [user]);

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
        keyExtractor={(item, index) => String(index)} // usa index pq não tem id no objeto
        renderItem={({ item }) => <ListAgenda userData={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
