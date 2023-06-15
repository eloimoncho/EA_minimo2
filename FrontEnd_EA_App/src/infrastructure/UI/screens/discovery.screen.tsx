import { SessionService } from "../../services/user/session.service";
import { useFocusEffect } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Button, FlatList, ImageBackground, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserEntity } from "../../../domain/user/user.entity";
import SearchBar from "../components/searchbar/searchbar";
import * as Font from 'expo-font';

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../assets/fonts/SFNS.otf'),
  });
}

export default function DiscoveryScreen() {

  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [userList, setUserList] = useState<UserEntity[] | null>(null);
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
      const getUser = async () => {
        const userId = await SessionService.getCurrentUser();
        console.log("ID of the Logged User:" + userId);
        if (userId) {
          try {
            await CRUDService.getUser(userId)
            .then((response) => {
              console.log("Punto 1: " + response);
              console.log(response?.data);
              setCurrentUser(response?.data);
            })
          } catch (error) {
            console.log("Error: " + error);
          }
        }
      };
      const getByDefect = async() =>{
        try {
          const response = await CRUDService.getUsers();
          setUserList(response?.data);
        } catch (error) {
          console.error(error);
        }
      };
      getByDefect();
      getUser();
    }, [])
  );

  const handleSearch = async (query: string, setUserList: (users: UserEntity[]) => void) => {
    console.log('He entrado en handleSearch.');
    if (query.length > 0) {
      try {
        const response = await CRUDService.searchUsers(query);
        console.log(response);
        setUserList(response?.data);
        console.log('He hecho el servicio de handleSearch.');
        console.log('>> Lista de usuarios: ' + userList);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await CRUDService.getUsers();
        setUserList(response?.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSearchWrapper = (searchText: string) => {
    handleSearch(searchText, setUserList);
  };
  
  const handleGoToScreenUser = (uuid:string) => {
    navigation.navigate("UserScreen" as never, {uuid} as never);
  };

  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
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
    searchedUserContainer: {
      marginBottom: 20,
    },
    searchedUsersContainer: {
      marginLeft: 20,
      marginTop: -10,
      height: '100%',
    },
    postProfileImg: {
      width: 50,
      height: 50,
      resizeMode: 'cover',
      marginRight: 10,
      borderRadius: 50,
    },
    pictureAndUser: {
      flexDirection: 'row',
    },
    notFound: {
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 16,
      marginTop: -10,
      marginBottom: 0,
      textAlign: "center",
    }
  });
  
  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <View>
        <SearchBar onSearch={handleSearchWrapper} />
        <View>
          {userList && userList.length > 0 ? (
            <FlatList style={styles.searchedUsersContainer}
              data={userList}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.searchedUserContainer} onPress={() => handleGoToScreenUser(item.uuid)}>
                  <View style={styles.pictureAndUser}>
                    <Image
                        source={{ uri: item.photoUser }}
                        style={styles.postProfileImg}
                        resizeMode="cover"
                      />
                    <View>
                      <Text style={styles.searchedUsername}>@{item.appUser}</Text>
                      <Text style={styles.searchedNameSurname}>{item.nameUser} {item.surnameUser}</Text>
                      <Text style={styles.searchedDescription}>{item.descriptionUser}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.uuid.toString()}
            />
          ) : (
            <Text style={styles.notFound}>User Not Found</Text>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}