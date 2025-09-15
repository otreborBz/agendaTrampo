import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import styles from "./style";


export default function CustomAlert({ visible, title, message, actions = [], onClose }) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {title && <Text style={styles.title}>{title}</Text>}
          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.actionsRow}>
            {actions.length > 0 ? (
              actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.button, action.destructive ? styles.destructive : styles.primary]}
                  onPress={action.onPress}
                >
                  <Text style={styles.buttonText}>{action.text}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity style={[styles.button, styles.primary]} onPress={onClose}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}


