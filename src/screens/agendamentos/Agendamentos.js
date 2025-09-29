import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { AuthContext } from '../../contexts/Auth';
import { salvarAgendamento } from '../../services/agendamentoService/agendamentoService';
import { buscarCep } from '../../services/apiViaCep/apiViaCepService';
import { carregarServicos, salvarServicos } from '../../services/servico/servico';

import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../themes/colors/Colors';
import styles from './styles';

import DateTimePicker from '@react-native-community/datetimepicker';
import ActionAlert from '../../components/actionAlert/actionAlert';
import CustomAlert from '../../components/customAlert/CustomAlert';

import { TestIds, useInterstitialAd } from 'react-native-google-mobile-ads';
import { adUnitIdInterstitial } from '../../services/adMobService/AdMobService';

// --- Interstitial Ads ---
const interstitialAdUnitId = __DEV__ ? TestIds.INTERSTITIAL : adUnitIdInterstitial;

export default function Agendamentos({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const [agendamentoEdit, setAgendamentoEdit] = useState(route?.params?.agendamento || null);

  // --- Formulário ---
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

  // --- Alerts ---
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ title: '', message: '' });
  const [onAlertCloseAction, setOnAlertCloseAction] = useState(null);

  const [actionAlertVisible, setActionAlertVisible] = useState(false);
  const [actionAlertInfo, setActionAlertInfo] = useState({ title: '', message: '' });
  const [onActionAlertConfirm, setOnActionAlertConfirm] = useState(null);

  // --- Interstitial Ad Hook ---
  const { isLoaded, isClosed, load, show, error } = useInterstitialAd(interstitialAdUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  // --- Limpar campos ---
  const limparCampos = () => {
    setNomeCliente('');
    setTelefone('');
    setDataHora(new Date());
    setServico('');
    setValor('');
    setEndereco({ rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' });
    setStatus('Pendente');
    setAgendamentoEdit(null);
  };

  // --- Preenche campos ao ganhar foco ---
  useFocusEffect(
    useCallback(() => {
      const agendamentoParam = route.params?.agendamento;
      if (agendamentoParam) {
        setAgendamentoEdit(agendamentoParam);
        setNomeCliente(agendamentoParam.nomeCliente || '');
        setTelefone(agendamentoParam.telefone || '');
        setDataHora(agendamentoParam.dataHora ? new Date(agendamentoParam.dataHora) : new Date());
        setServico(agendamentoParam.servico || '');
        setEndereco(agendamentoParam.endereco || { rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' });
        setStatus(agendamentoParam.status || 'Pendente');
        setValor(agendamentoParam.valor ? formatValor(String(agendamentoParam.valor).replace(/\D/g, '')) : '');
      } else {
        limparCampos();
      }
    }, [route.params?.agendamento])
  );

  // --- Carrega serviços do AsyncStorage ---
  useEffect(() => {
    async function loadServicos() {
      const servicosSalvos = await carregarServicos();
      setServicosExistentes(servicosSalvos);
    }
    loadServicos();
  }, []);

  // --- Carrega o anúncio ao montar ---
  useEffect(() => {
    load();
  }, [load]);

  // --- Recarrega anúncio ao ser fechado ---
  useEffect(() => {
    if (isClosed) {
      // Após o anúncio ser fechado, mostra o alerta de sucesso e prepara para voltar
      setAlertInfo({ title: "Sucesso", message: `Agendamento ${agendamentoEdit ? 'atualizado' : 'cadastrado'}!` });
      setOnAlertCloseAction(() => () => navigation.goBack());
      setAlertVisible(true);
      // Recarrega o anúncio para a próxima vez
      load();
    }
  }, [isClosed, load]);

  // --- Monitoramento de erros do anúncio ---
  useEffect(() => {
    if (error) console.error('[AD_STATE] Falha ao carregar o anúncio:=', error.message);
    if (isLoaded) console.log('[AD_STATE] Anúncio carregado e pronto para exibir!');
  }, [error, isLoaded]);

  // --- Salvar agendamento ---
  const handleSaveAgendamento = async () => {
    if (!nomeCliente || !telefone || !dataHora) {
      setAlertInfo({ title: 'Atenção', message: 'Por favor, preencha todos os campos.' });
      setAlertVisible(true);
      return;
    }

    try {
      await salvarAgendamento({ nomeCliente, telefone, dataHora, servico, valor, endereco, status, uid: user.uid }, agendamentoEdit?.id);

      if (isLoaded) {
        show(); // mostra anúncio
      } else {
        // Se o anúncio não carregou, mostra o alerta de sucesso diretamente
        setAlertInfo({ title: "Sucesso", message: `Agendamento ${agendamentoEdit ? 'atualizado' : 'cadastrado'}!` });
        setOnAlertCloseAction(() => () => navigation.goBack());
        setAlertVisible(true);
      }

    } catch (error) {
      setAlertInfo({ title: "Erro", message: "Não foi possível salvar o agendamento. Tente novamente." });
      setAlertVisible(true);
    }
  };

  // --- DateTimePicker Handlers ---
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

  // --- Serviços ---
  const adicionarServico = async () => {
    const servicoParaAdicionar = novoServico.trim();
    if (!servicoParaAdicionar) {
      setAlertInfo({ title: 'Atenção', message: 'Por favor, informe um serviço!' });
      setAlertVisible(true);
      return;
    }
    if (servicosExistentes.some(s => s.toLowerCase() === servicoParaAdicionar.toLowerCase())) {
      setAlertInfo({ title: 'Atenção', message: 'Este serviço já foi adicionado.' });
      setAlertVisible(true);
      return;
    }
    const newList = [...servicosExistentes, servicoParaAdicionar];
    setServicosExistentes(newList);
    await salvarServicos(newList);
    setServico(servicoParaAdicionar);
    setNovoServico('');
    setModalServicoVisible(false);
  };

  const removerServico = (index) => {
    const servicoParaRemover = servicosExistentes[index];
    if (!servicoParaRemover) return;
    setActionAlertInfo({ title: 'Excluir Serviço', message: `Tem certeza que deseja excluir "${servicoParaRemover}"?` });
    setOnActionAlertConfirm(() => async () => {
      const newList = servicosExistentes.filter((_, i) => i !== index);
      setServicosExistentes(newList);
      await salvarServicos(newList);
      if (servico === servicoParaRemover) setServico('');
    });
    setActionAlertVisible(true);
  };

  const selecionarServico = (servicoSelecionado) => {
    setServico(servicoSelecionado);
    setModalServicoVisible(false);
  };

  // --- CEP / Endereço ---
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
      if (resultado) setEndereco(prev => ({ ...prev, ...resultado }));
    } catch (error) {
      setAlertInfo({ title: 'Erro', message: error.message });
      setAlertVisible(true);
    } finally {
      setLoadingCep(false);
    }
  };

  const saveEndereco = () => {
    const { rua, numero, bairro } = endereco;
    if (!rua || !numero || !bairro) {
      setAlertInfo({ title: 'Erro', message: 'Preencha todos os campos do endereço!' });
      setAlertVisible(true);
      return;
    }
    setModalEnderecoVisible(false);
    setAlertInfo({ title: 'Sucesso', message: 'Endereço salvo!' });
    setAlertVisible(true);
  };

  // --- Formatação ---
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

  // --- Render ---
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <CustomAlert
        visible={alertVisible}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={() => {
          setAlertVisible(false);
          if (typeof onAlertCloseAction === 'function') onAlertCloseAction();
          setOnAlertCloseAction(null);
        }}
      />
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>{agendamentoEdit ? 'Editar Agendamento' : 'Novo Agendamento'}</Text>
        </View>

        {/* Nome */}
        <Text style={styles.label}>Nome do Cliente*</Text>
        <View style={styles.inputIconRowBox}>
          <Ionicons name="person-outline" size={20} color={colors.secondary} />
          <TextInput
            style={styles.inputBox}
            value={nomeCliente}
            onChangeText={setNomeCliente}
            placeholder="Nome completo"
            placeholderTextColor={colors.gray}
          />
        </View>

        {/* Telefone */}
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

        {/* Data e Hora */}
        <Text style={styles.label}>Data e Hora*</Text>
        <TouchableOpacity style={[styles.input, styles.inputIconRow]} onPress={() => setShowDatePicker(true)}>
          <MaterialIcons name="date-range" size={20} color={colors.secondary} />
          <Text style={{ color: colors.text, marginLeft: 8 }}>{dataHora.toLocaleString('pt-BR')}</Text>
        </TouchableOpacity>
        {showDatePicker && <DateTimePicker value={dataHora} mode="date" display="default" onChange={onChangeDate} />}
        {showTimePicker && <DateTimePicker value={dataHora} mode="time" display="default" onChange={onChangeTime} />}

        {/* Serviço */}
        <Text style={styles.label}>Serviço</Text>
        <TouchableOpacity style={[styles.input, styles.inputIconRow]} onPress={() => setModalServicoVisible(true)}>
          <FontAwesome5 name="tools" size={18} color={colors.secondary} style={{ marginRight: 8 }} />
          <Text style={{ color: servico ? colors.text : colors.gray, flex: 1 }} numberOfLines={1}>{servico || 'Selecione um serviço'}</Text>
        </TouchableOpacity>

        {/* Valor */}
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

        {/* Endereço */}
        <TouchableOpacity style={styles.buttonEndereco} onPress={() => setModalEnderecoVisible(true)}>
          <Ionicons name="location-outline" size={18} color={colors.white} />
          <Text style={styles.textButtonEndereco}>Cadastrar Endereço</Text>
        </TouchableOpacity>

        {/* --- Modal Serviços --- */}
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
                  <TouchableOpacity style={[styles.buttonAddServico, { marginLeft: 8, height: 48, width: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 0 }]} onPress={adicionarServico}>
                    <MaterialIcons name="save" size={26} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={{ maxHeight: 200 }}>
                  {servicosExistentes.map((s, idx) => (
                    <View key={idx} style={styles.servicoItem}>
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => selecionarServico(s)}>
                        <Text style={{ color: colors.text }}>{s}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removerServico(idx)}>
                        <MaterialIcons name="delete" size={22} color={colors.error} style={{ marginLeft: 10 }} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
              <TouchableOpacity style={[styles.buttonCloseModal, { width: '100%', marginRight: 0, marginTop: 0 }]} onPress={() => setModalServicoVisible(false)}>
                <Text style={styles.buttonTextCloseModal}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* --- Modal Endereço --- */}
        <Modal visible={modalEnderecoVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={[styles.modalBox, { maxHeight: '85%' }]}>
              <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Endereço</Text>

                {/* CEP */}
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
                  <TouchableOpacity style={styles.buttonBuscarCep} onPress={handleSearchCep}>
                    {loadingCep ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="search" size={22} color="#fff" />}
                  </TouchableOpacity>
                </View>

                {/* Rua */}
                <Text style={styles.label}>Rua*</Text>
                <View style={styles.inputIconRowBox}>
                  <MaterialIcons name="streetview" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.inputBox}
                    value={endereco.rua}
                    onChangeText={(text) => setEndereco({ ...endereco, rua: text })}
                    placeholder="Rua"
                    placeholderTextColor={colors.gray}
                  />
                </View>

                {/* Número e Bairro */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={{ flex: 0.35, marginRight: 8 }}>
                    <Text style={styles.label}>Número*</Text>
                    <View style={[styles.inputIconRowBox, { marginBottom: 0 }]}>
                      <MaterialIcons name="pin" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
                      <TextInput
                        style={styles.inputBox}
                        value={endereco.numero}
                        onChangeText={(text) => setEndereco({ ...endereco, numero: text })}
                        placeholder="Nº"
                        placeholderTextColor={colors.gray}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <View style={{ flex: 0.65, marginLeft: 8 }}>
                    <Text style={styles.label}>Bairro*</Text>
                    <View style={[styles.inputIconRowBox, { marginBottom: 0 }]}>
                      <MaterialIcons name="location-pin" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
                      <TextInput
                        style={styles.inputBox}
                        value={endereco.bairro}
                        onChangeText={(text) => setEndereco({ ...endereco, bairro: text })}
                        placeholder="Bairro"
                        placeholderTextColor={colors.gray}
                      />
                    </View>
                  </View>
                </View>

                {/* Cidade e Estado */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={{ flex: 0.7, marginRight: 8 }}>
                    <Text style={styles.label}>Cidade*</Text>
                    <View style={[styles.inputIconRowBox, { marginBottom: 0 }]}>
                      <MaterialIcons name="location-city" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
                      <TextInput
                        style={styles.inputBox}
                        value={endereco.cidade}
                        onChangeText={(text) => setEndereco({ ...endereco, cidade: text })}
                        placeholder="Cidade"
                        placeholderTextColor={colors.gray}
                      />
                    </View>
                  </View>
                  <View style={{ flex: 0.3, marginLeft: 8 }}>
                    <Text style={styles.label}>Estado*</Text>
                    <View style={[styles.inputIconRowBox, { marginBottom: 0 }]}>
                      <MaterialIcons name="map" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
                      <TextInput
                        style={styles.inputBox}
                        value={endereco.estado}
                        onChangeText={(text) => setEndereco({ ...endereco, estado: text })}
                        placeholder="UF"
                        placeholderTextColor={colors.gray}
                        maxLength={2}
                        autoCapitalize="characters"
                      />
                    </View>
                  </View>
                </View>

                {/* Botões do Modal Endereço */}
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

      {/* Footer */}
      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.buttonFooterCancel} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonTextCancel}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonFooter} onPress={handleSaveAgendamento}>
          <Text style={styles.buttonTextFooter}>{agendamentoEdit ? 'Salvar' : 'Agendar'}</Text>
        </TouchableOpacity>
      </View>

      {/* ActionAlert */}
      <ActionAlert
        visible={actionAlertVisible}
        title={actionAlertInfo.title}
        message={actionAlertInfo.message}
        onConfirm={() => {
          setActionAlertVisible(false);
          if (typeof onActionAlertConfirm === 'function') onActionAlertConfirm();
          setOnActionAlertConfirm(null);
        }}
        onCancel={() => setActionAlertVisible(false)}
      />

    </KeyboardAvoidingView>
  );
}
