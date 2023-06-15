import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityDetailsModalProps } from './Types';


const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  activity,
  onClose,
}) => {
  return (
    <View style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.heading}>Detalles de la actividad</Text>
        <Text>Nombre: {activity.nameActivity}</Text>
        <Text>Fecha: {activity.dateActivity.toLocaleDateString()}</Text>
        <Text>Descripción: {activity.descriptionActivity}</Text>
        <Text>Creador: {activity.creatorActivity}</Text>
        <Text>
          Participantes: {activity.participantsActivity?.join(', ')}
        </Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default ActivityDetailsModal;
