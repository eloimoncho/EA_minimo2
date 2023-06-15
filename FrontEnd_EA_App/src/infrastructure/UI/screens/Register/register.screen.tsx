import React, { useEffect, useState } from "react";
import { Button, TextInput, Text, Alert, View, Platform, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MainContainer from "../../components/containers/Main";
import SubTitle from "../../components/texts/Subtitle";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";
import ButtonGradientNext from "../../components/buttons/Button_Type_Next";
import ButtonGradientBack from "../../components/buttons/Button_Type_2";
import { StyleSheet } from "react-native";
import * as Font from 'expo-font';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../../assets/fonts/SFNS.otf'),
  });
}

export default function ScreenRegisterA() {
  const [appUser, setAppUser] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [surnameUser, setSurnameUser] = useState("");
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

  const handleGoToScreenRegisterB = () => {
    if (!appUser || !nameUser || !surnameUser) {
      Alert.alert("Warning", "Complete all the field to continue!");
    } else {
      navigation.navigate("ScreenRegisterB" as never, {
        appUser,
        nameUser,
        surnameUser,
        
      }as never);
    }
  };

  const handleGoBack = () => {
    navigation.navigate("LoginScreen" as never);
  };

  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    requiredText: {
      color: 'yellow',
      marginTop: 10,
      fontFamily: bodyFont,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    mainContainer: {
      backgroundColor: 'transparent',
    },
    input: {
      width: 300,
      height: 40,
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
    nextBackButtonText: {
      fontFamily: bodyFont,
      fontSize: 16,
      color: '#000',
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
  });

  return (
    <ImageBackground source={require('../../../../../assets/visualcontent/background_6.png')} style={styles.backgroundImage}>
      <MainContainer style={styles.mainContainer}>
        <Text style={styles.registerTitle}>Register</Text>
        <Text style={styles.stepTitle}>Step 1</Text>
        <StyledTextInputs style={styles.input} placeholder="Username *" value={appUser} onChangeText={(value: React.SetStateAction<string>) => setAppUser(value) } /*keyboardType="numeric"*//>
        <StyledTextInputs style={styles.input} placeholder="Name *" value={nameUser} onChangeText={(value: React.SetStateAction<string>) => setNameUser(value) }/>
        <StyledTextInputs style={styles.input} placeholder="Surname *" value={surnameUser} onChangeText={(value: React.SetStateAction<string>) => setSurnameUser(value) }/>
        <Text style={styles.requiredText}>* Mandatory Fields</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextBackButton} onPress={handleGoBack}>
            <MaterialCommunityIcons color="#000000" name="arrow-left" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBackButton} onPress={handleGoToScreenRegisterB}>
            <MaterialCommunityIcons color="#000000" name="arrow-right" size={24} />
          </TouchableOpacity>
        </View>
      </MainContainer>
    </ImageBackground>

  );
}

