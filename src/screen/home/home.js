import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import styles from './style';

import Header from '../../components/header/header';

const data = [
  { id: "1", nome: "João Silva", telefone: "(11) 99999-9999", data: "03/09/2025", hora: "14:00", status: "Confirmado" },
  { id: "2", nome: "Maria Souza", telefone: "(21) 98888-8888", data: "04/09/2025", hora: "09:30", status: "Pendente" },
  { id: "3", nome: "Carlos Pereira", telefone: "(31) 97777-7777", data: "05/09/2025", hora: "16:45", status: "Cancelado" },
];

export default function Home() {
  function CreateAgenda() {
    Alert.alert("Agendamento", "Novo agendamento criado!");
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardNome}>{item.nome}</Text>
        <Text
          style={[
            styles.cardStatus,
            item.status === "Confirmado"
              ? styles.statusConfirmado
              : item.status === "Pendente"
              ? styles.statusPendente
              : styles.statusCancelado,
          ]}
        >
          {item.status}
        </Text>
      </View>

      <Text style={styles.cardTelefone}>{item.telefone}</Text>
      <Text style={styles.cardDataHora}>
        {item.data} às {item.hora}
      </Text>
    </TouchableOpacity>
  );

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
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
