import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../colors/colors';
import styles from './style';


const CustomAlert = ({ visible, title, message, onClose, type = 'error' }) => {
  // const iconName = type === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline';
  // const iconColor = type === 'success' ? colors.success : colors.warning;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
