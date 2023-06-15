import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, View, Text, Button, TouchableOpacity, Platform, ImageBackground } from "react-native";
import MainContainer from "../../components/containers/Main";
import React from "react";
import SubTitle from "../../components/texts/Subtitle";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";
import ButtonGradientNext from "../../components/buttons/Button_Type_Next";
import ButtonGradientBack from "../../components/buttons/Button_Type_2";
import { StyleSheet } from "react-native";
import ButtonGradientShowPassword from "../../components/buttons/Button_Type_Show_Password";
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
}

export default function ScreenRegisterB() {
  const route = useRoute();
  const { appUser, nameUser, surnameUser }: RouteParams = route.params || {};
  const [mailUser, setMail] = useState("");
  const [passwordUser, setPasswordUser] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

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

  const handleGoToScreenRegisterC = () => {
    if (!mailUser || !passwordUser || !confirmation) {
      Alert.alert("Warning", "Complete all the field to continue!");
    } else if (passwordUser !== confirmation) {
      Alert.alert("Password", "Passwords do not match");
    } else if (!isValidEmail(mailUser)) {
      Alert.alert("Email", "Please enter a valid email address");
    } else if (passwordStrength === "weak") {
      Alert.alert("Password", "Your password is weak. Please choose a stronger password");
    } else {
      console.log(appUser);
      console.log(nameUser);
      console.log(surnameUser);
      console.log(mailUser);
      console.log(passwordUser);

      navigation.navigate("ScreenRegisterC" as never, {
        appUser,
        nameUser,
        surnameUser,
        mailUser,
        passwordUser,
      } as never);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePasswordChange = (value: string) => {
    setPasswordUser(value);

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChars = /[~¡@#$%^*()_\-+={}\[\]|:;",.¿]/.test(value);
    const hasMinimumLength = value.length >= 8;

    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChars && hasMinimumLength) {
      setPasswordStrength("strong");
    } else if (
      (hasUpperCase && hasLowerCase && hasNumber && hasMinimumLength) ||
      (hasUpperCase && hasLowerCase && hasSpecialChars && hasMinimumLength) ||
      (hasUpperCase && hasNumber && hasSpecialChars && hasMinimumLength) ||
      (hasLowerCase && hasNumber && hasSpecialChars && hasMinimumLength)
    ) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("weak");
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    requiredText: {
      color: 'yellow',
      marginTop: 10,
      fontFamily: bodyFont,
    },
    passwordStrengthContainer: {
      height: 10,
      backgroundColor: "#EEE",
      borderRadius: 5,
      marginTop: 10,
    },
    passwordStrengthBar: {
      height: 10,
      borderRadius: 5,
    },
    textInput: {
      width: 250,
    },
    showPasswordButton: {
      marginTop: 10,
      padding: 0,
      backgroundColor: "transparent",
      borderRadius: 20,
      width: 140,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      alignContent: "center",
      alignItems: 'center',
    },
    showPasswordButtonText: {
      color: "#66fcf1",
      fontFamily: bodyFont,
      fontSize: 18,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    mainContainer: {
      backgroundColor: 'transparent',
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
  });

  return (
    <ImageBackground source={require('../../../../../assets/visualcontent/background_6.png')} style={styles.backgroundImage}>
      <MainContainer style={styles.mainContainer}>
        <Text style={styles.registerTitle}>Register</Text>
        <Text style={styles.stepTitle}>Step 2</Text>
        <View>
          <StyledTextInputs style={styles.input} placeholder="Email *" value={mailUser} onChangeText={(value: React.SetStateAction<string>) => setMail(value)}/>
          <StyledTextInputs style={styles.input} placeholder="Password *" value={passwordUser} onChangeText={handlePasswordChange} secureTextEntry={!showPassword}/>
          <View style={styles.passwordStrengthContainer}>
            <View style={[ styles.passwordStrengthBar, { backgroundColor: getPasswordStrengthColor(passwordStrength) }, ]}/>
          </View>
          <StyledTextInputs style={styles.input} placeholder="Repeat Password *" value={confirmation} onChangeText={(value: React.SetStateAction<string>) => setConfirmation(value)} secureTextEntry={!showPassword} />
          <View style={styles.showPasswordButton}>
            <TouchableOpacity onPress={toggleShowPassword}>
              <Text style={styles.showPasswordButtonText}> {showPassword ? "Hide Password" : "Show Password"} </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.requiredText}>* Mandatory Fields</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextBackButton} onPress={handleGoBack}>
            <MaterialCommunityIcons color="#000000" name="arrow-left" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBackButton} onPress={handleGoToScreenRegisterC}>
            <MaterialCommunityIcons color="#000000" name="arrow-right" size={24} />
          </TouchableOpacity>
        </View>
      </MainContainer>
    </ImageBackground>
  );
}

function getPasswordStrengthColor(strength: string) {
  switch (strength) {
    case "strong":
      return "red";
    case "medium":
      return "yellow";
    case "weak":
      return "green";
    default:
      return "#EEE";
  }
}
