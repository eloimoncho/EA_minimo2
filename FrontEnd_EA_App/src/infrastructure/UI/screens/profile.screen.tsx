import { SessionService } from "../../services/user/session.service";
import { UserEntity } from "../../../domain/user/user.entity";
import { useFocusEffect } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity,Button, ImageBackground, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Speech from 'expo-speech';
import Filter from 'bad-words';



// BEREAL
import { Publication, PublicationEntity } from "../../../domain/publication/publication.entity";
import { PublicationService } from "../../services/publication/publication.service";
import ShareComponent from "../components/search/search";

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../assets/fonts/SFNS.otf'),
  });
}

export default function ProfileScreen() {
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [photoUser, setPhotoUser] = useState("");
  const [auxPhotoUser, setAux] = useState("");
  const [loading, setLoading] = useState(false);
  const [cam, setCam] = useState(false);
  let CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/diuyzbt14/upload";
  const navigation = useNavigation();

  // BEREAL
  const [listOwnPublications, setListOwnPublications] = useState<Publication[]>([]);
  const [numPagePublication, setNumPagePublication] = useState<number>(1);
  const [numOwnPublications, setNumOwnPublications] = useState<number>(0);
  const [recargar, setRecargar] = useState<string>('');
  const [currentPublicationIndex, setCurrentPublicationIndex] = useState(1);

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

  const logOutButtonFunction = async () => {
    try {
      const nothing = "";
      AsyncStorage.setItem('token', nothing);
      navigation.navigate('LoginScreen' as never);
    } catch (error) {
      console.error("Error deleting the token: ", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
          try {
            await CRUDService.getUser(userId).then(async (response) => {
              if (response?.data && response.data.descriptionUser) {
          
                const customFilter = new Filter({regex: /\*|\.|$/gi});
                customFilter.addWords('idiota', 'retrasado');
      
                const filteredDescription = customFilter.clean(response.data.descriptionUser);
                console.log(filteredDescription);
              
                response.data.descriptionUser = filteredDescription;
                setCurrentUser(response.data);
              }
              try{
                await SessionService.getAudioDescription()
                .then((isAudioDescription) => {
                  if(isAudioDescription==='si'){
                    speakCurrentUser(response?.data);
                  }
                });
              
              }catch{
                console.log("NO SE OBTIENE BIEN EL GET AUDIO DESCRIPTION.");
              }
              
            });
          } catch (error) {
            console.error("Error retrieving user:", error);
          }
        }
      };
      getUser();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      const fetchData = async () => {
        try {
          const userId = await SessionService.getCurrentUser();
          if (userId && isMounted) {
            const response = await PublicationService.obtainOwnPosts(userId);
            const publications = response.data;

            if (isMounted) {
              setListOwnPublications(publications);
              setNumOwnPublications(publications.length);
            }
          }
        } catch (error) {
          console.error("Error obtaining our own publications: ", error);
        }
      };
      fetchData();
      return () => {
        isMounted = false;
      };
    }, [numPagePublication, recargar])
  );  
  
  const speakCurrentUser = async (currentUser:UserEntity) => {
    try {
      if (currentUser) {
        Speech.speak(`You're in the profile of ${currentUser.appUser}`, { language: 'en' });
        await new Promise((resolve) => setTimeout(resolve, 500)); // Pausa de 500 ms
        if(currentUser.followersUser)
        Speech.speak(`He has ${currentUser.followersUser.length.toString()} followers`, { language: 'en' });
        await new Promise((resolve) => setTimeout(resolve, 500)); // Pausa de 500 ms
        if(currentUser.followedUser)
        Speech.speak(`He is following ${currentUser.followedUser.length.toString()} users`, { language: 'en' });
        await new Promise((resolve) => setTimeout(resolve, 500)); // Pausa de 500 ms
        Speech.speak(`His name is ${currentUser.nameUser}`, { language: 'en' });
        await new Promise((resolve) => setTimeout(resolve, 500)); // Pausa de 500 ms
        Speech.speak(`His description is ${currentUser.descriptionUser}`, { language: 'en' });
      }
    } catch (error) {
      console.error('Error al leer en voz alta:', error);
    }
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 38,
  },
  titleContainer: {
    marginBottom: 20,
  },
  profileContour: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  profile: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileUserName: {
    fontSize: 28,
    textAlign: 'center',
    fontFamily: bodyFont,
    color: "#66fcf1",
    marginRight: 4,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  profileUserButtons: {
    marginBottom: 0,
    marginTop:20,
    flexDirection: "row",
  },
  buttonForChanges: {
    marginRight: 4,
    marginLeft: 4,
    padding: 6,
    backgroundColor: "#66fcf1",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignSelf: "center",
    alignContent: "center",
    alignItems: 'center',
  },
  insideButtonForChanges: {
    flexDirection: "row",
  },
  buttonLogOut: {
    justifyContent: 'center',
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: bodyFont,
    fontSize: 16,
    color: '#000',
    marginTop: 0,
    marginBottom: 0,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 12,
    marginBottom: -10,
  },
  profileStatCountLeft: {
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileStatCountRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  textFoll: {
    fontSize: 14,
    fontFamily: bodyFont,
    color: "yellow",
  },
  numFoll: {
    fontFamily: bodyFont,
    fontSize: 26,
    color: '#66fcf1',
  },
  titleNameDescription: {
    fontSize: 14,
    fontFamily: bodyFont,
    color: "white",
  },
  textNameDescription: {
    fontSize: 22,
    fontFamily: bodyFont,
    color: "#66fcf1",
    marginBottom: 10,
  },
  profileBio: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileRealName: {
    fontSize: 16,
    fontFamily: bodyFont,
    marginBottom: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  usernameAndVerified: {
    flexDirection: "row",
    alignItems: 'center',
  },
  iconVerified: {
    marginTop: 2,
  },
  post_images: {
    width: 120,
    height: 120,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  posts: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  post_complete: {
    alignItems: 'center',
    marginRight: 4,
    marginLeft: 4,
  },
  post_description: {
    alignItems: 'center',
    width: 120,
    backgroundColor: 'black',
    marginTop: 4,
    borderRadius: 16,
  },
  text_post: {
    fontSize: 16,
    fontFamily: bodyFont,
    color: "white",
    marginTop: 4,

  },
  time_post: {
    fontSize: 12,
    fontFamily: bodyFont,
    color: "yellow",
    marginTop: 2,
    marginBottom: 6,
  },
  scrow_style: {
    marginTop: 10,
    marginBottom: 0,
    marginLeft: 0,
    flex: 1,
  },
});
  
  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View>
        <ShareComponent url={"http://147.83.7.158:5432/user/" + currentUser?.uuid} />
        </View>
        <View style={styles.profileContour}>
          {currentUser && (
            <View style={styles.profileContainer}>
              <View style={styles.profile}>
                <View style={styles.usernameAndVerified}>
                  <Text style={styles.profileUserName}>{currentUser.appUser}</Text>
                  <MaterialCommunityIcons style={styles.iconVerified} color="#3897f0" name="check-circle" size={18} />
                </View>
                <View style={styles.profileUserButtons}>
                  <TouchableOpacity onPress={() => {navigation.navigate("Edit" as never);}} style={styles.buttonForChanges}>
                    <View style={styles.insideButtonForChanges}>
                      <MaterialCommunityIcons color="black" name="pencil" size={18} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {navigation.navigate("Settings" as never);}} style={styles.buttonForChanges}>
                    <View style={styles.insideButtonForChanges}>
                      <MaterialCommunityIcons color="black" name="cog" size={18} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.profileImage}>
                  <Image source={{ uri: currentUser.photoUser }} style={styles.image}/>
                </View>
                <View style={styles.profileStats}>
                  <TouchableOpacity style={styles.profileStatCountLeft} onPress={() => {navigation.navigate("UsersList" as never, { userId: currentUser.uuid, mode: "followers"} as never);}}>
                    <Text style={styles.numFoll}>{currentUser.followersUser?.length}</Text>
                    <Text style={styles.textFoll}>Followers</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileStatCountRight} onPress={() => {navigation.navigate("UsersList" as never, { userId: currentUser.uuid, mode: "following"} as never);}}>
                    <Text style={styles.numFoll}>{currentUser.followedUser?.length}</Text>
                    <Text style={styles.textFoll}>Following</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.profileBio}>
                  <Text style={styles.titleNameDescription}>Name</Text>
                  <Text style={styles.textNameDescription}>{currentUser.nameUser}</Text>
                  <Text style={styles.titleNameDescription}>Description</Text>
                  <Text style={styles.textNameDescription}>{currentUser.descriptionUser}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.buttonLogOut} onPress={logOutButtonFunction}>
                <MaterialCommunityIcons color="#3897f0" name="logout" size={24} />
              </TouchableOpacity>
              <ScrollView style={styles.scrow_style} horizontal>
                {listOwnPublications.map((publication, index) => (
                  <View key={index} style={styles.post_complete}>
                    <Text style={styles.time_post}>{new Date(publication.createdAt).toLocaleString()}</Text>
                    <Image style={styles.post_images} source={{ uri: publication.photoPublication[0] }}/>
                    <Text style={styles.text_post}>{publication.textPublication}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </ImageBackground>

  );
}

