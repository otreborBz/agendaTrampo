import { useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Alert,
  Animated,
  ActionSheetIOS,
  Platform,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./style";
import { colors } from "../../colors/colors";

const { width, height } = Dimensions.get('window');

// Para Android, vamos usar um modal personalizado como ActionSheet
const ActionSheet = ({ visible, onClose, options }) => {
  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.actionSheetOverlay} onPress={onClose}>
        <View style={styles.actionSheetContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionSheetButton,
                option.style === "destructive" && styles.actionSheetDestructive
              ]}
              onPress={() => {
                onClose();
                option.onPress();
              }}
            >
              <Text style={[
                styles.actionSheetText,
                option.style === "destructive" && styles.actionSheetDestructiveText
              ]}>
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.actionSheetCancel}
            onPress={onClose}
          >
            <Text style={styles.actionSheetCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default function ListAgenda({ item }) {
  const [visible, setVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const fadeAnim = useRef(new Animated.Value(0)).current;

  function openDetail() {
    setVisible(true);
    // Animação de fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  function closeDetail() {
    // Animação de fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  }

  function handlePressIn() {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }

  function showActionSheet() {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Editar', 'Excluir'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
          userInterfaceStyle: 'light'
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleEdit();
          } else if (buttonIndex === 2) {
            handleDelete();
          }
        }
      );
    } else {
      setActionSheetVisible(true);
    }
  }

  function handleEdit() {
    closeDetail();
    Alert.alert(
      "Editar Agendamento",
      `Deseja editar o agendamento de ${item.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Editar", onPress: () => console.log("Editar:", item.id) },
      ]
    );
  }

  function handleDelete() {
    closeDetail();
    Alert.alert(
      "Excluir Agendamento",
      `Tem certeza que deseja excluir o agendamento de ${item.nome}? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: () => {
            console.log("Excluir:", item.id);
            Alert.alert("Sucesso", "Agendamento excluído com sucesso!");
          } 
        },
      ]
    );
  }

  const actionSheetOptions = [
    {
      text: "Editar",
      onPress: handleEdit,
      icon: "create-outline"
    },
    {
      text: "Excluir",
      onPress: handleDelete,
      style: "destructive",
      icon: "trash-outline"
    }
  ];

  return (
    <>
      {/* Card da lista com feedback visual */}
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Pressable
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed
          ]}
          onPress={openDetail}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityLabel={`Agendamento de ${item.nome}. Clique para ver detalhes`}
        >
          <View style={styles.cardHeader}>
            <View style={styles.nameContainer}>
              <Ionicons name="person-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.cardNome} numberOfLines={1}>{item.nome}</Text>
            </View>
            
            <View style={styles.cardHeaderRight}>
              <View style={[
                styles.statusBadge,
                item.status === "Confirmado" ? styles.statusConfirmado :
                item.status === "Pendente" ? styles.statusPendente :
                styles.statusCancelado
              ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              
              <Pressable 
                onPress={(e) => {
                  e.stopPropagation();
                  showActionSheet();
                }}
                style={styles.optionsButton}
                accessibilityLabel="Mais opções"
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#777" />
              </Pressable>
            </View>
          </View>

          <View style={styles.cardInfoRow}>
            <Ionicons name="call-outline" size={16} color="#555" />
            <Text style={styles.cardTelefone}>{item.telefone}</Text>
          </View>
          
          <View style={styles.cardInfoRow}>
            <Ionicons name="calendar-outline" size={16} color="#555" />
            <Text style={styles.cardDataHora}>
              {item.data} às {item.hora}
            </Text>
          </View>
          
          <View style={styles.cardInfoRow}>
            <Ionicons name="briefcase-outline" size={16} color="#555" />
            <Text style={styles.cardServico} numberOfLines={1}>{item.servico}</Text>
          </View>
        </Pressable>
      </Animated.View>

      {/* Modal de Detalhes - Agora Centralizado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={closeDetail}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Pressable style={styles.modalOverlayPressable} onPress={closeDetail}>
            <Animated.View style={styles.modalContentCentered}>
              {/* Header com botão de fechar */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>Detalhes do Agendamento</Text>
                <Pressable 
                  onPress={closeDetail} 
                  style={styles.closeButton}
                  accessibilityLabel="Fechar detalhes"
                  hitSlop={10}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </Pressable>
              </View>

              <ScrollView 
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
              >
                {/* Seção de Informações Pessoais */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={20} color={colors.border} />
                    <Text style={styles.infoText}> {item.nome}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color={colors.border} />
                    <Text style={styles.infoText}> {item.telefone}</Text>
                  </View>
                </View>

                {/* Seção de Agendamento */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Detalhes do Agendamento</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={20} color={colors.border} />
                    <Text style={styles.infoText}> {item.data} às {item.hora}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="briefcase-outline" size={20} color={colors.border} />
                    <Text style={styles.infoText}> {item.servico}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="cash-outline" size={20} color={colors.border} />
                    <Text style={styles.infoText}> R$ {item.valor.toFixed(2)}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <View style={[
                      styles.statusBadge,
                      item.status === "Confirmado" ? styles.statusConfirmado :
                      item.status === "Pendente" ? styles.statusPendente :
                      styles.statusCancelado
                    ]}>
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                  </View>
                </View>

                {/* Seção de Localização */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Localização</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color={colors.border} />
                    <Text style={styles.infoText}>{item.endereco}</Text>
                  </View>
                </View>
              </ScrollView>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Modal>

      {/* ActionSheet para Android */}
      <ActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        options={actionSheetOptions}
      />
    </>
  );
}