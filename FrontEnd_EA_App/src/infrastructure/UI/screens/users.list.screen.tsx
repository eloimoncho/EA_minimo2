import { SessionService } from "../../services/user/session.service";
import { UserEntity } from "../../../domain/user/user.entity";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Font from 'expo-font';
import { PublicationService } from "../../services/publication/publication.service";
import { PublicationLikes } from "../../../domain/publication/publication.entity";

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../assets/fonts/SFNS.otf'),
  });
}

interface RouteParams {
  userId?: string;
  mode?: string;
}

export default function UsersList() {
  const route = useRoute();
  const { userId, mode }: RouteParams = route.params || {};
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [currentPublication, setcurrentPublication] = useState<PublicationLikes | null>(null);
  const [userList, setUserList] = useState([]);
  const [numPage, setNumPage] = useState(1);
  const navigation = useNavigation();

  const isFollowersMode = mode === "followers";
  const isFollowingMode = mode === "following";
  const isLikesMode = mode === "likes";

  const title = isFollowersMode ? "Followers" : isFollowingMode ? "Following" : "Likes";

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

  useEffect(() => {
    if(userId){
      
      if(isFollowersMode || isFollowingMode){
        console.log("Entro donde no tenia que entrar");
        loadUser();
      }else{
        console.log("Entra la publicación");
        loadPublication();
      }

      loadUserList(); 
    } // Cargar la lista de usuarios al inicializar

    // Actualizar la lista de usuarios cuando cambie la página
  }, [numPage]);


  const loadUser = async () => {
    try {
      const response = await CRUDService.getUser(userId ?? 'NoID');
      console.log(userId)
      setCurrentUser(response?.data);
      console.log("Obtenemos los datos del otro usuario: exito");
    } catch (error) {
      navigation.navigate("ProfileScreen" as never);
      console.log("Obtenemos los datos del otro usuario: mal");
      console.error(error);
    }
  };

  const loadUserList = () => {
    // Obtener la lista de usuarios según el modo y el número de página
    if (isFollowersMode) {
      CRUDService.getFollowers(userId, numPage.toString())
        .then(response => {
          console.log(response);
          console.log(response?.data);
          setUserList(prevUserList => [...prevUserList, ...response?.data] as never);
        })
        .catch(error => {
            navigation.navigate("ProfileScreen" as never);
        });
    } else if (isFollowingMode){
        CRUDService.getFollowed(userId, numPage.toString())
        .then(response => {
          console.log(response);
          console.log(response?.data);
          setUserList(prevUserList => [...prevUserList, ...response?.data] as never);
        })
        .catch(error => {
          navigation.navigate("ProfileScreen" as never);
        });
    } else if (isLikesMode) {
      PublicationService.getListLikes(userId, numPage.toString())
      .then(response => {
        console.log(response);
        console.log(response.data.likesPublication);
        setUserList(prevUserList => [...prevUserList, ...response.data.likesPublication] as never);
      })
      .catch(error => {
        navigation.navigate("ProfileScreen" as never);
      });
    }
  };

  const loadPublication = async () => {
    try {
      const response = await PublicationService.getPublication(userId ?? 'NoID');
      setcurrentPublication(response.data);
      console.log("Obtenemos los datos del otro usuario: exito");
    } catch (error) {
      navigation.navigate("NotFoundScreen" as never);
      console.log("Obtenemos los datos del otro usuario: mal");
      console.error(error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#66fcf1', fontSize: 30 },
      headerTitle: () => (
        <Text style={{ color: '#66fcf1', fontSize: 30, fontFamily: bodyFont }}>List</Text>
      )
    });
  }, [navigation]);

  const handleLoadMore = () => {
    console.log("entro al load more");
    setNumPage(prevNumPage => prevNumPage + 1); // Aumentar el número de página al hacer clic en "Obtener más"
  };

  const handleGoToScreenUser = (uuid:string) => {
    navigation.navigate("UserScreen" as never, {uuid} as never);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
    },
    searchedUsername: {
      color: 'yellow',
      fontFamily: bodyFont,
      fontSize: 18,
      marginTop: 0,
      marginBottom: 0,
    },
    searchedNameSurname: {
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 18,
      marginTop: 0,
      marginBottom: 0,
    },
    searchedDescription: {
      color: '#66fcf1',
      fontFamily: bodyFont,
      fontSize: 14,
      marginTop: 0,
      marginBottom: 0,
    },
    header: {
      marginBottom: 16,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    title: {
      fontSize: 28,
      fontFamily: titleFont,
      color: "#ffffff",
      marginTop: 20,
      marginBottom: 2,
      paddingTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    userList: {
      flex: 1,
      marginLeft: 20,
    },
    userCard: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 8,
    },
    userInfo: {
      flex: 1,
      width: 200,
    },
    userName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    username: {
      fontSize: 14,
      color: "#888",
    },
    notFoundText: {
      fontSize: 16,
      color: "#888",
      textAlign: "center",
    },
    loadMoreButton: {
      padding: 6,
      backgroundColor: "#66fcf1",
      borderRadius: 20,
      width: 100,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      marginBottom: 36,
      marginLeft: -20,
    },
    loadMoreButtonDisabled: {
      padding: 6,
      backgroundColor: "#66fcf27e",
      borderRadius: 20,
      width: 100,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      marginBottom: 36,
      marginLeft: -20,
    },
    loadMoreButtonText: {
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 16,
      color: '#000',
      marginTop: 0,
      marginBottom: 0,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    
  });

  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.userList}>
          {userList.length > 0 ? (
            <ScrollView>
              {userList.map((user:UserEntity) => (
                <TouchableOpacity key={user.uuid} style={styles.userCard} onPress={() => handleGoToScreenUser(user.uuid)}>
                  {user.photoUser ? (<Image source={{ uri: user.photoUser }} style={styles.profileImage}/>
                        ) : (
                          <Image source={{ uri: "https://pbs.twimg.com/profile_images/1354463303486025733/Bn-iEeUO_400x400.jpg" }} style={styles.profileImage}/>
                        )}
                  <View style={styles.userInfo}>
                    <Text style={styles.searchedUsername}>@{user.appUser}</Text>
                    <Text style={styles.searchedNameSurname}>{user.nameUser} {user.surnameUser}</Text>
                    <Text style={styles.searchedDescription}>HOLAAAA{user.descriptionUser}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.notFoundText}>User Not Found</Text>
          )}
          {isFollowersMode ? (
            currentUser?.followersUser?.length !== undefined && currentUser.followersUser.length > numPage * 2 ? (
              <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                <Text style={styles.loadMoreButtonText}>Load More</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.loadMoreButtonDisabled} disabled>
                <Text style={styles.loadMoreButtonText}>Load More</Text>
              </TouchableOpacity>
            )
          ):(
            currentUser?.followedUser?.length !== undefined && currentUser.followedUser.length > numPage * 2 ? (
              <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                <Text style={styles.loadMoreButtonText}>Load More</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.loadMoreButtonDisabled} disabled>
                <Text style={styles.loadMoreButtonText}>Load More</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </ImageBackground>

  );
};
