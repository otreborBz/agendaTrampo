import { useState, useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/firebaseConnection';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  Animated,
  TouchableOpacity,
  Alert,
  Platform,
  ActionSheetIOS,
  Dimensions,
  StyleSheet,
  Pressable as RNPressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../colors/colors";
import styles from "./style";

// Criando AnimatedTouchable para animação de scale
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// --- Custom Action Sheet ---
const CustomActionSheet = ({ visible, onClose, options, title }) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <RNPressable style={actionSheetStyles.overlay} onPress={onClose}>
        <RNPressable style={actionSheetStyles.container} onPress={() => {}}>
          <Ionicons name="options-outline" size={48} color={colors.secondary} style={actionSheetStyles.mainIcon} />
          <Text style={actionSheetStyles.title}>{title || 'Opções'}</Text>
          <Text style={actionSheetStyles.message}>O que você deseja fazer com este agendamento?</Text>

          <View style={actionSheetStyles.buttonContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  actionSheetStyles.button,
                  option.style === 'destructive' ? actionSheetStyles.destructiveButton : actionSheetStyles.primaryButton
                ]}
                onPress={() => { onClose(); option.onPress(); }}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  style={[option.style === 'destructive' ? actionSheetStyles.destructiveButtonText : actionSheetStyles.primaryButtonText]}
                />
                <Text style={[option.style === 'destructive' ? actionSheetStyles.destructiveButtonText : actionSheetStyles.primaryButtonText]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={actionSheetStyles.cancelButton} onPress={onClose}>
            <Text style={actionSheetStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </RNPressable>
      </RNPressable>
    </Modal>
  );
};

const actionSheetStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  container: {
    width: '95%',
    maxWidth: 320,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  mainIcon: { marginBottom: 15 },
  title: { fontSize: 20, fontWeight: '600', color: colors.darkGray, marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 16, color: colors.text, textAlign: 'center', marginBottom: 25 },
  buttonContainer: { width: '100%', gap: 12 },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 12, borderRadius: 10, gap: 8 },
  primaryButton: { backgroundColor: colors.primary },
  destructiveButton: { backgroundColor: colors.error },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  destructiveButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  cancelButton: { marginTop: 16, padding: 8 },
  cancelText: { fontSize: 15, color: colors.text, fontWeight: '500' },
});

