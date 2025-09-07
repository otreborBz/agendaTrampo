import React, { useEffect, useState, useContext } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, Modal, TextInput, 
  ScrollView, Platform, Alert, KeyboardAvoidingView 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style';

import Header from '../../components/header/header';
import ListAgenda from '../../components/listAgenda/listAgenda';
import { AuthContext } from '../../contexts/auth';
import { colors } from '../../colors/colors';

export default function Home() {
  const { user } = useContext(AuthContext);
  const [agendamentos, setAgendamentos] = useState([]);

  // Modais
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEnderecoVisible, setModalEnderecoVisible] = useState(false);
  const [modalServicoVisible, setModalServicoVisible] = useState(false);

  // Picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Campos do agendamento
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataHora, setDataHora] = useState(new Date());
  const [servico, setServico] = useState('');
  const [valor, setValor] = useState('');
  const [endereco, setEndereco] = useState({
    rua: '', numero: '', cidade: '', estado: '', cep: ''
  });

  // Serviços e novo serviço
  const [servicosExistentes, setServicosExistentes] = useState([]);
  const [novoServico, setNovoServico] = useState('');

  // Carrega serviços e agendamentos do storage
  useEffect(() => {
    loadServicos();
    loadAgendamentos();
  }, []);

  const loadServicos = async () => {
    try {
      const saved = await AsyncStorage.getItem('@servicos');
      if (saved) setServicosExistentes(JSON.parse(saved));
    } catch (e) {
      console.log('Erro ao carregar serviços', e);
    }
  };

  const loadAgendamentos = async () => {
    try {
      const saved = await AsyncStorage.getItem('@agendamentos');
      if (saved) {
        const agendamentosData = JSON.parse(saved);
        // Garantir que todos os agendamentos tenham status
        const agendamentosComStatus = agendamentosData.map(agenda => ({
          ...agenda,
          status: agenda.status || 'Pendente'
        }));
        setAgendamentos(agendamentosComStatus);
      }
    } catch (e) {
      console.log('Erro ao carregar agendamentos', e);
    }
  };

  const saveServicosStorage = async (list) => {
    try {
      await AsyncStorage.setItem('@servicos', JSON.stringify(list));
    } catch (e) {
      console.log('Erro ao salvar serviços', e);
    }
  };

  const saveAgendamentosStorage = async (list) => {
    try {
      await AsyncStorage.setItem('@agendamentos', JSON.stringify(list));
    } catch (e) {
      console.log('Erro ao salvar agendamentos', e);
    }
  };

  // Abrir modais
  const openModal = () => setModalVisible(true);
  const openModalEndereco = () => setModalEnderecoVisible(true);
  const openModalServico = () => setModalServicoVisible(true);

  // Salvar endereço
  const saveEndereco = () => {
    const { rua, numero, cidade, estado, cep } = endereco;
    if (!rua || !numero || !cidade || !estado || !cep) {
      Alert.alert("Erro", "Preencha todos os campos do endereço!");
      return;
    }
    setModalEnderecoVisible(false);
    Alert.alert("Sucesso", "Endereço salvo com sucesso!");
  };

  // Salvar agendamento
  const saveAgenda = async () => {
    if (!nomeCliente || !telefone || !dataHora) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }
    
    const novoAgendamento = {
      id: Date.now().toString(),
      nomeCliente,
      telefone,
      dataHora: dataHora.toISOString(),
      servico: servico || null,
      valor: valor || null,
      endereco: Object.values(endereco).some(e => e) ? endereco : null,
      status: 'Pendente' // Status padrão
    };
    
    const novosAgendamentos = [...agendamentos, novoAgendamento];
    setAgendamentos(novosAgendamentos);
    await saveAgendamentosStorage(novosAgendamentos);
    setModalVisible(false);

    // Reset dos campos
    setNomeCliente('');
    setTelefone('');
    setDataHora(new Date());
    setServico('');
    setValor('');
    setEndereco({ rua: '', numero: '', cidade: '', estado: '', cep: '' });

    Alert.alert("Sucesso", "Agendamento cadastrado!");
  };

  // Atualizar status do agendamento
  const updateStatus = async (id, novoStatus) => {
    const novosAgendamentos = agendamentos.map(agenda => 
      agenda.id === id ? { ...agenda, status: novoStatus } : agenda
    );
    
    setAgendamentos(novosAgendamentos);
    await saveAgendamentosStorage(novosAgendamentos);
  };

  // Picker
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'dismissed') return;
    const currentDate = selectedDate || dataHora;
    if (currentDate < new Date()) {
      Alert.alert("Erro", "Não é permitido escolher datas anteriores!");
      return;
    }
    setDataHora(currentDate);
    if (Platform.OS === 'android') setShowTimePicker(true);
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === 'dismissed') return;
    const updatedDateTime = new Date(dataHora);
    updatedDateTime.setHours(selectedTime.getHours());
    updatedDateTime.setMinutes(selectedTime.getMinutes());
    setDataHora(updatedDateTime);
  };

  // Adicionar serviço
  const adicionarServico = () => {
    if (!novoServico.trim()) {
      Alert.alert("Erro", "Digite o nome do serviço!");
      return;
    }
    
    const newList = [...servicosExistentes, novoServico.trim()];
    setServicosExistentes(newList);
    saveServicosStorage(newList);
    setServico(novoServico.trim());
    setNovoServico('');
    setModalServicoVisible(false);
  };

  // Remover serviço
  const removerServico = async (index) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este serviço?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Excluir", 
          onPress: async () => {
            const newList = [...servicosExistentes];
            newList.splice(index, 1);
            setServicosExistentes(newList);
            await saveServicosStorage(newList);
            
            // Se o serviço removido era o selecionado, limpar seleção
            if (servico === servicosExistentes[index]) {
              setServico('');
            }
          }
        }
      ]
    );
  };

  // Selecionar serviço existente
  const selecionarServico = (servicoSelecionado) => {
    setServico(servicoSelecionado);
    setModalServicoVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header />

      <TouchableOpacity style={styles.buttonAgenda} onPress={openModal}>
        <Text style={styles.textButtonAgenda}>+ Agendamentos</Text>
      </TouchableOpacity>

      <FlatList
        data={agendamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListAgenda 
            data={item} 
            onUpdateStatus={updateStatus} 
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum agendamento encontrado</Text>
          </View>
        }
      />

      {/* Modal de agendamento */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalBox}>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalTitle}>Novo Agendamento</Text>

              <Text style={styles.label}>Nome do Cliente*</Text>
              <TextInput
                style={styles.input}
                value={nomeCliente}
                onChangeText={setNomeCliente}
                placeholder="Nome completo"
              />

              <Text style={styles.label}>Telefone*</Text>
              <TextInput
                style={styles.input}
                value={telefone}
                onChangeText={setTelefone}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Data e Hora*</Text>
              <TouchableOpacity 
                style={styles.input} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{dataHora.toLocaleString('pt-BR')}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={dataHora}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                  minimumDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={dataHora}
                  mode="time"
                  display="default"
                  onChange={onChangeTime}
                />
              )}

              <Text style={styles.label}>Serviço</Text>
              <TouchableOpacity 
                style={styles.input} 
                onPress={openModalServico}
              >
                <Text>{servico || "Selecione um serviço"}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Valor (R$)</Text>
              <TextInput
                style={styles.input}
                value={valor}
                onChangeText={setValor}
                placeholder="0,00"
                keyboardType="numeric"
              />
              <TouchableOpacity 
                style={styles.buttonEndereco} 
                onPress={openModalEndereco}
              >
                <Text style={styles.textButtonEndereco}>Cadastrar Endereço</Text>
              </TouchableOpacity>

            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)} 
                style={styles.buttonFooterCancel}
              >
                <Text style={styles.buttonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={saveAgenda} 
                style={styles.buttonFooter}
              >
                <Text style={styles.buttonTextFooter}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal de serviços */}
      <Modal visible={modalServicoVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalBox, styles.modalServicoBox]}>
            <Text style={styles.modalTitle}>Serviços</Text>
            
            <View style={styles.novoServicoContainer}>
              <TextInput
                style={[styles.input, styles.novoServicoInput]}
                value={novoServico}
                onChangeText={setNovoServico}
                placeholder="Digite um novo serviço"
              />
              <TouchableOpacity 
                style={styles.addButton}
                onPress={adicionarServico}
              >
                <Ionicons name="save" size={24} color={colors.darkGray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.servicosList}>
              {servicosExistentes.map((s, i) => (
                <View key={i} style={styles.servicoItemContainer}>
                  <TouchableOpacity
                    style={styles.servicoOption}
                    onPress={() => selecionarServico(s)}
                  >
                    <Ionicons name="briefcase-outline" size={20} color={colors.primary} />
                    <Text style={styles.servicoOptionText}>{s}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteServicoButton}
                    onPress={() => removerServico(i)}
                  >
                    <Ionicons name="close-circle" size={22} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                onPress={() => setModalServicoVisible(false)}
                style={styles.buttonFooterCancel}
              >
                <Text style={styles.buttonTextCancel}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de endereço */}
      <Modal visible={modalEnderecoVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalBox}>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cadastrar Endereço</Text>

              <Text style={styles.label}>Rua*</Text>
              <TextInput
                style={styles.input}
                value={endereco.rua}
                onChangeText={text => setEndereco(prev => ({ ...prev, rua: text }))}
                placeholder="Nome da rua"
              />

              <Text style={styles.label}>Número*</Text>
              <TextInput
                style={styles.input}
                value={endereco.numero}
                onChangeText={text => setEndereco(prev => ({ ...prev, numero: text }))}
                placeholder="Número"
              />

              <Text style={styles.label}>Cidade*</Text>
              <TextInput
                style={styles.input}
                value={endereco.cidade}
                onChangeText={text => setEndereco(prev => ({ ...prev, cidade: text }))}
                placeholder="Cidade"
              />

              <Text style={styles.label}>Estado*</Text>
              <TextInput
                style={styles.input}
                value={endereco.estado}
                onChangeText={text => setEndereco(prev => ({ ...prev, estado: text }))}
                placeholder="Estado"
              />

              <Text style={styles.label}>CEP*</Text>
              <TextInput
                style={styles.input}
                value={endereco.cep}
                onChangeText={text => setEndereco(prev => ({ ...prev, cep: text }))}
                placeholder="00000-000"
                keyboardType="numeric"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                onPress={() => setModalEnderecoVisible(false)}
                style={styles.buttonFooterCancel}
              >
                <Text style={styles.buttonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={saveEndereco}
                style={styles.buttonFooter}
              >
                <Text style={styles.buttonTextFooter}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}