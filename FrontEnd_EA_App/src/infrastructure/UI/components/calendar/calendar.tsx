import React, { useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Agenda, AgendaEntry, AgendaSchedule, Calendar } from "react-native-calendars";
import ActivityDetailsModal from "../activityDetails/activityModal";
import { Activity, ActivityEntity } from "../../../../domain/activity/activity.entity";
import { format } from 'date-fns';

const windowWidth = Dimensions.get("window").width;

interface CalendarProps {
  activities: Activity[];
  uuid: string; 
}
interface CustomAgendaSchedule extends AgendaSchedule {
  [date: string]: AgendaEntry[];
}

const CalendarScreen = ({activities, uuid}: CalendarProps) => {
  
  
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  console.log("estamos en la componente CalendarScreen", activities)

  const handleDayPress = (date: { dateString: string }) => {
    const clickedActivity = activities.find(
      (activity) => activity.dateActivity.toISOString().split("T")[0] === date.dateString
    );
    if (clickedActivity) {
      setSelectedActivity(clickedActivity);
    } else {
      setSelectedActivity(null);
    }
  };
  

  const closeActivityDetails = () => {
    setSelectedActivity(null);
  };

  const convertedAgendaItems: AgendaSchedule = activities.reduce((items, activity) => {
    const formattedDate = format(activity.dateActivity, 'yyyy-MM-dd');
  
    // Si ya hay un elemento para la fecha actual, agregamos la actividad a ese elemento
    if (items[formattedDate]) {
      items[formattedDate].push({
        name: activity.nameActivity,
        height: 0, // Puedes establecer la altura como desees
        day: formattedDate,
      });
    } else {
      // Si no hay un elemento para la fecha actual, creamos uno nuevo
      items[formattedDate] = [{
        name: activity.nameActivity,
        height: 0, // Puedes establecer la altura como desees
        day: formattedDate,
      }];
    }
  
    return items;
  }, {} as AgendaSchedule);
  
  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    console.log("Actividad a renderizar:", reservation);
    return (
      <View style={styles.activityItem}>
        {/* Aquí puedes personalizar cómo se muestra cada actividad dentro del calendario */}
        {/* Ejemplo */}
        <Text>{reservation.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={convertedAgendaItems} // Aquí puedes proporcionar los datos de tus actividades en el formato requerido por el componente Agenda
        renderItem={renderItem}
        onDayPress={handleDayPress}
        style={styles.agenda}
        // Aquí puedes personalizar los estilos y configuraciones del calendario
      />
      
      {selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          onClose={closeActivityDetails}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  activityItem: {
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "lightblue",
    borderRadius: 5,
  },
  agenda: {
    width: windowWidth,
  }
});

export default CalendarScreen;
