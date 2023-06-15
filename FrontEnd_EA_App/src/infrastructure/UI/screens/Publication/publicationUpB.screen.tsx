import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, ActivityIndicator, StyleSheet, Platform, ImageBackground, TouchableOpacity } from "react-native";
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

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../../assets/fonts/SFNS.otf'),
  });
}

interface RouteParams {
  photoPublication?: string;
}

export default function ScreenPublicationUpB() {
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [textPublication, setTextPublication] = useState("");
  const [loading, setLoading] = useState(true);

  const [createdPublication, setCreatedPublication] = useState<PublicationEntity | null>(null);

  const route = useRoute();
  const navigation = useNavigation();
  const { photoPublication }: RouteParams = route.params || {};

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

  useEffect(() => {
    setLoading(true);
    const loadPhoto = async () => {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    loadPhoto();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
          try {
            await CRUDService.getUser(userId).then((response) => {
              setCurrentUser(response?.data);
            });
          } catch (error) {}
        }
      };
      getUser();
    }, [])
  );

  const handlePublication = async () => {
    const formData: PublicationEntity = {
      idUser: currentUser?.uuid ?? "",
      textPublication: textPublication ?? "",
      photoPublication: photoPublication ?? "",
    };
    console.log("FORM DATA: " + JSON.stringify(formData));
    PublicationService.uploadPublication(formData)
      .then((response) => {
        console.log("QQQ" + response);
        if (response.status === 200) {
          console.log("RESPUESTA en JSON: ", JSON.stringify(response.data));
          setCreatedPublication(formData);
          navigation.navigate("ScreenPublicationUpC" as never, { publication: formData } as never);
        } else {
          console.log("STATUS:" + response.status);
        }
      })
      .catch((error) => {
        console.error("error: " + error);
        console.log("error.response: " + error.response);
        switch (error.response.status) {
          case 403:
            // Poner aquí el alert ...
            console.log("Error");
            break;
          case 404:
            // Poner aquí el alert ...
            console.log("Error2");
            break;
        }
        navigation.navigate("HomeScreen" as never);
      });
  };

  const styles = StyleSheet.create({
    postImage: {
      alignSelf: "center",
      alignItems: "center",
      padding: 0,
      marginTop: 0,
      width: 320, 
      height: 320,
      borderRadius: 20,
      marginBottom: 14,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    input: {
      width: 320,
      height: 40,
      marginTop: 0,
      alignSelf: "center",
      alignItems: "center",
      marginBottom: 14,
    },
    newPostContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleText: {
      marginTop: 0,
      marginBottom: 4,
      fontSize: 14,
      fontFamily: bodyFont,
      color: "white",
      textAlign: 'center',
    },
    buttonForPosting: {
      alignItems: 'center',
      marginTop: -4,
    },
  });

  return (
    <ImageBackground source={require('../../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <View style={styles.newPostContainer}>
        {loading ? ( <ActivityIndicator size="large" color="blue" />
        ) : (
          <View>
            <Text style={styles.titleText}>Description</Text>
            <StyledTextInputs style={styles.input} placeholder="Write Here" value={textPublication} onChangeText={(value: React.SetStateAction<string>) => setTextPublication(value) }/>
            <Text style={styles.titleText}>Image</Text>
            <Image style={styles.postImage} source={{ uri: photoPublication }}/>
            <Text style={styles.titleText}>Upload</Text>
            <TouchableOpacity style={styles.buttonForPosting} onPress={handlePublication}>
              <MaterialCommunityIcons color="#3897f0" name="upload" size={24} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}