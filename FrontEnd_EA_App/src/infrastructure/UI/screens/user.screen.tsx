import React, { useEffect, useState } from "react";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { UserEntity } from "../../../domain/user/user.entity";
import { CRUDService } from "../../services/user/CRUD.service";
import { SessionService } from "../../services/user/session.service";
import { StyleSheet, Text, View, Image, TouchableOpacity, Button, FlatList, Platform, ImageBackground } from "react-native";
import * as Font from 'expo-font';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../assets/fonts/SFNS.otf'),
  });
}

interface RouteParams {
    uuid: string
}

export default function UserScreen() {

  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [myId, setMyId] = useState("1234");
  const route = useRoute()
  const routeParams = route.params as RouteParams | undefined;
  const uuid = routeParams?.uuid;
  const navigation = useNavigation();
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

  useFocusEffect(
    React.useCallback(() => {
      console.log("Iniciamos feed");
      const fetchData = async () => {
        const userId = await SessionService.getCurrentUser();
        console.log(userId);
        setMyId(userId);
        if (userId) {
          try {
            const response = await CRUDService.getUser(uuid??"");
            console.log("Punto 1:", response);
            console.log(response?.data);
            setCurrentUser(response?.data);
          } catch (error) {
            console.log("Encontre el id pero no va")
          }

          try {
            const response = await CRUDService.isFollowed(userId, uuid?? "");
            console.log("Punto 1:", response);
            console.log(response?.data);
            setIsFollowing(response?.data);
          } catch (error) {
            console.log("Encontre el id pero no va")
          }
        }
      };
      fetchData();
    }, [uuid])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#66fcf1', fontSize: 30 },
      headerTitle: () => (
        <Text style={{ color: '#66fcf1', fontSize: 30, fontFamily: bodyFont }}>List</Text>
      )
    });
  }, [navigation]);

  const handleFollow = async () => {
      
    // Aquí implemento la lógica para seguir o dejar de seguir al usuario
    console.log("Este usuario es seguir tuyo?:" + isFollowing);
    if(isFollowing){
      try {
        const response = await CRUDService.removeFollowed(myId, uuid ?? 'NoID');
        console.log("Pedimos la relacion que tenemos con ese user:: exito");
        console.log(response);
        if(response){
            setIsFollowing(false);
        }
        else{
            alert("Algo ha ido mal al borrar el followed")
        }
          
      } catch (error) {
        console.log("Pedimos la relacion que tenemos con ese user:: mal");
        console.error(error);
      }
    }else{
      try {
        const response = await CRUDService.addFollowed(myId, uuid ?? 'NoID');
        console.log("Pedimos la relacion que tenemos con ese user:: exito");
        console.log(response);
        if(response){
            setIsFollowing(true);
        }
        else{
            alert("Algo ha ido mal al añadir el followed")
        }
      } catch (error) {
        console.log("Pedimos la relacion que tenemos con ese user:: mal");
        console.error(error);
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#000",
    },
    followButton: {
      margin: 6,
      padding: 6,
      backgroundColor: "#66fcf1",
      borderRadius: 20,
      width: 100,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      marginBottom: 60,
      marginTop: 10,
    },
    followingButton: {
      margin: 6,
      padding: 6,
      backgroundColor: "black",
      borderRadius: 20,
      width: 100,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      marginBottom: 60,
      marginTop: 10,
    },
    followButtonText: {
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 16,
      color: '#000',
      marginTop: 0,
      marginBottom: 0,
    },
    followingButtonText: {
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 16,
      color: '#66fcf1',
      marginTop: 0,
      marginBottom: 0,
    },
    image: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginTop: 0,
      marginBottom: 0,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    titleContainer: {},
    titleSection: {},
    profileContour: {
      alignItems: "center",
      justifyContent: "center",
    },
    profileContainer: {
      alignItems: "center",
      justifyContent: "center",
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
      marginTop: 20,
      marginBottom: 18,
    },
    profileImgCard: {},
    profileUserButton: {},
    profileUserButtons: {},
    buttonProfile: {},
    profileStats: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    profileTitle: {},
    profileStatCount: {
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
    profileBio: {
      alignItems: "center",
      justifyContent: "center",
    },
    profileRealName: {},
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
    usernameAndVerified: {
      flexDirection: "row",
      alignItems: 'center',
    },
    iconVerified: {
      marginTop: 2,
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
  })

  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.profileContour}>
          {currentUser && (
            <View style={styles.profileContainer}>
              <View style={styles.profile}>
                <View style={styles.usernameAndVerified}>
                  <Text style={styles.profileUserName}>{currentUser.appUser}</Text>
                  <MaterialCommunityIcons style={styles.iconVerified} color="#3897f0" name="check-circle" size={18} />
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
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handleFollow} style={isFollowing ? styles.followingButton : styles.followButton}>
          <Text style={isFollowing ? styles.followingButtonText : styles.followButtonText}>{isFollowing ? "Following" : "Follow"}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );  

}

