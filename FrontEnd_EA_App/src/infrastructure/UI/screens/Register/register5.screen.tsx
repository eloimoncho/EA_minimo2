import React, { useEffect, useState } from "react";
import { Alert, View, Text, StyleSheet, Platform, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import MainContainer from "../../components/containers/Main";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";
import ButtonGradientNext from "../../components/buttons/Button_Type_Next";
import ButtonGradientBack from "../../components/buttons/Button_Type_2";
import * as Font from 'expo-font';
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
  photoUser?: string;
  birthdateUser?: string;
  genderUser?: string;
  ocupationUser?: string;
}

export default function ScreenRegisterE() {
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
  }: RouteParams = route.params || {};

  const [descriptionUser, setDescriptionUser] = useState("");
  const [roleUser, setRoleUser] = useState("common");
  const [privacyUser, setPrivacyUser] = useState<boolean>(false);

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

  const handleGoToScreenRegisterF = () => {
    if (!descriptionUser) {
      Alert.alert("Warning", "Complete all the field to continue!");
    } else {
      const selectedRole=roleUser || "common";
      const selectedPrivact=privacyUser || false;
      console.log(appUser);
      console.log(nameUser);
      console.log(surnameUser);
      console.log(mailUser);
      console.log(passwordUser);
      console.log(photoUser);
      console.log(birthdateUser);
      console.log(genderUser);
      console.log(ocupationUser);
      console.log(descriptionUser);
      console.log(roleUser);
      console.log(privacyUser);
      navigation.navigate("ScreenRegisterFinal" as never, {
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
        roleUser:selectedRole,
        privacyUser:selectedPrivact,
      }as never);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    text: {
      color: "white",
      fontStyle: "italic",
      marginBottom: 20,
      marginTop: 20,
      alignContent: "center",
    },
    picker: {
      color: "black",
      fontWeight:'bold',
      backgroundColor: "#66fcf1",
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 14,
      marginTop: 20,
      marginBottom: 0,
      width: 160,
      height: 62,
    },
    insidePicker: {
      backgroundColor: 'transparent',
      width: 68,
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      marginTop:4,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    textInput: {
      width: 300,
      height: 40,
      justifyContent:"center",
      alignItems: 'center',
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    mainContainer: {
      backgroundColor: 'transparent',
      alignItems: 'center',
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
    pickerItem:{
      fontSize: 16,
      color: "black",
      fontFamily: bodyFont,
      height: 60,
    },
    formContainer: {
      alignItems: 'center',
    },
  });

  return (
    <ImageBackground source={require('../../../../../assets/visualcontent/background_6.png')} style={styles.backgroundImage}>
      <MainContainer style={styles.mainContainer}>
        <Text style={styles.registerTitle}>Register</Text>
        <Text style={styles.stepTitle}>Step 5</Text>
        <View style={styles.formContainer}>
          <Picker selectedValue={roleUser} style={styles.picker} itemStyle={styles.pickerItem}  onValueChange={setRoleUser}>
            <Picker.Item label="Common" value="common" />
            <Picker.Item label="Business" value="Business" />
          </Picker>
          <Picker selectedValue={privacyUser ? "Private" : "Public"} style={styles.picker} itemStyle={styles.pickerItem} onValueChange={(itemValue) => {
              if (itemValue==="Private"){ setPrivacyUser(true); }
              else { setPrivacyUser(false)} }}>
            <Picker.Item label="Private" value="Private" />
            <Picker.Item label="Public" value="Public" />
          </Picker>
          <StyledTextInputs style={styles.textInput} placeholder="Description" value={descriptionUser} onChangeText={setDescriptionUser}/>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextBackButton} onPress={handleGoBack}>
            <MaterialCommunityIcons color="#000000" name="arrow-left" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBackButton} onPress={handleGoToScreenRegisterF}>
            <MaterialCommunityIcons color="#000000" name="arrow-right" size={24} />
          </TouchableOpacity>
        </View>
      </MainContainer>
    </ImageBackground>
  );
}