// --- Formatação de data ---
function formatDateTime(field) {
  if (!field) return "";
  const date = typeof field === "string" ? new Date(field) : field;
  return date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// --- Componente ListAgenda ---
export default function ListAgenda({ data }) {
  const item = data;
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [status, setStatus] = useState(item.status || "pendente");

  const formattedDateTimeValue = formatDateTime(item.dataHora);

  // Define o estilo do card com base no status
  let cardStyle = {};
  let statusStyle = {};
  const lowerCaseStatus = status.toLowerCase();

  if (lowerCaseStatus === 'pendente') {
    statusStyle = styles.statusPendente;
    cardStyle = { borderRightColor: colors.statusPendenteColor || "#FFA000", backgroundColor: statusStyle.backgroundColor };
  } else if (lowerCaseStatus === 'concluido' || lowerCaseStatus === 'concluído') {
    statusStyle = styles.statusConfirmado;
    cardStyle = { borderRightColor: colors.statusConfirmadoColor || "#388E3C", backgroundColor: statusStyle.backgroundColor };
  } else if (lowerCaseStatus === 'cancelado') {
    statusStyle = styles.statusCancelado;
    cardStyle = { borderRightColor: colors.statusCanceladoColor || "#D32F2F", backgroundColor: statusStyle.backgroundColor };
  }

  // Map de cores da barra lateral
  const statusColorMap = {
    pendente: colors.statusPendenteColor || "#FFA000",
    concluido: colors.statusConfirmadoColor || "#388E3C",
    cancelado: colors.statusCanceladoColor || "#D32F2F"
  };

  const openDetail = () => {
    setVisible(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };
  const closeDetail = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setVisible(false));
  };
  const handlePressIn = () => Animated.spring(scaleValue, { toValue: 0.98, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleValue, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();

  const showActionSheet = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ["Cancelar", "Editar", "Excluir"], destructiveButtonIndex: 2, cancelButtonIndex: 0 },
        (buttonIndex) => { if (buttonIndex === 1) handleEdit(); else if (buttonIndex === 2) handleDelete(); }
      );
    } else setActionSheetVisible(true);
  };

  const handleEdit = () => {
    closeDetail();
    const agendamentoParaNavegar = {
      ...item,
      dataHora: item.dataHora?.toDate ? item.dataHora.toDate().toISOString() : item.dataHora,
    };

    navigation.navigate('Agendar', { agendamento: agendamentoParaNavegar });
  };

  const deleteFromFirestore = async () => {
    try {
      await deleteDoc(doc(db, 'agendamentos', item.id));
      Alert.alert('Sucesso', 'Agendamento excluído!');
      if (typeof data.onDelete === 'function') data.onDelete(item.id);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível excluir o agendamento.');
      console.log(e);
    }
  };

  const handleDelete = () => {
    closeDetail();
    Alert.alert(
      "Excluir Agendamento",
      `Deseja excluir o agendamento de ${item.nomeCliente}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: deleteFromFirestore },
      ]
    );
  };

  const actionSheetOptions = [
    { text: "Editar", onPress: handleEdit, icon: 'create-outline' },
    { text: "Excluir", onPress: handleDelete, style: "destructive", icon: 'trash-outline' },
  ];

  return (
    <View style={styles.gridItemContainer}>
      {/* Card */}
      <AnimatedTouchable
        style={[styles.card, cardStyle, { transform: [{ scale: scaleValue }] }]}
        onPress={openDetail}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfoRow}>
              <Ionicons name="person-outline" size={16} color={colors.secondary} style={styles.cardIcon} />
              <Text style={styles.cardNome} numberOfLines={1}>{item.nomeCliente}</Text>
            </View>
            <TouchableOpacity onPress={showActionSheet} style={styles.moreButton} hitSlop={15}>
              <Ionicons name="ellipsis-vertical" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.cardInfoRow}>
            <Ionicons name="briefcase-outline" size={14} color="#555" style={styles.cardIcon} />
            <Text style={styles.cardServico} numberOfLines={1}>{item.servico || 'Serviço não especificado'}</Text>
          </View>
          <View>
            <View style={styles.cardInfoRow}>
              <Ionicons name="calendar-outline" size={14} color="#555" style={styles.cardIcon} />
              <Text style={styles.cardDataHora}>{formattedDateTimeValue}</Text>
            </View>
            <View style={styles.cardFooter}>
              <Ionicons name="information-circle-outline" size={14} color={statusStyle.color}  />
              <Text style={[styles.statusText, statusStyle]}>{status}</Text>
            </View>
          </View>
        </View>
      </AnimatedTouchable>

      {/* Modal Detalhes */}
      <Modal animationType="fade" transparent visible={visible} onRequestClose={closeDetail}>
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Pressable style={styles.modalOverlayPressable}>
            <Animated.View style={styles.modalContentCentered}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>Detalhes do Agendamento</Text>
                <Pressable onPress={closeDetail} style={styles.closeButton} hitSlop={10}>
                  <Ionicons name="close" size={24} color="#fff" />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                {/* Informações Pessoais */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={20} color={colors.border} style={styles.infoIcon} />
                    <Text style={styles.infoText}>{item.nomeCliente}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color={colors.border} style={styles.infoIcon} />
                    <Text style={styles.infoText}>{item.telefone}</Text>
                  </View>
                </View>

                {/* Detalhes Agendamento */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Detalhes do Agendamento</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={20} color={colors.border} style={styles.infoIcon} />
                    <Text style={styles.infoText}>{formattedDateTimeValue}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="briefcase-outline" size={20} color={colors.border} style={styles.infoIcon} />
                    <Text style={styles.infoText}>{item.servico}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="cash-outline" size={20} color={colors.border} style={styles.infoIcon} />
                    <Text style={styles.infoText}>R$ {item.valor}</Text>
                  </View>

                  {/* Status clicável */}
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 6 }}>Status:</Text>
                    <View style={{ flexDirection: "row", gap:5 }}>
                      {["Concluido", "Pendente", "Cancelado"].map((s) => (
                        <Pressable
                          key={s}
                          onPress={async () => {
                            setStatus(s);
                            try {
                              await updateDoc(doc(db, "agendamentos", item.id), { status: s });
                              if (typeof data.onUpdateStatus === "function") data.onUpdateStatus(item.id, s);
                            } catch (e) {
                              Alert.alert("Erro", "Não foi possível atualizar o status.");
                            }
                          }}
                          style={[
                            styles.statusBadge,
                            s === "Concluido" && styles.statusConfirmado,
                            s === "Pendente" && styles.statusPendente,
                            s === "Cancelado" && styles.statusCancelado,
                            s === status && { borderWidth: 2, borderColor: colors.primary },
                          ]}
                        >
                          <Text style={styles.statusText}>{s}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Localização */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Localização</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color={colors.border} style={styles.infoIcon} />
                    <Text style={styles.infoText}>
                      {item.endereco
                        ? `${item.endereco.rua}, ${item.endereco.numero} - ${item.endereco.cidade}/${item.endereco.estado}`
                        : "Endereço não cadastrado"}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Modal>

      {/* ActionSheet */}
      <CustomActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        options={actionSheetOptions}
        title="Ações do Agendamento"
      />
    </View>
  );
}
