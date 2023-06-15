import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, Alert, ActivityIndicator, TouchableOpacity, ImageBackground, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import ButtonGradientBack from "../../components/buttons/Button_Type_2";
import ButtonGradientBack2 from "../../components/buttons/Button_Type_3";
import SubTitle from "../../components/texts/Subtitle";
import * as Font from 'expo-font';
import MainContainer from "../../components/containers/Main";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../../assets/fonts/SFNS.otf'),
  });
}

interface RouteParams {
  appUser?: any;
  nameUser?: string;
  surnameUser?: string;
  mailUser?: string;
  passwordUser?: string;
}
export default function ScreenRegisterC() {
  const route = useRoute();
  const {
    appUser,
    nameUser,
    surnameUser,
    mailUser,
    passwordUser,
  }: RouteParams = route.params || {};

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

  const [photoUser, setPhotoUser] = useState("");
  const [auxPhotoUser, setAux] = useState("");
  const [loading, setLoading] = useState(false);
  const [cam, setCam] = useState(false);
  const navigation = useNavigation();
  let CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/diuyzbt14/upload";
  
  const handleCameraPress = async () => {
    setCam(true);
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permissions Denied", "Please allow camera access to proceed.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setAux(result.assets[0].uri);
      setLoading(true);
      const base64Image = await convertImageToBase64(result.assets[0].uri);
      setPhotoUser(base64Image);

      let data = {
        file: base64Image,
        upload_preset: "publication",
      };
      fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      })
        .then(async (r) => {
          let data = await r.json();

          setPhotoUser(data.url);
          console.log(photoUser)

          console.log('Hey')
          console.log('How')
          //setPhotoUser(data.url);
          handleUpload(data.url); // Pass the updated value directly
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  };

  const convertImageToBase64 = async (imageUri:any) => {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpg;base64,${base64}`;
  };

  const handleGalleryPress = async () => {
    setCam(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setAux(result.assets[0].uri);
      setLoading(true);
      const base64Image = await convertImageToBase64(result.assets[0].uri);
      setPhotoUser(base64Image);

      let data = {
        file: base64Image,
        upload_preset: "publication",
      };
      fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      })
        .then(async (r) => {
          let data = await r.json();

          setPhotoUser(data.url);
          console.log("PH:  " + photoUser)
          console.log('Hey')
          console.log('How')
          //setPhotoUser(data.url);
          handleUpload(data.url); // Pass the updated value directly
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  };
  const handleUpload = (url:any) => {
    if (!url) {
      Alert.alert("Warning", "Complete all the field to continue!");
    } else {
      console.log(appUser);
      console.log(nameUser);
      console.log(surnameUser);
      console.log(mailUser);
      console.log(passwordUser);
      console.log(url);
      navigation.navigate(
        "ScreenRegisterD" as never,
        {
            appUser,
            nameUser,
            surnameUser,
            mailUser,
            passwordUser,
            photoUser:url, // Use the updated value directly
        } as never
      );
    }
  };
  const handleGoBack = () => {
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    text:{
      marginBottom:0,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      marginBottom: 10,
      marginTop: 10,
    },
    buttonContainerB: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 0,
      marginBottom:0,
    },
    buttonA: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20,
    },
    buttonB: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 20,
    },
    gradient: {
      width: "100%",
      height: "100%",
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    mainContainer: {
      backgroundColor: 'transparent',
    },
    nextBackButton: {
      margin: 0,
      padding: 6,
      backgroundColor: "#66fcf1",
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      marginBottom: 0,
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 16,
      color: '#000',
      marginTop: 10,
      alignItems: 'center',
    },
    newPost: {
      margin: 6,
      padding: 6,
      backgroundColor: "#66fcf1",
      borderRadius: 40,
      width: 62,
      height: 62,
      justifyContent: 'center',
      alignSelf: "center",
      marginBottom: 0,
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 16,
      color: '#000',
      marginTop: 0,
      alignItems: 'center',
    },
    input: {
      width: 300,
      height: 40,
    },
    registerTitle: {
      textAlign: 'center',
      fontFamily: titleFont,
      paddingTop: 4,
      fontSize: 34,
      color: '#ffffff',
      height: 40,
    },
    stepTitle: {
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 18,
      color: '#ffffff',
    },
    stepSubtitle: {
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 16,
      color: 'yellow',
      marginTop: 10,
      marginBottom: 14,
    },
  });
  

  return (
    <ImageBackground source={require('../../../../../assets/visualcontent/background_6.png')} style={styles.backgroundImage}>
      <MainContainer style={styles.mainContainer}>
        <Text style={styles.registerTitle}>Register</Text>
        <Text style={styles.stepTitle}>Step 3</Text>
        <Text style={styles.stepSubtitle}>Upload a Profile Picture</Text>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
          ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.newPost} onPress={handleCameraPress}>
              <Ionicons name="camera" size={32} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.newPost} onPress={handleGalleryPress}>
              <Ionicons name="image" size={32} color="black" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.buttonContainerB}>
          <TouchableOpacity style={styles.nextBackButton} onPress={handleGoBack}>
            <MaterialCommunityIcons color="#000000" name="arrow-left" size={24} />
          </TouchableOpacity>
        </View>
      </MainContainer>
    </ImageBackground>
  );
}

