import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, FlatList, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import CustomAlert from '../../components/customAlert/CustomAlert';
import ListAgenda from '../../components/listAgenda/listAgenda';
import { AuthContext } from '../../contexts/Auth';
import { listenAgendamentos, updateAgendamento } from '../../services/firebase/firestoreService';
import { colors } from '../../themes/colors/Colors';
import '../../utils/LocaleConfig';
import styles from './styles';

import AdBanner from '../../components/adBanner/AdBanner';



export default function Home() {

  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  // Estados
  const [agendamentos, setAgendamentos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFiltro, setStatusFiltro] = useState('Todos');
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ title: '', message: '' });

  // Serviços
  const [servicosExistentes, setServicosExistentes] = useState([]);

  const [showCalendar, setShowCalendar] = useState(true);
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // Valor animado para a escala do FAB
  const fabScale = useRef(new Animated.Value(1)).current;

  const onPressInFab = () => {
    // Anima para uma escala menor
    Animated.spring(fabScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const onPressOutFab = () => {
    // Anima de volta para a escala original
    Animated.spring(fabScale, { toValue: 1, useNativeDriver: true }).start();
  };

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
    setListLoading(true);
    setListError(null);

    const unsubscribe = listenAgendamentos(
      user.uid,
      (data) => { // onData
        setAgendamentos(data);
        setListLoading(false);
      },
      (error) => { // onError
        setListError('Não foi possível carregar os agendamentos. Verifique sua conexão e tente novamente.');
        setListLoading(false);
        setAlertInfo({ title: 'Erro', message: 'Falha ao buscar dados.' });
        setAlertVisible(true);
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Atualizar status
  const updateStatus = async (id, novoStatus) => {
    // Atualiza o estado localmente de forma otimista
    setAgendamentos(prevAgendamentos =>
      prevAgendamentos.map(a => (a.id === id ? { ...a, status: novoStatus } : a))
    );

    try {
      await updateAgendamento(id, { status: novoStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert("Erro", "Não foi possível atualizar o status. Tente novamente.");

      // Reverte a mudança no estado local em caso de erro
      setAgendamentos(prevAgendamentos =>
        prevAgendamentos.map(a => (a.id === id ? { ...a, status: a.status } : a))
      );
    }
  };

  // Função para lidar com a exclusão vinda do componente filho
  const handleDeleteResult = (id, result) => {
    // Mostra o alerta de sucesso ou erro
    setAlertInfo({
      title: result.success ? "Sucesso" : "Erro",
      message: result.message,
    });
    setAlertVisible(true);

    // Se a exclusão foi bem-sucedida, remove o item da lista local
    if (result.success) {
      setAgendamentos(prev => prev.filter(a => a.id !== id));
    }
  };

  // Função para obter dias da semana
  const getWeekDays = (dateStr) => {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    // Constrói a data de forma segura para evitar problemas de fuso horário
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const sunday = new Date(date); sunday.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(sunday); d.setDate(sunday.getDate() + i);
      return { label: diasSemana[i], date: formatDateLocal(d), day: d.getDate() };
    });
  };

  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
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
      calendarMarks[date] = { selected: date === selectedDate, selectedColor: date === selectedDate ? colors.secondary : bg, count: marks[date].count };
    });
    if (!calendarMarks[selectedDate]) calendarMarks[selectedDate] = { selected: true, selectedColor: colors.secondary };
    return calendarMarks;
  }, [agendamentos, selectedDate]);



  return (
    <View style={styles.container}>
      <CustomAlert
        visible={alertVisible}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={() => setAlertVisible(false)}
      />

      {/* Calendário sempre visível */}
      {showCalendar && (
        <View style={{ backgroundColor: colors.white, borderRadius: 10, padding: 4, marginTop: 0, marginBottom: 4, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2 }}>
          {showFullCalendar ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 4, marginTop: 4, paddingHorizontal: 2 }}>
                <TouchableOpacity onPress={() => setShowFullCalendar(false)} style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
                  <Ionicons name="chevron-up-outline" size={18} color={colors.secondary} />
                  <Text style={{ color: colors.secondary, fontSize: 13, marginLeft: 2 }}>Toque para recolher o calendário</Text>
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
            <TouchableOpacity onPress={() => setShowFullCalendar(true)} activeOpacity={0.8} style={{ paddingVertical: 2 }}>
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
              <Text style={{ textAlign: 'center', color: colors.secondary, marginTop: 10, marginBottom: 10, fontSize: 12 }}>Toque para expandir o calendário</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {listLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : (
        <FlatList
          key={'_'}
          numColumns={1}
          data={agendamentos.filter(item => {
            if (!item.dataHora) return false;
            const data = typeof item.dataHora === 'string' ? item.dataHora : (item.dataHora.toDate ? item.dataHora.toDate().toISOString() : '');
            const matchDate = data.startsWith(selectedDate);
            const matchStatus = statusFiltro === 'Todos' ? true : (item.status === statusFiltro);
            return matchDate && matchStatus;
          })}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListAgenda
              data={{ ...item, onDelete: handleDeleteResult }}
              onUpdateStatus={updateStatus}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name={listError ? "cloud-offline-outline" : "calendar-outline"} size={60} color="#ccc" />
              <Text style={styles.emptyText}>{listError || 'Nenhum agendamento para este dia'}</Text>
            </View>
          }
        />
      )}
      {/* Botão de ação flutuante para adicionar agendamento */}
      <Animated.View style={[{ transform: [{ scale: fabScale }] }, styles.fab]}>
        <Pressable
          onPress={() => navigation.navigate('Agendar')}
          onPressIn={onPressInFab}
          onPressOut={onPressOutFab}
          style={styles.fabPressable}
        >
          <Ionicons name="add" size={32} color={colors.white} />
        </Pressable>
      </Animated.View>
    </View>
  );
}
