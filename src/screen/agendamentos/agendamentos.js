import React, { useState, useEffect, useContext, useCallback } from 'react';
import {  View,  Text,  TextInput, TouchableOpacity,  Alert, ScrollView,  Platform, KeyboardAvoidingView, Modal, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { buscarCep } from '../../services/apiViaCep/apiViaCepService';
import { salvarAgendamento } from '../../services/agendamentoService/agendamentoService';

import styles from './style';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../colors/colors';

import DateTimePicker from '@react-native-community/datetimepicker';
import CustomAlert from '../../components/customAlert/CustomAlert';
import ActionAlert from '../../components/actionAlert/actionAlert';

import { salvarServicos, carregarServicos } from '../../services/servico/servico';




export default function Agendamentos({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const [agendamentoEdit, setAgendamentoEdit] = useState(route?.params?.agendamento || null);

  const [nomeCliente, setNomeCliente] = useState(agendamentoEdit?.nomeCliente || '');
  const [telefone, setTelefone] = useState(agendamentoEdit?.telefone || '');
  const [dataHora, setDataHora] = useState(agendamentoEdit?.dataHora ? new Date(agendamentoEdit.dataHora) : new Date());
  const [servico, setServico] = useState(agendamentoEdit?.servico || '');
  const [valor, setValor] = useState('');
  const [endereco, setEndereco] = useState(agendamentoEdit?.endereco || { rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' });
  const [status, setStatus] = useState(agendamentoEdit?.status || 'Pendente');
  const [servicosExistentes, setServicosExistentes] = useState([]);
  const [novoServico, setNovoServico] = useState('');
  const [modalServicoVisible, setModalServicoVisible] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [modalEnderecoVisible, setModalEnderecoVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ title: '', message: '' });
  const [onAlertCloseAction, setOnAlertCloseAction] = useState(null);

  const [actionAlertVisible, setActionAlertVisible] = useState(false);
  const [actionAlertInfo, setActionAlertInfo] = useState({ title: '', message: '' });
  const [onActionAlertConfirm, setOnActionAlertConfirm] = useState(null);

  // Limpa os campos do formulário
  const limparCampos = () => {
    setNomeCliente('');
    setTelefone('');
    setDataHora(new Date());
    setServico('');
    setValor('');
    setEndereco({ rua:'', numero:'', bairro:'', cidade:'', estado:'', cep:'' });
    setStatus('Pendente');
    setAgendamentoEdit(null);
  };

  // Efeito que roda toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      const agendamentoParam = route.params?.agendamento;
      if (agendamentoParam) {
        // Se veio um agendamento para editar, preenche os campos
        setAgendamentoEdit(agendamentoParam);
        setNomeCliente(agendamentoParam.nomeCliente || '');
        setTelefone(agendamentoParam.telefone || '');
        setDataHora(agendamentoParam.dataHora ? new Date(agendamentoParam.dataHora) : new Date());
        setServico(agendamentoParam.servico || '');
        setEndereco(agendamentoParam.endereco || { rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' });
        setStatus(agendamentoParam.status || 'Pendente');
        setValor(agendamentoParam.valor ? formatValor(String(agendamentoParam.valor).replace(/\D/g, '')) : '');
      } else {
        // Se não veio parâmetro, limpa tudo para garantir que é uma nova criação
        limparCampos();
      }
    }, [route.params?.agendamento])
  );

  useEffect(() => {
    async function loadServicos() {
      // Carrega os serviços salvos no AsyncStorage
      const servicosSalvos = await carregarServicos();
      setServicosExistentes(servicosSalvos);
    }
    loadServicos(); // Chama a função para carregar os serviços quando o componente é montado
  }, []);

  const handleSaveAgendamento = async () => {
    if (!nomeCliente || !telefone || !dataHora) {
      setAlertInfo({ title: 'Atenção', message: 'Por favor, preencha todos os campos.' });
      setAlertVisible(true);
      return;
    }
    try {
      await salvarAgendamento({nomeCliente, telefone, dataHora, servico, valor, endereco, status, uid: user.uid  }, agendamentoEdit?.id);
      setAlertInfo({ title: "Sucesso", message: `Agendamento ${agendamentoEdit ? 'atualizado' : 'cadastrado'}!` });
      setOnAlertCloseAction(() => () => {
        limparCampos();
        navigation.goBack();
      });
      setAlertVisible(true);
    } catch (error) {
      setAlertInfo({ title: "Erro", message: "Não foi possível salvar o agendamento. Tente novamente." });
      setAlertVisible(true);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'dismissed') return;
    const currentDate = selectedDate || dataHora;
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

  const adicionarServico = async () => {
    const servicoParaAdicionar = novoServico.trim();

    if (!servicoParaAdicionar) {
      setAlertInfo({ title: 'Atenção', message: 'Por favor, informe um serviço!' });
      setAlertVisible(true);
      return;
    }

    // Verifica se o serviço já existe (ignorando maiúsculas/minúsculas)
    if (servicosExistentes.some(s => s.toLowerCase() === servicoParaAdicionar.toLowerCase())) {
      setAlertInfo({ title: 'Atenção', message: 'Este serviço já foi adicionado.' });
      setAlertVisible(true);
      return;
    }

    const newList = [...servicosExistentes, servicoParaAdicionar];
    setServicosExistentes(newList);

    // Salva a lista completa no AsyncStorage
    await salvarServicos(newList);

    setServico(servicoParaAdicionar);
    setNovoServico('');
    setModalServicoVisible(false);
  };


  const removerServico = (index) => {
    const servicoParaRemover = servicosExistentes[index];
    if (!servicoParaRemover) return;

    setActionAlertInfo({ title: 'Excluir Serviço', message: `Tem certeza que deseja excluir "${servicoParaRemover}"?` });

    // Define a função que será executada ao confirmar a exclusão
    setOnActionAlertConfirm(() => async () => {
      const newList = servicosExistentes.filter((_, i) => i !== index);
      setServicosExistentes(newList);

      // Salva a lista atualizada no AsyncStorage
      await salvarServicos(newList);

      // Se o serviço removido era o que estava selecionado, limpa a seleção
      if (servico === servicoParaRemover) setServico('');
    });

    setActionAlertVisible(true);
  };


  const selecionarServico = (servicoSelecionado) => {
      setServico(servicoSelecionado);
      setModalServicoVisible(false);
    };


  // busca o cep
  const handleSearchCep = async () => {
  setLoadingCep(true);

  if (!endereco.cep || endereco.cep.length !== 8) {
    setAlertInfo({ title: 'Atenção', message: 'Por favor, informe um CEP válido.' });
    setAlertVisible(true);
    setLoadingCep(false);
    return;
  }

  try {
    const resultado = await buscarCep(endereco.cep);
    if (resultado) {
      setEndereco(prev => ({ ...prev, ...resultado }));
    }
  } catch (error) {
    setAlertInfo({ title: 'Erro', message: error.message });
    setAlertVisible(true);
  } finally {
    setLoadingCep(false);
  }
};



  const saveEndereco = () => {
    const { rua, numero, bairro, cidade, estado, cep } = endereco;
    if (!rua || !numero || !bairro) {
      setAlertInfo({ title: 'Erro', message: 'Preencha todos os campos do endereço!' });
      setAlertVisible(true);
      return;
    }
    setModalEnderecoVisible(false);
    setAlertInfo({ title: 'Sucesso', message: 'Endereço salvo!' });
    setAlertVisible(true);

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
      <CustomAlert
        visible={alertVisible}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={() => {
          setAlertVisible(false);
          if (typeof onAlertCloseAction === 'function') onAlertCloseAction();
          setOnAlertCloseAction(null); // Limpa a ação após a execução
        }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>{agendamentoEdit ? 'Editar Agendamento' : 'Novo Agendamento'}</Text>
        </View>

        <Text style={styles.label}>Nome do Cliente*</Text>
        <View style={styles.inputIconRowBox}>
          <Ionicons name="person-outline" size={20} color={colors.secondary}  />
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
          <Ionicons name="call-outline" size={20} color={colors.secondary} />
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
          <MaterialIcons name="date-range" size={20} color={colors.secondary} />
          <Text style={{ color: colors.text }}>{dataHora.toLocaleString('pt-BR')}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker value={dataHora} mode="date" display="default" onChange={onChangeDate} />
        )}
        {showTimePicker && (
          <DateTimePicker value={dataHora} mode="time" display="default" onChange={onChangeTime} />
        )}

        <Text style={styles.label}>Serviço</Text>
        <TouchableOpacity style={[styles.input, styles.inputIconRow]} onPress={() => setModalServicoVisible(true)}>
          <FontAwesome5 name="tools" size={18} color={colors.secondary} />
          <View style={{ width: 8 }} />
          <Text style={{ color: servico ? colors.text : colors.gray }}>{servico || 'Selecione um serviço'}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Valor (R$)</Text>
        <View style={styles.inputIconRowBox}>
          <FontAwesome5 name="money-bill-wave" size={18} color={colors.secondary} />
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
          <Ionicons name="location-outline" size={18} color={colors.white} />
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
                    <MaterialIcons name="location-searching" size={20} color={colors.secondary} />
                    <TextInput
                      style={styles.inputBox}
                      value={endereco.cep}
                      onChangeText={cep => setEndereco({ ...endereco, cep })}
                      placeholder="CEP"
                      keyboardType="numeric"
                      placeholderTextColor={colors.gray}
                    />
                  </View>
                  <TouchableOpacity style={styles.buttonBuscarCep} onPress={ handleSearchCep }>
                    { loadingCep ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="search" size={22} color="#fff" />}
                  </TouchableOpacity>
                </View>

                {['rua', 'numero', 'bairro', 'cidade', 'estado'].map((campo, i) => (
                  <React.Fragment key={i}>
                    <Text style={styles.label}>{campo.charAt(0).toUpperCase() + campo.slice(1)}*</Text>
                    <View style={styles.inputIconRowBox}>
                      <MaterialIcons name={campo === 'numero' ? 'pin' : campo === 'cidade' ? 'location-city' : 'streetview'} size={20} color={colors.secondary} style={{ marginRight: 8 }} />
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

      <ActionAlert
        visible={actionAlertVisible}
        title={actionAlertInfo.title}
        message={actionAlertInfo.message}
        onClose={() => setActionAlertVisible(false)}
        actions={[
          { text: "Cancelar", onPress: () => setActionAlertVisible(false) },
          { text: "Excluir", destructive: true, onPress: () => {
              if (typeof onActionAlertConfirm === 'function') onActionAlertConfirm();
              setActionAlertVisible(false);
          }},
        ]}
      />

      </ScrollView>

      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.buttonFooterCancel} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonTextCancel}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonFooter} onPress={ handleSaveAgendamento }>
          <Text style={styles.buttonTextFooter}>{agendamentoEdit ? 'Salvar' : 'Agendar'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
