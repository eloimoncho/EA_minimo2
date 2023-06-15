import { View, Text, ImageBackground, StyleSheet } from "react-native";
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { ActivityService } from "../../services/activity/activity.service";
import { Activity } from "../../../domain/activity/activity.entity";
import { SessionService } from "../../services/user/session.service";
import CalendarScreen from "../components/calendar/calendar";
import { UserEntity } from "../../../domain/user/user.entity";
import { CRUDService } from "../../services/user/CRUD.service";
import { useNavigation } from "@react-navigation/native";

function CalendarEventsScreen() {
  const navigation = useNavigation();
  const [listActivities, setListActivities] = useState<Activity[]>([]);
  const [uuid, setUuid] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);

  useEffect(() => {
    //Obtenemos el usuario que ha iniciado sesión en la app
    const currentDate = new Date;
    currentDate.setHours(0, 0, 0, 0);
    console.log(currentDate);
    const date = currentDate.toString();
    console.log("currentDate", date);
    const fetchData = async () => {
      const userId = await SessionService.getCurrentUser();
      setUuid(userId);
      console.log("userId",userId);
      try{
        const response = await CRUDService.getPerson(userId);
        const user = response.data;
        setCurrentUser(user);
  
        const myScheduleResponse = await ActivityService.getMySchedule(userId, date);
        console.log("My schedule",myScheduleResponse.data);
        setListActivities(myScheduleResponse.data);
        console.log("Activities set");
      } catch (error){
        navigation.navigate("NotFoundScreen" as never); 
      }
    }
    fetchData();
    
  }, []);
  

  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <CalendarScreen activities={listActivities} uuid={uuid}/>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  eventoContainer: {
    backgroundColor: 'lightblue',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  eventoText: {
    fontSize: 16,
  },
});

export default CalendarEventsScreen;
