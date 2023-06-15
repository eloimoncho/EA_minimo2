import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ImageBackground, Platform, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Button } from "react-native-paper";
import * as Font from 'expo-font';

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../../assets/fonts/SFNS.otf'),
  });
}

export default function PublicationUpScreenA() {
  const [photoPublication, setPhotoPublication] = useState("");
  const [auxPhotoPublication, setAux] = useState("");
  const [loading, setLoading] = useState(false);
  const [cam, setCam] = useState(false);

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

 
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
      setPhotoPublication(base64Image);

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

          setPhotoPublication(data.url);
          console.log(photoPublication)

          console.log('Hey')
          console.log('How')
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
      setPhotoPublication(base64Image);

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

          setPhotoPublication(data.url);
          console.log("PH:  " + photoPublication)
          console.log('Hey')
          console.log('How')

          handleUpload(data.url); // Pass the updated value directly
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  };

  const handleUpload = (url:any) => {
    if (!url) {
      Alert.alert("Hello", "You must complete all the fields");
    } else {
      navigation.navigate("ScreenPublicationUpB" as never, { photoPublication: url } as never);
    }
  };
  const handleButtonPress = () => {
    // Navegar hacia otra pantalla aquí
    navigation.navigate("ChatA" as never);
  };

  const titleFont = Platform.select({
    ios: 'Rafaella',
    android: 'Rafaella',
  });
  const bodyFont = Platform.select({
    ios: 'SFNS',
    android: 'SFNS',
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    button: {
      width: 56,
      height: 56,
      borderRadius: 40,
      backgroundColor: "black",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 4,
    },
    iconsInside: {
      color: '#66fcf1',
    },
    button_chat: {
      width: 56,
      height: 56,
      borderRadius: 40,
      backgroundColor: "#66fcf1",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 4,
    },
    iconsInside_chat: {
      color: 'black',
    },
    bottomText: {
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 18,
      marginTop: 0,
      marginBottom: 4,
    },
    bottomButton: {
      position: "absolute",
      bottom: 20,
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "green",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <ImageBackground source={require('../../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <>  
            <Text style={styles.bottomText}>Take a Picture</Text>
            <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
              <Ionicons style={styles.iconsInside} name="camera" size={32} />
            </TouchableOpacity>

            <Text style={styles.bottomText}>Upload a Picture</Text>
            <TouchableOpacity style={styles.button} onPress={handleGalleryPress}>
              <Ionicons style={styles.iconsInside} name="image" size={30} />
            </TouchableOpacity>

            <Text style={styles.bottomText}>Start a Chat</Text>
            <TouchableOpacity style={styles.button_chat} onPress={handleButtonPress}>
              <Ionicons style={styles.iconsInside_chat} name="chatbubble-ellipses" size={30} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
    
  );
  
  /*
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
            <Ionicons name="camera" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleGalleryPress}>
            <Ionicons name="image" size={32} color="white" />
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.bottomButton} onPress={handleButtonPress}>
        <Ionicons name="arrow-forward" size={32} color="white" />
      </TouchableOpacity>

    </View>
  );
  */

}

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  bottomButton: {
    position: "absolute",
    bottom: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
});*/
 

  
