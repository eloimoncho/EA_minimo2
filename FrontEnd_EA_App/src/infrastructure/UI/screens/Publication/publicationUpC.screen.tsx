import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, ActivityIndicator, StyleSheet, Platform, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import { UserEntity } from "../../../../domain/user/user.entity";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { SessionService } from "../../../services/user/session.service";
import { CRUDService } from "../../../services/user/CRUD.service";
import { PublicationEntity } from "../../../../domain/publication/publication.entity";
import { TextInput } from "react-native-gesture-handler";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";
import { PublicationService } from "../../../services/publication/publication.service";
import * as Font from 'expo-font';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ActivityService } from "../../../services/activity/activity.service";
import { ActivityEntity } from "../../../../domain/activity/activity.entity";

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../../assets/fonts/SFNS.otf'),
  });
}

interface RouteParams {
  publication?: PublicationEntity;
}

export default function ScreenPublicationUpC() {
    const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
    const [textPublication, setTextPublication] = useState("");
    const [loading, setLoading] = useState(true);
    const [newPublication, setNewPublication] = useState<string | null>(null);
    const [weekActivities, setWeekActivities] = useState<ActivityEntity[]>([]);
  
    const route = useRoute();
    const navigation = useNavigation();
    const { publication }: RouteParams = route.params || {};
  
    const [fontsLoaded, setFontsLoaded] = useState(false);
  
    useEffect(() => {
      loadFonts().then(() => {
        setFontsLoaded(true);
      });
    }, []);
  
    const titleFont = Platform.select({
      ios: 'Rafaella',
      android: 'Rafaella',
    });
    const bodyFont = Platform.select({
      ios: 'SFNS',
      android: 'SFNS',
    });
  
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#66fcf1', fontSize: 30 }, title: 'Post a Publication',
      });
    }, [navigation]);
  
    useFocusEffect(
      React.useCallback(() => {
        const getUser = async () => {
          console.log("AL CARGAR: " + publication);
          const userId = await SessionService.getCurrentUser();
          if (userId) {
            try {
              const response = await CRUDService.getUser(userId);
              setCurrentUser(response?.data);
              
              const responsePub = await PublicationService.obtainOwnPosts(userId);
              const publications = responsePub.data;
              console.log("LA FOTO: " + publication?.photoPublication.toString());
              
              const matchingPublication = publications.find((pub: PublicationEntity) => pub.photoPublication.toString() === publication?.photoPublication.toString());
              
              if (matchingPublication) {
                console.log("Publicación encontrada. Su ID es ...", matchingPublication._id);
                setNewPublication(matchingPublication._id);
                
                // Obtenemos las actividades de la semana para escoger a cual asignar la foto ...
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                const date = currentDate.toString();
                console.log("LA FECHA ES: " + date);
                
                const responseActivities = await ActivityService.obtainMyActivitiesOfTheWeek(userId, date);
                const activitiesOfWeek = responseActivities.data;
                setWeekActivities(activitiesOfWeek);
              } else {
                console.log("¡ERROR 1!");
              }
            } catch (error) {
              console.log("¡ERROR 2!");
            }
          }
        };
        getUser();
      }, [])
    );    
  
    const styles = StyleSheet.create({
      backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
      },
      maincontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      text_activity_name: {
        color: 'yellow',
        fontFamily: titleFont,
        fontSize: 28,
        paddingTop: 8,
    },
    text_activity_description: {
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 16,
      marginTop: 8,
    },
    text_activity_date: {
      color: "#66fcf1",
      fontFamily: bodyFont,
      fontSize: 14,
      marginTop: 8,
    },
    text_activity_time: {
      color: "#66fcf1",
      fontFamily: bodyFont,
      fontSize: 14,
      marginBottom: 8,
    },
    activity_container: {
      flex: 1,
      width: '100%',
      paddingTop: 12,
      padding: 10,
      marginBottom: 10,
      textAlign: "center",
      alignContent: "center",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: 10,
    },
    text_activity_none: {
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 16,
    },
    shock_icon: {
      width: 36,
      height: 36,
      marginBottom: 6,
      marginTop: -20,
    },
    participant_profile_image: {
      width: 46,
      height: 46,
      borderRadius: 40,
      marginRight: 10,
    },
    plus_icon: {
      width: 46,
      height: 46,
      justifyContent: "center",
      alignContent: "center",
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      alignItems: "center",
      borderRadius: 40,
      marginRight: 10,
    },
    scroll_profiles: {
      paddingLeft: 0,
      width: "100%",
      flex: 1,
      marginTop: 2,
      marginBottom: 2,
    },
    scroll_vertical: {
      paddingTop: 10,
      flex: 1,
      width: '100%',
      paddingRight: 10,
      paddingLeft: 10,
    }
    });

    const handleAssignToActivity = async (oldActivity: ActivityEntity) => {
      if (oldActivity.uuid && newPublication) {
        const updatedActivity = {
          ...oldActivity,
          publicationActivity: oldActivity.publicationActivity
            ? [...oldActivity.publicationActivity, newPublication]
            : [newPublication]
        };
        console.log("ACTUALIZADA: " + JSON.stringify(updatedActivity));
        try {
          const response = await ActivityService.updateActivity(oldActivity.uuid, updatedActivity);
          console.log("Actividad actualizada:", JSON.stringify(response.data));
          navigation.navigate("HomeScreen" as never);
        } catch (error) {
          console.error("Error al actualizar la actividad:", error);
        }
      } else {
        console.error("La actividad o la publicación no tienen un UUID válido.");
      }
    };
    

    const handleOmitAssignation = () => {
      navigation.navigate("HomeScreen" as never);
    }; 
  
    return (
      <ImageBackground source={require('../../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <View style={styles.maincontainer}>
        <ScrollView style={styles.scroll_vertical}>
        {weekActivities.length > 0 ? (
          weekActivities.map((activity) => (
            <TouchableOpacity key={activity.uuid} onPress={() => activity.uuid && handleAssignToActivity(activity)}>
              <View style={styles.activity_container}>
                <Text style={styles.text_activity_name}>{activity.nameActivity}</Text>
                <Text style={styles.text_activity_description}>{activity.descriptionActivity}</Text>
                <Text style={styles.text_activity_date}>
                  {new Date(activity.dateActivity).getDate()}.
                  {new Date(activity.dateActivity).getMonth() + 1}.
                  {new Date(activity.dateActivity).getFullYear()}
                </Text>
                <Text style={styles.text_activity_time}>{activity.hoursActivity[0]} - {activity.hoursActivity[1]}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.maincontainer}>
            <Image style={styles.shock_icon} source={{ uri: 'https://cdn.shopify.com/s/files/1/1061/1924/products/12_large.png?v=1571606116' }} />
            <Text style={styles.text_activity_none}>What a boring place!</Text>
            <TouchableOpacity onPress={() => handleOmitAssignation()}>
              <View style={styles.activity_container}>
                <Text style={styles.text_activity_name}>Exit Without Assigning</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        </ScrollView>
      </View>
    </ImageBackground>
    );
  }