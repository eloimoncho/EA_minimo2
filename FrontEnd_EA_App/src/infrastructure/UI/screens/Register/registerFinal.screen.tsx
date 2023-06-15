import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, Platform, StyleSheet, ImageBackground, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { SessionService } from "../../../services/user/session.service";
import { UserAuthEntity } from "../../../../domain/user/user.entity";
import * as Font from 'expo-font';
import MainContainer from "../../components/containers/Main";

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
  photoUser?: string;
  birthdateUser?: string;
  genderUser?: string;
  ocupationUser?: string;
  descriptionUser?: string;
  roleUser?: string;
  privacyUser?: string;
}

export default function ScreenRegisterFinal({
  navigation,
}: {
  navigation: any;
}) {
  const route = useRoute();
  const {
    appUser,
    nameUser,
    surnameUser,
    mailUser,
    passwordUser,
    photoUser,
    birthdateUser,
    genderUser,
    ocupationUser,
    descriptionUser,
    roleUser,
    privacyUser,
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

  const handleRegister = async () => {
    try {
      const user: UserAuthEntity = {
        uuid: "a" ?? "",
        appUser: appUser ?? "",
        nameUser: nameUser ?? "",
        surnameUser: surnameUser ?? "",
        mailUser: mailUser ?? "",
        passwordUser: passwordUser ?? "",
        photoUser: photoUser ?? "",
        birthdateUser: new Date(birthdateUser ?? ""),
        genderUser:
          genderUser === "male" || genderUser === "female"
            ? genderUser
            : "male",
        ocupationUser: ocupationUser ?? "",
        descriptionUser: descriptionUser ?? "",
        roleUser:
          roleUser === "admin" ||
          roleUser === "common" ||
          roleUser === "verified" ||
          roleUser === "business"
            ? roleUser
            : "common",
        privacyUser: privacyUser === "private" ? true : false,
        deletedUser: false,
      };

      SessionService.register(user).then((response)=>{
        console.log(response);
        if(response.status===200){
          console.log(JSON.stringify(response.data));
        };
      }).catch((error)=>{
        console.log("error: "+error);
      })
      //console.log("Registration successful:", response.data);

      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    mainContainer: {
      backgroundColor: 'transparent',
      marginTop: 20,
      marginBotton: 20,
    },
    nextBackButton: {
      margin: 6,
      padding: 6,
      backgroundColor: "#66fcf1",
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      marginBottom: 96,
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
    subtitleText: {
      fontFamily: bodyFont,
      fontSize: 14,
      color: 'yellow',
    },
    contentText: {
      fontFamily: bodyFont,
      fontSize: 18,
      color: '#66fcf1',
      marginBottom:6,
    },
    finalHeader: {
      marginBottom: 20,
    },
    button: {
      marginTop: 16,
      height: 38,
      width: 120,
      borderRadius: 50,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#66fcf1',
    },
    registerText: {
      color: 'black',
      fontFamily: bodyFont,
      fontSize: 16,
      marginBottom: 0,
      justifyContent: 'center',
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginTop: 0,
      marginBottom: 20,
    },
  });

  const imageUrl = photoUser;

  return (
    <ImageBackground source={require('../../../../../assets/visualcontent/background_6.png')} style={styles.backgroundImage}>
      <MainContainer style={styles.mainContainer}>
        <View style={styles.finalHeader}>
          <Text style={styles.registerTitle}>Register</Text>
          <Text style={styles.stepTitle}>Final Step</Text>
        </View>
        <Image source={{ uri: imageUrl }} style={styles.profileImage} />
        <Text style={styles.subtitleText}>Username</Text>
        <Text style={styles.contentText}>{appUser}</Text>
        <Text style={styles.subtitleText}>Name and Surname</Text>
        <Text style={styles.contentText}>{nameUser} {surnameUser}</Text>
        <Text style={styles.subtitleText}>Email</Text>
        <Text style={styles.contentText}>{mailUser}</Text>
        <Text style={styles.subtitleText}>Gender</Text>
        <Text style={styles.contentText}>{genderUser}</Text>
        <Text style={styles.subtitleText}>Occupation</Text>
        <Text style={styles.contentText}>{ocupationUser}</Text>
        <Text style={styles.subtitleText}>Description</Text>
        <Text style={styles.contentText}>{descriptionUser}</Text>
        <Text style={styles.subtitleText}>Account Type / Role</Text>
        <Text style={styles.contentText}>{roleUser}</Text>
        <TouchableOpacity style={styles.button} onPress={handleRegister}> 
            <Text style={styles.registerText}>Finish Register</Text> 
          </TouchableOpacity>
      </MainContainer>
    </ImageBackground>
  );
}
