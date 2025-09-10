import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput,  ScrollView, Platform, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
// Configuração do calendário para o padrão brasileiro
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../service/firebaseConnection';
import { collection, addDoc, getDocs, updateDoc, doc, setDoc, query, where, onSnapshot } from 'firebase/firestore';

import styles from './style';
import { colors } from '../../colors/colors';
import { Ionicons } from '@expo/vector-icons';

import Header from '../../components/header/header';
import ListAgenda from '../../components/listAgenda/listAgenda';
import { AuthContext } from '../../contexts/auth';

import apiViaCep from '../../service/apiViaCep';

export default function Home() {
  // Função utilitária para obter os dias da semana da data selecionada
  function getWeekDays(dateStr) {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const date = new Date(dateStr);
    const week = [];
    // Encontra o domingo da semana
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - date.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      week.push({
        label: diasSemana[i],
        date: d.toISOString().split('T')[0],
        day: d.getDate(),
      });
    }
    return week;
  }
  // Estado para mostrar/esconder o calendário
  const [showCalendar, setShowCalendar] = useState(true);
  const [showFullCalendar, setShowFullCalendar] = useState(false); // Começa reduzido
  const scrollOffset = React.useRef(0);
  const { user, loading } = useContext(AuthContext);
  const [agendamentos, setAgendamentos] = useState([]);
  // Corrige fuso horário para garantir a data local
  function getLocalDateString() {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISO = new Date(now.getTime() - tzOffset).toISOString();
    return localISO.split('T')[0];
  }
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  // Filtro de status
  const [statusFiltro, setStatusFiltro] = useState('Todos');
  // Marcações do calendário: sempre atualizadas conforme agendamentos e selectedDate
  const markedDates = useMemo(() => {
    const marks = {};
    agendamentos.map(agenda => {
      let dataStr = '';
      if (agenda.dataHora) {
        if (typeof agenda.dataHora === 'string') {
          dataStr = agenda.dataHora.split('T')[0];
        } else if (agenda.dataHora.toDate) {
          dataStr = agenda.dataHora.toDate().toISOString().split('T')[0];
        }
      }
      if (!dataStr) return;
      if (!marks[dataStr]) marks[dataStr] = { count: 0, status: {} };
      marks[dataStr].count++;
      marks[dataStr].status[agenda.status] = (marks[dataStr].status[agenda.status] || 0) + 1;
    });
    const calendarMarks = {};
    Object.keys(marks).forEach(date => {
      let bg = colors.success;
      if (marks[date].status['Cancelado']) bg = colors.error;
      else if (marks[date].status['Pendente']) bg = colors.warning;
      else if (marks[date].status['Concluído']) bg = colors.success;
      calendarMarks[date] = {
        selected: date === selectedDate,
        selectedColor: date === selectedDate ? colors.secondary : bg,
        count: marks[date].count,
      };
    });
    if (!calendarMarks[selectedDate]) {
      calendarMarks[selectedDate] = {
        selected: true,
        selectedColor: colors.secondary,
      };
    }
    return calendarMarks;
  }, [agendamentos, selectedDate]);

  // O calendário ficará sempre aberto, não precisa de estado para expandir/colapsar

  // Função para formatar data
  function formatDateHeader(dateStr) {
    const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const [ano, mes, dia] = dateStr.split('-');
    return `${dia} ${meses[parseInt(mes,10)-1]} ${ano}`;
  }


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
    rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: ''
  });

  // Serviços e novo serviço
  const [servicosExistentes, setServicosExistentes] = useState([]);
  const [novoServico, setNovoServico] = useState('');
  const [ loadingCep, setLoadingCep] = useState(false);


  // Carrega serviços e agendamentos do storage/Firebase

  useEffect(() => {
    loadServicos();
  }, [user]);


  // Listener em tempo real para agendamentos do usuário
  useEffect(() => {
    if (!user?.uid) return;
    const agendamentosRef = collection(db, 'agendamentos');
    const q = query(agendamentosRef, where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const agendamentosData = [];
      querySnapshot.forEach((doc) => {
        agendamentosData.push({ ...doc.data(), id: doc.id });
      });
      const agendamentosComStatus = agendamentosData.map(agenda => ({
        ...agenda,
        status: agenda.status || 'Pendente'
      }));
      setAgendamentos(agendamentosComStatus);
    });
    return () => unsubscribe();
  // Marcações do calendário: sempre atualizadas conforme agendamentos e selectedDate
  const markedDates = useMemo(() => {
    const marks = {};
    agendamentos.map(agenda => {
      let dataStr = '';
      if (agenda.dataHora) {
        if (typeof agenda.dataHora === 'string') {
          dataStr = agenda.dataHora.split('T')[0];
        } else if (agenda.dataHora.toDate) {
          dataStr = agenda.dataHora.toDate().toISOString().split('T')[0];
        }
      }
      if (!dataStr) return;
      if (!marks[dataStr]) marks[dataStr] = { count: 0, status: {} };
      marks[dataStr].count++;
      marks[dataStr].status[agenda.status] = (marks[dataStr].status[agenda.status] || 0) + 1;
    });
    const calendarMarks = {};
    Object.keys(marks).forEach(date => {
      let bg = colors.success;
      if (marks[date].status['Cancelado']) bg = colors.error;
      else if (marks[date].status['Pendente']) bg = colors.warning;
      else if (marks[date].status['Concluído']) bg = colors.success;
      calendarMarks[date] = {
        selected: date === selectedDate,
        selectedColor: date === selectedDate ? colors.secondary : bg,
        customStyles: {
          container: {
            backgroundColor: date === selectedDate ? colors.secondary : bg,
            borderRadius: 16,
          },
          text: {
            color: date === selectedDate ? colors.white : colors.text,
            fontWeight: date === selectedDate ? 'bold' : 'normal',
          },
        },
        dots: [
          { key: 'count', color: colors.primary, selectedDotColor: colors.white }
        ],
        count: marks[date].count
      };
    });
    // Garante que o dia selecionado sempre aparece como selecionado
    if (!calendarMarks[selectedDate]) {
      calendarMarks[selectedDate] = {
        selected: true,
        selectedColor: colors.secondary,
        customStyles: {
          container: { backgroundColor: colors.secondary, borderRadius: 16 },
          text: { color: colors.white, fontWeight: 'bold' },
        },
        count: 0
      };
    }
    return calendarMarks;
  }, [agendamentos, selectedDate]);
  }, [user]);

  const loadServicos = async () => {
    try {
      const saved = await AsyncStorage.getItem('@servicos');
      if (saved) setServicosExistentes(JSON.parse(saved));
    } catch (e) {
      console.log('Erro ao carregar serviços', e);
    }
  };

  // Carregar agendamentos do Firestore apenas do usuário logado
  const loadAgendamentosFirestore = async () => {
    if (!user?.uid) return;
    try {
      const agendamentosRef = collection(db, 'agendamentos');
      const q = query(agendamentosRef, where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const agendamentosData = [];
      querySnapshot.forEach((doc) => {
        agendamentosData.push({ ...doc.data(), id: doc.id });
      });
      // Garante que todos tenham status
      const agendamentosComStatus = agendamentosData.map(agenda => ({
        ...agenda,
        status: agenda.status || 'Pendente'
      }));
      setAgendamentos(agendamentosComStatus);
    } catch (e) {
      console.log('Erro ao carregar agendamentos do Firestore', e);
    }
  };

  const saveServicosStorage = async (list) => {
    try {
      await AsyncStorage.setItem('@servicos', JSON.stringify(list));
    } catch (e) {
      console.log('Erro ao salvar serviços', e);
    }
  };


  // Salvar novo agendamento no Firestore
  const saveAgendamentoFirestore = async (agendamento) => {
    try {
      await addDoc(collection(db, 'agendamentos'), agendamento);
    } catch (e) {
      console.log('Erro ao salvar agendamento no Firestore', e);
    }
  };

  // Atualizar agendamento no Firestore
  const updateAgendamentoFirestore = async (id, data) => {
    try {
      const agendamentoRef = doc(db, 'agendamentos', id);
      await updateDoc(agendamentoRef, data);
    } catch (e) {
      console.log('Erro ao atualizar agendamento no Firestore', e);
    }
  };

  // Abrir modais
  const openModal = () => setModalVisible(true);
  const openModalEndereco = () => setModalEnderecoVisible(true);
  const openModalServico = () => setModalServicoVisible(true);

  // Salvar endereço
  const saveEndereco = () => {
    const { rua, numero, bairro, cidade, estado, cep } = endereco;
    if (!rua || !numero || !bairro || !cidade || !estado || !cep) {
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
      nomeCliente,
      telefone,
      dataHora: dataHora.toISOString(),
      servico: servico || null,
      valor: valor || null,
      endereco: Object.values(endereco).some(e => e) ? endereco : null,
      status: 'Pendente',
      uid: user?.uid || null
    };
    await saveAgendamentoFirestore(novoAgendamento);
    setModalVisible(false);
    // Reset dos campos
    setNomeCliente('');
    setTelefone('');
    setDataHora(new Date());
    setServico('');
    setValor('');
    setEndereco({ rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' });
    // Recarrega agendamentos
    loadAgendamentosFirestore();
    Alert.alert("Sucesso", "Agendamento cadastrado!");
  };

  // Atualizar status do agendamento
  const updateStatus = async (id, novoStatus) => {
    // Atualiza localmente
    const novosAgendamentos = agendamentos.map(agenda => 
      agenda.id === id ? { ...agenda, status: novoStatus } : agenda
    );
    setAgendamentos(novosAgendamentos);
    // Atualiza no Firestore
    await updateAgendamentoFirestore(id, { status: novoStatus });
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
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          onPress: async () => {
            const newList = [...servicosExistentes];
            newList.splice(index, 1);
            setServicosExistentes(newList);
            await saveServicosStorage(newList);
            if (servico === servicosExistentes[index]) setServico('');
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

  // Buscar CEP e preencher endereço
  const handleSearchCep = async () => {
    
    try {
      setLoadingCep(true);
      const cepSanitized = endereco.cep.replace(/\D/g, '');
      if (cepSanitized.length !== 8) {
        Alert.alert("Erro", "CEP inválido! Deve conter 8 dígitos.");
        return;
      }

      const response = await apiViaCep.get(`${cepSanitized}/json/`);
      const data = response.data;
      setLoadingCep(false);

      if (data.erro) {
        Alert.alert("Erro", "CEP não encontrado.");
        return;
      }

      setEndereco(prev => ({
        ...prev,
        rua: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
        cep: cepSanitized
      }));

    } catch (error) {
      console.error("Erro ao buscar CEP:", error.message);
      Alert.alert("Erro", "Não foi possível buscar o CEP. Tente novamente.");
      setLoadingCep(false);
    }
  };

  return (
  <View style={styles.container}>

      {/* Calendário sempre visível */}
      {showCalendar && (
        <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: 8, marginTop: 8, marginBottom: 8, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 }}>
          {showFullCalendar ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 4 }}>
                <TouchableOpacity onPress={() => setShowFullCalendar(false)} style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
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
                      onPress={() => {
                        setSelectedDate(dateStr);
                      }}
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
            <TouchableOpacity onPress={() => setShowFullCalendar(true)} activeOpacity={0.8} style={{paddingVertical: 4}}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 }}>
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
              <Text style={{ textAlign: 'center', color: colors.secondary, marginTop: 4, fontSize: 13 }}>Toque para expandir o calendário</Text>
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
              <TouchableOpacity onPress={saveAgenda} style={styles.buttonFooter}>
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
        onPress={() => setModalVisible(true)}
      >
  <Ionicons name="add" size={32} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}
