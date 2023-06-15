import { SessionService } from "../../services/user/session.service";
import { UserEntity } from "../../../domain/user/user.entity";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { Platform } from "react-native";
import { ImageBackground} from 'react-native';
import { Callout, Marker } from "react-native-maps";
import MapView from 'react-native-maps';
import { LocationEntity } from "../../../domain/location/location.entity";
import SearchBar from "../components/searchbar/searchbar";
import * as Font from 'expo-font';
import * as Location from 'expo-location';
import { LocationService } from "../../../infrastructure/services/location/location.service";
import { ActivityService } from "../../../infrastructure/services/activity/activity.service";
import { ActivityEntity } from "../../../domain/activity/activity.entity";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface RouteParams {
    uuid?: string;
}

async function loadFonts() {
    await Font.loadAsync({
      'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
      'SFNS': require('../../../../assets/fonts/SFNS.otf'),
    });
  }

export default function ActivitiesLocationList() {
    const navigation = useNavigation();
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const route = useRoute();
    const {
        uuid
      }: RouteParams = route.params || {};
    const [activities, setActivities] = useState<ActivityEntity[]>([]);

    const obtainActivitiesLocation = async () => {
        if (uuid){
            try {
                const response = await ActivityService.getActivitiesOfALocation(uuid);
                if (response) {
                  const activities = response.data as ActivityEntity[];
                  setActivities(activities);
                } else {
                  console.error('Error fetching activities: Response is undefined');
                }
            } catch (error) {
            console.error('Error fetching activities:', error);
            }
        }
    };

    useEffect(() => {
        obtainActivitiesLocation();
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
        headerTitle: 'List of Activities',
          headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, 
          headerTitleStyle: { color: '#66fcf1', fontSize: 30 }
        });
      }, [navigation]);

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
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

    const getUserProfilePhoto = async (userId: string) => {
      try {
          const response = await CRUDService.getUser(userId);
          if (response) {
              const user = response.data as UserEntity;
              return user.photoUser;
          } else {
              console.error('Error fetching user:', userId);
              return null;
          }
      } catch (error) {
          console.error('Error fetching user:', error);
          return null;
      }
  };

  const [userProfilePhotos, setUserProfilePhotos] = useState<Map<string, string[]>>(new Map());

  useEffect(() => {
    const fetchUserProfilePhotos = async () => {
      const photos = new Map<string, string[]>();

      await Promise.all(
        activities.map(async (activity) => {
          if (activity.participantsActivity && activity.uuid) {
            const photosForActivity = await Promise.all(
              activity.participantsActivity.map((userId) => getUserProfilePhoto(userId))
            );

            const cleanedPhotosForActivity = photosForActivity.filter((photo) => photo !== null) as string[];

            photos.set(activity.uuid, cleanedPhotosForActivity);
          }
        })
      );

      setUserProfilePhotos(photos);
    };

    fetchUserProfilePhotos();
  }, [activities]);

  const handleGoToScreenUser = (uuid:string) => {
    navigation.navigate("UserScreen" as never, {uuid} as never);
  };

  const handleGoToActivity = (uuid:string) => {
    navigation.navigate("Activity" as never, {uuid} as never);
  };

  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <ScrollView style={styles.scroll_vertical}>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <TouchableOpacity key={activity.uuid} onPress={() => activity.uuid && handleGoToActivity(activity.uuid)}>
              <View style={styles.activity_container}>
                <Text style={styles.text_activity_name}>{activity.nameActivity}</Text>
                <Text style={styles.text_activity_description}>{activity.descriptionActivity}</Text>
                <Text style={styles.text_activity_date}>
                  {new Date(activity.dateActivity).getDate()}.
                  {new Date(activity.dateActivity).getMonth() + 1}.
                  {new Date(activity.dateActivity).getFullYear()}
                </Text>
                <Text style={styles.text_activity_time}>{activity.hoursActivity[0]} - {activity.hoursActivity[1]}</Text>
                <ScrollView style={styles.scroll_profiles} horizontal>
                  <View style={styles.plus_icon}>
                    <MaterialCommunityIcons color="#66fcf1" name="plus" size={20} />
                  </View>
                  {activity.uuid &&
                    userProfilePhotos.get(activity.uuid)?.map((photoUrl, index) => (
                      <TouchableOpacity key={index} onPress={() => {
                        const userId = activity.participantsActivity?.[index];
                        if (userId) {
                          handleGoToScreenUser(userId);
                        }
                      }}>
                        <Image style={styles.participant_profile_image} source={photoUrl ? { uri: photoUrl } : undefined} />
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.container}>
            <Image style={styles.shock_icon} source={{ uri: 'https://cdn.shopify.com/s/files/1/1061/1924/products/12_large.png?v=1571606116' }} />
            <Text style={styles.text_activity_none}>What a boring place!</Text>
          </View>
        )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}


