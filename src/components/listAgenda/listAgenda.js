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
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../colors/colors";
import styles from "./style";

const { width, height } = Dimensions.get("window");

// ActionSheet custom para Android
const ActionSheet = ({ visible, onClose, options }) => {
  if (!visible) return null;

  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.actionSheetOverlay} onPress={onClose}>
        <View style={styles.actionSheetContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionSheetButton,
                option.style === "destructive" && styles.actionSheetDestructive,
              ]}
              onPress={() => {
                onClose();
                option.onPress();
              }}
            >
              <Text
                style={[
                  styles.actionSheetText,
                  option.style === "destructive" && styles.actionSheetDestructiveText,
                ]}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.actionSheetCancel} onPress={onClose}>
            <Text style={styles.actionSheetCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

// Função para formatar data/hora
function formatDateTime(field) {
  if (!field) return "";

  if (typeof field === "string") {
    const date = new Date(field);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return "";
}

export default function ListAgenda({ data }) {
  const item = data;
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Estado do status
  const [status, setStatus] = useState(item.status || "pendente");

  const formattedDateTime = formatDateTime(item.dataHora);

  function openDetail() {
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  function closeDetail() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  }

  function handlePressIn() {
    Animated.spring(scaleValue, { toValue: 0.98, useNativeDriver: true }).start();
  }

  function handlePressOut() {
    Animated.spring(scaleValue, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  }

  function showActionSheet() {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ["Cancelar", "Editar", "Excluir"], destructiveButtonIndex: 2, cancelButtonIndex: 0 },
        (buttonIndex) => {
          if (buttonIndex === 1) handleEdit();
          else if (buttonIndex === 2) handleDelete();
        }
      );
    } else {
      setActionSheetVisible(true);
    }
  }

  function handleEdit() {
    closeDetail();
    navigation.navigate('Agendamentos', { agendamento: item });
  }

  async function deleteFromFirestore() {
    try {
      await deleteDoc(doc(db, 'agendamentos', item.id));
      Alert.alert('Sucesso', 'Agendamento excluído com sucesso!');
      if (typeof data.onDelete === 'function') {
        data.onDelete(item.id);
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível excluir o agendamento.');
      console.log('Erro ao excluir agendamento:', e);
    }
  }

  function handleDelete() {
    closeDetail();
    Alert.alert(
      "Excluir Agendamento",
      `Tem certeza que deseja excluir o agendamento de ${item.nomeCliente}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: deleteFromFirestore },
      ]
    );
  }

  const actionSheetOptions = [
    { text: "Editar", onPress: handleEdit },
    { text: "Excluir", onPress: handleDelete, style: "destructive" },
  ];

  // Definir cor de fundo do card conforme status
  let cardBg = styles.card;
  if (status.toLowerCase() === 'pendente') {
    cardBg = [styles.card, { backgroundColor: '#FFF8E1', borderColor: '#FFD600' }];
  } else if (status.toLowerCase() === 'concluido' || status.toLowerCase() === 'concluído') {
    cardBg = [styles.card, { backgroundColor: '#E8F5E9', borderColor: '#43A047' }];
  } else if (status.toLowerCase() === 'cancelado') {
    cardBg = [styles.card, { backgroundColor: '#FFEBEE', borderColor: '#D32F2F' }];
  }

  return (
    <>
      {/* --- Card --- */}
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Pressable
          style={({ pressed }) => [cardBg, pressed && styles.cardPressed]}
          onPress={openDetail}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {/* Header: Nome + Status */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardNome} numberOfLines={1}>
              {item.nomeCliente}
            </Text>
            <View
              style={[
                styles.statusBadge,
                status.toLowerCase() === "concluido" || status.toLowerCase() === "concluído"
                  ? styles.statusConfirmado
                  : status.toLowerCase() === "pendente"
                  ? styles.statusPendente
                  : styles.statusCancelado,
              ]}
            >
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>

          {/* Data e Hora */}
          <View style={styles.cardInfoRow}>
            <Ionicons name="calendar-outline" size={14} color="#999" />
            <Text style={styles.cardDataHora}>{formattedDateTime}</Text>
          </View>

          {/* Serviço */}
          <Text style={styles.cardServico} numberOfLines={1}>
            {item.servico}
          </Text>
        </Pressable>
      </Animated.View>

      {/* --- Modal de Detalhes --- */}
      <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={closeDetail}>
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
                    <Ionicons name="person-outline" size={20} color={colors.border} />
                    <Text style={styles.infoText}> {item.nomeCliente}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color={colors.border} />
                    <Text style={styles.infoText}> {item.telefone}</Text>
                  </View>
                </View>

                {/* Detalhes do Agendamento */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Detalhes do Agendamento</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={20} color={colors.border} />
                    <Text style={styles.infoText}> {formattedDateTime}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="briefcase-outline" size={20} color={colors.border} />
                    <Text style={styles.infoText}> {item.servico}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="cash-outline" size={20} color={colors.border} />
                    <Text style={styles.infoText}> R$ {item.valor}</Text>
                  </View>

                  {/* Status clicável */}
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 6 }}>Status:</Text>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      {["Concluido", "Pendente", "Cancelado"].map((s) => (
                        <Pressable
                          key={s}
                          onPress={async () => {
                            setStatus(s);
                            try {
                              await updateDoc(doc(db, "agendamentos", item.id), { status: s });
                              if (typeof data.onUpdateStatus === "function") {
                                data.onUpdateStatus(item.id, s);
                              }
                            } catch (e) {
                              Alert.alert("Erro", "Não foi possível atualizar o status no banco.");
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
                          <Text style={styles.statusText}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Localização */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Localização</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color={colors.border} />
                    <Text style={styles.infoText}>
                      {item.endereco
                        ? `${item.endereco.rua}, ${item.endereco.numero} - ${item.endereco.cidade}/${item.endereco.estado}`
                        : ""}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Modal>

      {/* --- ActionSheet --- */}
      <ActionSheet visible={actionSheetVisible} onClose={() => setActionSheetVisible(false)} options={actionSheetOptions} />
    </>
  );
}
