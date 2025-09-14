import React, { useEffect, useState, useContext, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, Platform, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import ListAgenda from '../../components/listAgenda/listAgenda';
import styles from './style';
import { colors } from '../../colors/colors';
import { buscarCep } from '../../services/apiViaCep/apiViaCepService';
import { listenAgendamentos, createAgendamento, updateAgendamento } from '../../services/firebase/firestoreService';

// Configuração do calendário para padrão brasileiro
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function Home() {

  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  // Estados
  const [agendamentos, setAgendamentos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFiltro, setStatusFiltro] = useState('Todos');

  // Modais
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEnderecoVisible, setModalEnderecoVisible] = useState(false);
  const [modalServicoVisible, setModalServicoVisible] = useState(false);

  // Campos agendamento
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataHora, setDataHora] = useState(new Date());
  const [servico, setServico] = useState('');
  const [valor, setValor] = useState('');
  const [endereco, setEndereco] = useState({ rua:'', numero:'', bairro:'', cidade:'', estado:'', cep:'' });

  // Serviços
  const [servicosExistentes, setServicosExistentes] = useState([]);
  const [novoServico, setNovoServico] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);

  const [showCalendar, setShowCalendar] = useState(true);
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Carrega serviços do AsyncStorage
  useEffect(() => {
    const loadServicos = async () => {
      const saved = await AsyncStorage.getItem('@servicos');
      if (saved) setServicosExistentes(JSON.parse(saved));
    };
    loadServicos();
  }, []);

  // Listener de agendamentos em tempo real
  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = listenAgendamentos(user.uid, setAgendamentos);
    return () => unsubscribe();
  }, [user]);

  // Limpa os campos do formulário do modal
  const limparCampos = () => {
    setNomeCliente('');
    setTelefone('');
    setDataHora(new Date());
    setServico('');
    setValor('');
    setEndereco({ rua:'', numero:'', bairro:'', cidade:'', estado:'', cep:'' });
  };

  // Função salvar agendamento
  const handleSaveAgendamento = async () => {
    try {
      // Chama o serviço para criar um novo agendamento (o segundo parâmetro é null)
      await salvarAgendamento({  nomeCliente,   telefone,  dataHora,  servico,  valor,  endereco,  status: 'Pendente', // Status padrão para novos agendamentos  uid: user.uid
       uid: user.uid,});
      Alert.alert("Sucesso", "Agendamento cadastrado!");
      setModalVisible(false); // Fecha o modal
      limparCampos(); // Limpa os campos para o próximo uso
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o agendamento. Tente novamente.");
    }
  };


  // Atualizar status
 const updateStatus = async (id, novoStatus) => {
  const agendamentoAnterior = agendamentos.find(a => a.id === id);
  const novosAgendamentos = agendamentos.map(a =>
    a.id === id ? { ...a, status: novoStatus } : a
  );
  setAgendamentos(novosAgendamentos);

  try {
      await updateAgendamento(id, { status: novoStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert("Erro", "Não foi possível atualizar o status. Tente novamente.");
      
      // Reverte para o status anterior
      setAgendamentos(agendamentos.map(a =>
        a.id === id ? agendamentoAnterior : a
      ));
    }
  };


  // Buscar CEP
  const handleSearchCep = async () => {
    setLoadingCep(true);
    try {
      const data = await buscarCep(endereco.cep);
      setEndereco(prev => ({ ...prev, ...data }));
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoadingCep(false);
    }
  };

  // Adicionar serviço
  const adicionarServico = async () => {
    if (!novoServico.trim()) {
      Alert.alert("Erro", "Digite o nome do serviço!");
      return;
    }
    const newList = [...servicosExistentes, novoServico.trim()];
    setServicosExistentes(newList);
    await AsyncStorage.setItem('@servicos', JSON.stringify(newList));
    setServico(novoServico.trim());
    setNovoServico('');
    setModalServicoVisible(false);
  };

  const removerServico = async (index) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este serviço?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: async () => {
            const newList = [...servicosExistentes];
            newList.splice(index, 1);
            setServicosExistentes(newList);
            await AsyncStorage.setItem('@servicos', JSON.stringify(newList));
            if (servico === servicosExistentes[index]) setServico('');
          }
        }
      ]
    );
  };

  const selecionarServico = (s) => {
    setServico(s);
    setModalServicoVisible(false);
  };

  // Funções para abrir modais
  const openModalServico = () => setModalServicoVisible(true);
  const openModalEndereco = () => setModalEnderecoVisible(true);

  // DateTimePicker
  const onChangeDate = (event, selected) => {
    const currentDate = selected || dataHora;
    setShowDatePicker(false);
    setDataHora(currentDate);
    setShowTimePicker(true);
  };
  const onChangeTime = (event, selected) => {
    const currentTime = selected || dataHora;
    setShowTimePicker(false);
    setDataHora(currentTime);
  };

  // Salvar endereço
  const saveEndereco = () => {
    setModalEnderecoVisible(false);
    Alert.alert("Sucesso", "Endereço salvo!");
  };

  // Função para obter dias da semana
  const getWeekDays = (dateStr) => {
    const diasSemana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const date = new Date(dateStr);
    const sunday = new Date(date); sunday.setDate(date.getDate() - date.getDay());
    return Array.from({length: 7}).map((_, i) => {
      const d = new Date(sunday); d.setDate(sunday.getDate() + i);
      return { label: diasSemana[i], date: formatDateLocal(d), day: d.getDate() };
    });
  };

  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth()+1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');
    return `${year}-${month}-${day}`;
  };

  const getLocalDateString = () => formatDateLocal(new Date());

  // Marcação calendário
  const markedDates = useMemo(() => {
    const marks = {};
    agendamentos.forEach(agenda => {
      let dataStr = '';
      if (agenda.dataHora) dataStr = typeof agenda.dataHora === 'string' ? agenda.dataHora.split('T')[0] : agenda.dataHora.toDate().toISOString().split('T')[0];
      if (!dataStr) return;
      if (!marks[dataStr]) marks[dataStr] = { count: 0, status: {} };
      marks[dataStr].count++; marks[dataStr].status[agenda.status] = (marks[dataStr].status[agenda.status] || 0) + 1;
    });
    const calendarMarks = {};
    Object.keys(marks).forEach(date => {
      let bg = colors.success;
      if (marks[date].status['Cancelado']) bg = colors.error;
      else if (marks[date].status['Pendente']) bg = colors.warning;
      calendarMarks[date] = { selected: date===selectedDate, selectedColor: date===selectedDate?colors.secondary:bg, count: marks[date].count };
    });
    if (!calendarMarks[selectedDate]) calendarMarks[selectedDate] = { selected: true, selectedColor: colors.secondary };
    return calendarMarks;
  }, [agendamentos, selectedDate]);

  return (
  <View style={styles.container}>

      {/* Calendário sempre visível */}
      {showCalendar && (
        <View style={{ backgroundColor: colors.white, borderRadius: 10, padding: 4, marginTop: 0, marginBottom: 4, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2 }}>
          {showFullCalendar ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 4 }}>
                <TouchableOpacity onPress={() => { setShowFullCalendar(false); setSelectedDate(getLocalDateString()); }} style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
                  <Ionicons name="chevron-up-outline" size={18} color={colors.secondary} />
                  <Text style={{ color: colors.secondary, fontSize: 13, marginLeft: 2 }}>Recolher calendário</Text>
                </TouchableOpacity>
              </View>
              <Calendar
                onDayPress={day => {
                 setSelectedDate(day.dateString); 
                }}
                markingType={'multi-dot'}
                markedDates={markedDates}
                style={{ borderRadius: 10, minWidth: 300 }}
                theme={{
                  todayTextColor: colors.primary,
                  selectedDayBackgroundColor: colors.secondary,
                  arrowColor: colors.secondary,
                  textDayFontSize: 15,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 13,
                }}
                firstDay={0}
                dayComponent={({ date, state }) => {
                  const dateStr = date.dateString;
                  const marking = markedDates[dateStr] || {};
                  const isSelected = marking.selected;
                  const bgColor = isSelected ? colors.secondary : marking.selectedColor || 'transparent';
                  const textColor = isSelected ? colors.white : colors.text;
                  const fontWeight = isSelected ? 'bold' : 'normal';
                  return (
                    <TouchableOpacity
                      style={{ alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 17, backgroundColor: bgColor }}
                      onPress={() => setSelectedDate(dateStr)}
                      activeOpacity={0.7}
                    >
                      <Text style={{ color: textColor, fontWeight, fontSize: 14 }}>{date.day}</Text>
                      {marking && marking.count > 0 && (
                        <View style={{ position: 'absolute', bottom: 1, right: 1, backgroundColor: colors.primary, borderRadius: 7, paddingHorizontal: 3, minWidth: 13 }}>
                          <Text style={{ color: colors.white, fontSize: 9, textAlign: 'center' }}>{marking.count}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          ) : (
            <TouchableOpacity onPress={() => setShowFullCalendar(true)} activeOpacity={0.8} style={{paddingVertical: 2}}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 2 }}>
                {getWeekDays(selectedDate).map((d, idx) => {
                  const isSelected = d.date === selectedDate;
                  return (
                    <TouchableOpacity
                      key={d.date}
                      onPress={() => setSelectedDate(d.date)}
                      style={{ alignItems: 'center', flex: 1 }}
                      activeOpacity={0.7}
                    >
                      <Text style={{ color: colors.text, fontSize: 12, marginBottom: 2 }}>{d.label}</Text>
                      <View style={{
                        width: 32, height: 32, borderRadius: 16,
                        backgroundColor: isSelected ? colors.secondary : 'transparent',
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: isSelected ? 0 : 1, borderColor: '#eee',
                      }}>
                        <Text style={{ color: isSelected ? colors.white : colors.text, fontWeight: isSelected ? 'bold' : 'normal', fontSize: 15 }}>{d.day}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={{ textAlign: 'center', color: colors.secondary, marginTop: 2, fontSize: 12 }}>Toque para expandir o calendário</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={agendamentos.filter(item => {
          // Considera apenas a data (YYYY-MM-DD) do campo dataHora
          if (!item.dataHora) return false;
          const data = typeof item.dataHora === 'string' ? item.dataHora : (item.dataHora.toDate ? item.dataHora.toDate().toISOString() : '');
          const matchDate = data.startsWith(selectedDate);
          const matchStatus = statusFiltro === 'Todos' ? true : (item.status === statusFiltro);
          return matchDate && matchStatus;
        })}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListAgenda 
            data={{...item, onDelete: (id) => setAgendamentos(agendamentos.filter(a => a.id !== id))}}
            onUpdateStatus={updateStatus} 
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
  // Não faz mais nada ao rolar, só o clique expande
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
              <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                <Text>{dataHora.toLocaleString('pt-BR')}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={dataHora}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
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
              <TouchableOpacity style={styles.input} onPress={openModalServico}>
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

              <TouchableOpacity style={styles.buttonEndereco} onPress={openModalEndereco}>
                <Text style={styles.textButtonEndereco}>Cadastrar Endereço</Text>
              </TouchableOpacity>

            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.buttonFooterCancel}>
                <Text style={styles.buttonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveAgendamento} style={styles.buttonFooter}>
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
              <TouchableOpacity style={styles.addButton} onPress={adicionarServico}>
                <Ionicons name="save" size={24} color={colors.darkGray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.servicosList}>
              {servicosExistentes.map((s, i) => (
                <View key={i} style={styles.servicoItemContainer}>
                  <TouchableOpacity style={styles.servicoOption} onPress={() => selecionarServico(s)}>
                    <Ionicons name="briefcase-outline" size={20} color={colors.primary} />
                    <Text style={styles.servicoOptionText}>{s}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteServicoButton} onPress={() => removerServico(i)}>
                    <Ionicons name="close-circle" size={22} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={() => setModalServicoVisible(false)} style={styles.buttonFooterCancel}>
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

              <Text style={styles.label}>CEP*</Text>
              <TextInput
                style={styles.input}
                value={endereco.cep}
                onChangeText={text => setEndereco(prev => ({ ...prev, cep: text }))}
                placeholder="00000-000"
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.buttonSearchCep} onPress={handleSearchCep}>
                {
                  loadingCep ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.textButtonSearchCep}>Buscar CEP</Text>
                  )
                }
                
              </TouchableOpacity>

              <Text style={styles.label}>Rua*</Text>
              <TextInput
                style={styles.input}
                value={endereco.rua}
                onChangeText={text => setEndereco(prev => ({ ...prev, rua: text }))}
                placeholder="Nome da rua"
              />

              <Text style={styles.label}>Bairro*</Text>
              <TextInput
                style={styles.input}
                value={endereco.bairro}
                onChangeText={text => setEndereco(prev => ({ ...prev, bairro: text }))}
                placeholder="Bairro"
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
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={() => setModalEnderecoVisible(false)} style={styles.buttonFooterCancel}>
                <Text style={styles.buttonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEndereco} style={styles.buttonFooter}>
                <Text style={styles.buttonTextFooter}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Botão de ação flutuante para adicionar agendamento */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Agendar')}
      >
        <Ionicons name="add" size={32} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}
