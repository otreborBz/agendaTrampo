import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { useCallback, useRef, useState } from "react";
import {
  Animated, Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { db } from '../../services/firebase/firebaseConnection';
import { colors } from "../../themes/colors/Colors";

import { deleteAgendamento } from "../../services/firebase/firestoreService";
import ActionAlert from '../actionAlert/actionAlert';
import styles from "./styles/style";

// Criando AnimatedTouchable para animação de scale
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// --- Formatação de data ---
function formatDateTime(field) {
  if (!field) return "";
  const date = typeof field === "string" ? new Date(field) : field;
  return date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// --- Formatação de hora ---
function formatTime(field) {
  if (!field) return "";
  const date = typeof field === "string" ? new Date(field) : field;
  return date.toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
// --- Componente ListAgenda ---
export default function ListAgenda({ data }) {
  const item = data;
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const swipeableRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [status, setStatus] = useState(item.status || "pendente");

  const formattedDateTimeValue = formatDateTime(item.dataHora);
  const formattedTimeValue = formatTime(item.dataHora);

  const [actionAlertVisible, setActionAlertVisible] = useState(false);
  const [actionAlertInfo, setActionAlertInfo] = useState({ title: '', message: '' });


  // Define o estilo do card com base no status
  let cardStyle = {};
  let timeColorStyle = { color: colors.text };
  let textColorStyle = { color: colors.text };
  let iconColorStyle = { color: colors.text };
  const lowerCaseStatus = status.toLowerCase();

  // Map de cores fortes para bordas e textos de destaque
  const statusColorMap = {
    pendente: colors.warning,
    concluido: colors.success,
    concluído: colors.success,
    cancelado: colors.error,
  };

  // Map de cores suaves para o fundo
  const statusBgColorMap = {
    pendente: colors.pending,
    concluido: colors.confirm,
    concluído: colors.confirm,
    cancelado: colors.canceled,
  };

  if (statusColorMap[lowerCaseStatus]) {
    const strongColor = statusColorMap[lowerCaseStatus];
    const softColor = statusBgColorMap[lowerCaseStatus];
    cardStyle = {
      backgroundColor: softColor,
      borderColor: strongColor,
      borderRightColor: strongColor
    };
    timeColorStyle = { color: strongColor }; // Horário com cor forte
    textColorStyle = { color: colors.text }; // Texto principal com cor padrão
    iconColorStyle = { color: strongColor }; // Ícone com cor forte
  }

  const openDetail = () => {
    setVisible(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const closeDetail = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setVisible(false));
  };

  const closeSwipeable = useCallback(() => {
    swipeableRef.current?.close();
  }, []);

  const handlePressIn = () => Animated.spring(scaleValue, { toValue: 0.98, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleValue, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();

  const handleEdit = () => {
    closeSwipeable();
    closeDetail();
    // Cria um novo objeto apenas com os dados necessários e serializáveis
    const agendamentoParaNavegar = {
      id: item.id,
      nomeCliente: item.nomeCliente,
      telefone: item.telefone,
      servico: item.servico,
      valor: item.valor,
      status: item.status,
      endereco: item.endereco,
      dataHora: item.dataHora?.toDate ? item.dataHora.toDate().toISOString() : item.dataHora,
    };


    navigation.navigate('Agendar', { agendamento: agendamentoParaNavegar });
  };


  //Deleta um agendamento
  const handleDelete = () => {
    closeSwipeable();
    if (visible) closeDetail(); // Fecha o modal de detalhes se estiver aberto
    setActionAlertInfo({
      title: "Excluir Agendamento",
      message: `Deseja excluir o agendamento de ${item.nomeCliente}?`
    });
    setActionAlertVisible(true);
  };

  const handleUpdateStatus = async (newStatus) => {
    setStatus(newStatus);
    await updateDoc(doc(db, "agendamentos", item.id), { status: newStatus });
  };

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-180, 0],
      outputRange: [0, 180],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View style={[styles.swipeRightContainer, { transform: [{ translateX: trans }] }]}>
        <TouchableOpacity style={styles.swipeEditButton} onPress={handleEdit}>
          <Ionicons name="create-outline" size={24} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.swipeDeleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.gridItemContainer}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootFriction={8}
      >
        {/* Card */}
        <AnimatedTouchable
          style={[styles.card, cardStyle, { transform: [{ scale: scaleValue }] }]}
          onPress={openDetail}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardMainInfo}>
              <Text style={[styles.cardTime, timeColorStyle]}>{formattedTimeValue}</Text>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardNome, textColorStyle]} numberOfLines={1}>{item.nomeCliente}</Text>
                <Text style={[styles.cardServico, textColorStyle, { opacity: 0.7 }]} numberOfLines={1}>{item.servico || 'Serviço não especificado'}</Text>
              </View>
            </View>
          </View>
        </AnimatedTouchable >
      </Swipeable>

      {/* Modal Detalhes */}
      <Modal animationType="fade" transparent visible={visible} onRequestClose={closeDetail} >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Pressable style={styles.modalOverlayPressable}>
            <Animated.View style={styles.modalContentCentered}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>Detalhes do Agendamento</Text>
                <Pressable onPress={closeDetail} style={styles.closeButton} hitSlop={10}>
                  <Ionicons name="close" size={24} color={colors.white} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                {/* Bloco Cliente */}
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Cliente</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={20} color={colors.secondary} style={styles.infoIcon} />
                    <Text style={styles.infoText}>{item.nomeCliente}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color={colors.secondary} style={styles.infoIcon} />
                    <Text style={styles.infoText}>{item.telefone}</Text>
                  </View>
                </View>

                {/* Bloco Agendamento */}
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Agendamento</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={20} color={colors.secondary} style={styles.infoIcon} />
                    <Text style={styles.infoText}>{formattedDateTimeValue}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="briefcase-outline" size={20} color={colors.secondary} style={styles.infoIcon} />
                    <Text style={styles.infoText}>{item.servico || 'Não especificado'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="cash-outline" size={20} color={colors.secondary} style={styles.infoIcon} />
                    <Text style={styles.infoText}>{item.valor ? `R$ ${item.valor}` : 'Valor não informado'}</Text>
                  </View>
                </View>

                {/* Bloco Endereço */}
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Endereço</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color={colors.secondary} style={styles.infoIcon} />
                    <Text style={styles.infoText}>
                      {item.endereco
                        ? `${item.endereco.rua}, ${item.endereco.numero} - ${item.endereco.cidade}/${item.endereco.estado}`
                        : "Endereço não cadastrado"}
                    </Text>
                  </View>
                </View>

                {/* Bloco Status */}
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <View style={[styles.infoRow, { justifyContent: 'space-around' }]}>
                    {["Pendente", "Concluido", "Cancelado"].map((s) => (
                      <TouchableOpacity
                        key={s}
                        onPress={() => handleUpdateStatus(s)}
                        style={[
                          styles.statusBadge,
                          s === "Concluido" && styles.statusConfirmado,
                          s === "Pendente" && styles.statusPendente,
                          s === "Cancelado" && styles.statusCancelado,
                          status === s && { borderWidth: 2, borderColor: s === "Pendente" ? colors.warning : s === "Concluido" ? colors.success : colors.error }
                        ]}
                      >
                        <Text style={[styles.statusText,
                        s === "Concluido" && { color: colors.success },
                        s === "Pendente" && { color: colors.warning },
                        s === "Cancelado" && { color: colors.error },
                        ]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Modal >

      {/* Alerta de Ação (Excluir) */}
      < ActionAlert
        visible={actionAlertVisible}
        title={actionAlertInfo.title}
        message={actionAlertInfo.message}
        onClose={() => setActionAlertVisible(false)}
        actions={
          [
            { text: "Cancelar", onPress: () => setActionAlertVisible(false) },
            {
              text: "Excluir", destructive: true, onPress: async () => {
                setActionAlertVisible(false);
                try {
                  await deleteAgendamento(item.id);
                  if (typeof data.onDelete === 'function') {
                    // Passa o ID e o resultado de sucesso para o componente pai
                    data.onDelete(item.id, { success: true, message: "Agendamento excluído com sucesso!" });
                  }
                } catch (error) {
                  if (typeof data.onDelete === 'function') {
                    // Passa o ID e o resultado de erro para o componente pai
                    data.onDelete(item.id, { success: false, message: "Não foi possível excluir o agendamento." });
                  }
                }
              }
            },
          ]}
      />
    </View >
  );
}
