import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../colors/colors';
import { db } from '../../service/firebaseConnection';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { AuthContext } from '../../contexts/auth';
import apiViaCep from '../../service/apiViaCep';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style';

export default function Agendamentos({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const agendamentoEdit = route?.params?.agendamento || null;

  const [nomeCliente, setNomeCliente] = useState(agendamentoEdit?.nomeCliente || '');
  const [telefone, setTelefone] = useState(agendamentoEdit?.telefone || '');
  const [dataHora, setDataHora] = useState(agendamentoEdit?.dataHora ? new Date(agendamentoEdit.dataHora) : new Date());
  const [servico, setServico] = useState(agendamentoEdit?.servico || '');
  const [valor, setValor] = useState(agendamentoEdit?.valor || '');
  const [endereco, setEndereco] = useState(agendamentoEdit?.endereco || { rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' });
  const [status, setStatus] = useState(agendamentoEdit?.status || 'Pendente');
  const [servicosExistentes, setServicosExistentes] = useState([]);
  const [novoServico, setNovoServico] = useState('');
  const [modalServicoVisible, setModalServicoVisible] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [modalEnderecoVisible, setModalEnderecoVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    async function loadServicos() {
      try {
        const saved = await AsyncStorage.getItem('@servicos');
        if (saved) setServicosExistentes(JSON.parse(saved));
      } catch {
        setServicosExistentes([]);
      }
    }
    loadServicos();
  }, []);

  const handleSave = async () => {
    if (!nomeCliente || !telefone || !dataHora) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const agendamentoData = {
      nomeCliente,
      telefone,
      dataHora: dataHora.toISOString(),
      servico: servico || null,
      valor: valor || null,
      endereco: Object.values(endereco).some(e => e) ? endereco : null,
      status,
      uid: user?.uid || agendamentoEdit?.uid || null
    };

    try {
      if (agendamentoEdit?.id) {
        await updateDoc(doc(db, 'agendamentos', agendamentoEdit.id), agendamentoData);
        Alert.alert('Sucesso', 'Agendamento atualizado!');
      } else {
        await addDoc(collection(db, 'agendamentos'), agendamentoData);
        Alert.alert('Sucesso', 'Agendamento criado!');
      }
	   	setNomeCliente('');
		setTelefone('');
		setDataHora(new Date());
		setServico('');
		setValor('');
		setEndereco({ rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' });
		setStatus('Pendente');
      	navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o agendamento.');
    }
	finally {
	 	
	}
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'dismissed') return;
    const currentDate = selectedDate || dataHora;
    if (currentDate < new Date()) {
      Alert.alert('Erro', 'Não é permitido escolher datas anteriores!');
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

  const adicionarServico = () => {
    if (!novoServico.trim()) {
      Alert.alert('Erro', 'Digite o nome do serviço!');
      return;
    }
    const newList = [...servicosExistentes, novoServico.trim()];
    setServicosExistentes(newList);
    AsyncStorage.setItem('@servicos', JSON.stringify(newList));
    setServico(novoServico.trim());
    setNovoServico('');
    setModalServicoVisible(false);
  };

  const removerServico = (index) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: () => {
            const newList = [...servicosExistentes];
            newList.splice(index, 1);
            setServicosExistentes(newList);
            AsyncStorage.setItem('@servicos', JSON.stringify(newList));
            if (servico === servicosExistentes[index]) setServico('');
          }
        }
      ]
    );
  };

  const selecionarServico = (servicoSelecionado) => {
    setServico(servicoSelecionado);
    setModalServicoVisible(false);
  };

  const handleSearchCep = async () => {
    try {
      setLoadingCep(true);
      const cepSanitized = endereco.cep.replace(/\D/g, '');
      if (cepSanitized.length !== 8) {
        Alert.alert('Erro', 'CEP inválido! Deve conter 8 dígitos.');
        setLoadingCep(false);
        return;
      }
      const response = await apiViaCep.get(`${cepSanitized}/json/`);
      const data = response.data;
      setLoadingCep(false);
      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado.');
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
    } catch {
      setLoadingCep(false);
      Alert.alert('Erro', 'Não foi possível buscar o CEP. Tente novamente.');
    }
  };

  const saveEndereco = () => {
    const { rua, numero, bairro, cidade, estado, cep } = endereco;
    if (!rua || !numero || !bairro) {
      Alert.alert('Erro', 'Preencha todos os campos do endereço!');
      return;
    }
    setModalEnderecoVisible(false);
    Alert.alert('Sucesso', 'Endereço salvo com sucesso!');
  };

  const formatTelefone = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const formatValor = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (!cleaned) return '';
    let num = parseInt(cleaned, 10);
    let formatted = (num / 100).toFixed(2);
    formatted = formatted.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return formatted;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={styles.headerTitle}>{agendamentoEdit ? 'Editar Agendamento' : 'Novo Agendamento'}</Text>
        </View>

        <Text style={styles.label}>Nome do Cliente*</Text>
        <View style={styles.inputIconRowBox}>
          <Ionicons name="person-outline" size={20} color={colors.secondary} style={styles.inputIcon} />
          <TextInput
            style={styles.inputBox}
            value={nomeCliente}
            onChangeText={setNomeCliente}
            placeholder="Nome completo"
            placeholderTextColor={colors.gray}
          />
        </View>

        <Text style={styles.label}>Telefone*</Text>
        <View style={styles.inputIconRowBox}>
          <Ionicons name="call-outline" size={20} color={colors.secondary} style={styles.inputIcon} />
          <TextInput
            style={styles.inputBox}
            value={telefone}
            onChangeText={(text) => setTelefone(formatTelefone(text))}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            placeholderTextColor={colors.gray}
          />
        </View>

        <Text style={styles.label}>Data e Hora*</Text>
        <TouchableOpacity style={[styles.input, styles.inputIconRow]} onPress={() => setShowDatePicker(true)}>
          <MaterialIcons name="date-range" size={20} color={colors.secondary} style={styles.inputIcon} />
          <Text style={{ color: colors.text }}>{dataHora.toLocaleString('pt-BR')}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker value={dataHora} mode="date" display="default" onChange={onChangeDate} minimumDate={new Date()} />
        )}
        {showTimePicker && (
          <DateTimePicker value={dataHora} mode="time" display="default" onChange={onChangeTime} />
        )}

        <Text style={styles.label}>Serviço</Text>
        <TouchableOpacity style={[styles.input, styles.inputIconRow]} onPress={() => setModalServicoVisible(true)}>
          <FontAwesome5 name="tools" size={18} color={colors.secondary} style={styles.inputIcon} />
          <View style={{ width: 8 }} />
          <Text style={{ color: servico ? colors.text : colors.gray }}>{servico || 'Selecione um serviço'}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Valor (R$)</Text>
        <View style={styles.inputIconRowBox}>
          <FontAwesome5 name="money-bill-wave" size={18} color={colors.secondary} style={styles.inputIcon} />
          <TextInput
            style={styles.inputBox}
            value={valor}
            onChangeText={(text) => setValor(formatValor(text))}
            placeholder="0,00"
            keyboardType="numeric"
            placeholderTextColor={colors.gray}
          />
        </View>

        <TouchableOpacity style={styles.buttonEndereco} onPress={() => setModalEnderecoVisible(true)}>
          <Ionicons name="location-outline" size={18} color={colors.secondary} style={{ marginRight: 6 }} />
          <Text style={styles.textButtonEndereco}>Cadastrar Endereço</Text>
        </TouchableOpacity>

        {/* Modal de serviços */}
        <Modal visible={modalServicoVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={[styles.modalBox, { maxHeight: '85%' }]}>
              <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.headerTitle}>Serviços</Text>
                <View style={styles.servicoInputRow}>
                  <View style={[styles.inputIconRowBox, { flex: 1, marginBottom: 0 }]}>
                    <FontAwesome5 name="tools" size={18} color={colors.secondary} />
                    <TextInput
                      style={styles.inputBox}
                      value={novoServico}
                      onChangeText={setNovoServico}
                      placeholder="Novo serviço"
                      placeholderTextColor={colors.gray}
                      onSubmitEditing={adicionarServico}
                      returnKeyType="done"
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.buttonAddServico, { marginLeft: 8, height: 48, width: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 0 }]}
                    onPress={adicionarServico}
                  >
                    <MaterialIcons name="save" size={26} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={{ maxHeight: 200 }}>
                  {servicosExistentes.map((s, idx) => (
                    <TouchableOpacity key={idx} style={styles.servicoItem} onPress={() => selecionarServico(s)}>
                      <Text style={{ color: colors.text }}>{s}</Text>
                      <TouchableOpacity onPress={() => removerServico(idx)}>
                        <MaterialIcons name="delete" size={22} color={colors.error} style={{ marginLeft: 10 }} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <View style={{ width: '100%', paddingTop: 8 }}>
                <TouchableOpacity style={[styles.buttonCloseModal, { width: '100%', marginRight: 0, marginTop: 0 }]} onPress={() => setModalServicoVisible(false)}>
                  <Text style={styles.buttonTextCloseModal}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de endereço */}
        <Modal visible={modalEnderecoVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={[styles.modalBox, { maxHeight: '85%' }]}>
              <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Endereço</Text>
                <Text style={styles.label}>CEP*</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <View style={[styles.inputIconRowBox, { flex: 1, marginBottom: 0 }]}>
                    <MaterialIcons name="location-searching" size={20} color={colors.secondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputBox}
                      value={endereco.cep}
                      onChangeText={cep => setEndereco({ ...endereco, cep })}
                      placeholder="CEP"
                      keyboardType="numeric"
                      placeholderTextColor={colors.gray}
                    />
                  </View>
                  <TouchableOpacity style={styles.buttonBuscarCep} onPress={handleSearchCep}>
                    {loadingCep ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="search" size={22} color="#fff" />}
                  </TouchableOpacity>
                </View>

                {['rua', 'numero', 'bairro', 'cidade', 'estado'].map((campo, i) => (
                  <React.Fragment key={i}>
                    <Text style={styles.label}>{campo.charAt(0).toUpperCase() + campo.slice(1)}*</Text>
                    <View style={styles.inputIconRowBox}>
                      <MaterialIcons name={campo === 'numero' ? 'pin' : campo === 'cidade' ? 'location-city' : 'streetview'} size={20} color={colors.secondary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.inputBox}
                        value={endereco[campo]}
                        onChangeText={(text) => setEndereco({ ...endereco, [campo]: text })}
                        placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                        placeholderTextColor={colors.gray}
                        keyboardType={campo === 'numero' ? 'numeric' : 'default'}
                      />
                    </View>
                  </React.Fragment>
                ))}

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                  <TouchableOpacity style={[styles.buttonCloseModal, { flex: 1, marginRight: 8 }]} onPress={() => setModalEnderecoVisible(false)}>
                    <Text style={styles.buttonTextCloseModal}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.buttonSaveModal, { flex: 1 }]} onPress={saveEndereco}>
                    <Text style={styles.buttonTextSaveModal}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

      </ScrollView>

      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.buttonFooterCancel} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonTextCancel}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonFooter} onPress={handleSave}>
          <Text style={styles.buttonTextFooter}>{agendamentoEdit ? 'Salvar' : 'Agendar'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
