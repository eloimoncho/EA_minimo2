import React, { useEffect, useState } from 'react';
import { View, Button, Image, Text, TouchableOpacity, Alert, ImageBackground, Platform } from 'react-native';
import StyledTextInputs from '../components/inputs/StyledTextInputs';
import { CRUDService } from '../../services/user/CRUD.service';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SessionService } from '../../services/user/session.service';
import { UserAuthEntity } from '../../../domain/user/user.entity';
import { UserAuthValue } from '../../../domain/user/user.value';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Font from 'expo-font';

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../assets/fonts/SFNS.otf'),
  });
}

export default function EditUserScreen() {
  const navigation = useNavigation();
  const [photoUser, setPhotoUser] = useState("");
  const [auxPhotoUser, setAux] = useState("");
  const [loading, setLoading] = useState(false);
  const [cam, setCam] = useState(false);
  let CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/diuyzbt14/upload";
  const [userData, setUserData] = useState({
    uuid: '',
    appUser: '',
    nameUser: '',
    surnameUser: '',
    mailUser: '',
    passwordUser: '',
    photoUser: '',
    birthdateUser: new Date(),
    genderUser: 'male',
    ocupationUser: '',
    descriptionUser: '',
    roleUser: 'common',
    privacyUser: false,
    deletedUser: false,
    followersUser: [],
    followedUser: [],
  });

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
        if (userId) {
          try {
            await CRUDService.getUser(userId).then((response) => {
              setUserData(response?.data);
            });
          } catch (error) {
            console.error("Error retrieving user:", error);
          }
        }
      };
      getUser();
    }, [])
  );
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
    console.log(result);

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
      Alert.alert("Hello", "You must complete all the fields");
    } else {
      const auxiliar=userData.photoUser;
      userData.photoUser=url;
      console.log(url);
      
    }
  };

  const handleChange = (key: any, value: any) => {
    setUserData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    try {
      console.log("AAAAAAA")
      CRUDService.editUser(userData).then((response) => {
        console.log("BBBBBB")
        console.log(response?.data);
        navigation.navigate('HomeScreen' as never);
      });
    } catch (error) {
      console.error("Error editing user:", error);
    }
    console.log(userData);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#66fcf1', fontSize: 30 }
    });
  }, [navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginTop: 0,
      marginBottom: 0,
    },
    input: {
      width: 300,
      height: 40,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    containerImage: {
      position: 'relative',
    },
    buttonForChanges: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 150,
      height: 150,
      borderRadius: 75,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonForSaving: {
      marginTop: 12,
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      alignContent: "center",
      alignItems: 'center',
    },
    titleText: {
      marginTop: 16,
      marginBottom: -16,
      fontSize: 14,
      fontFamily: bodyFont,
      color: "white",
    },
  });

  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.containerImage}>
          <Image style={styles.profileImage} source={{ uri: userData.photoUser }}/>
          <TouchableOpacity style={styles.buttonForChanges} onPress={handleGalleryPress}>
            <MaterialCommunityIcons color="white" name="image-edit" size={24} />
          </TouchableOpacity>
        </View>
        <Text style={styles.titleText}>Username</Text>
        <StyledTextInputs style={[styles.input, { color: '#fb3958' }]} placeholder="Username" value={userData.appUser} editable={false} onChangeText={(value: string) => handleChange('appUser', value)}/>
        <Text style={styles.titleText}>Name</Text>
        <StyledTextInputs style={styles.input} placeholder="Name" value={userData.nameUser} onChangeText={(value: string) => handleChange('nameUser', value)}/>
        <Text style={styles.titleText}>Surname</Text>
        <StyledTextInputs style={styles.input} placeholder="Surname" value={userData.surnameUser} onChangeText={(value: string) => handleChange('surnameUser', value)}/>
        <Text style={styles.titleText}>Email</Text>
        <StyledTextInputs style={[styles.input, { color: '#fb3958' }]} placeholder="Email" value={userData.mailUser} editable={false} onChangeText={(value: string) => handleChange('mailUser', value)}/>
        <Text style={styles.titleText}>Description</Text>
        <StyledTextInputs style={styles.input} placeholder="Description" value={userData.descriptionUser} onChangeText={(value: string) => handleChange('descriptionUser', value)}/>
        <Text style={styles.titleText}>Save</Text>
        <TouchableOpacity style={styles.buttonForSaving} onPress={handleSubmit}>
          <MaterialCommunityIcons color="#3897f0" name="content-save" size={24} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
