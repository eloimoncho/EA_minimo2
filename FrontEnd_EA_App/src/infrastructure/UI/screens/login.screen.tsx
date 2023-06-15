import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Svg, { Defs, Path, Pattern, Use } from "react-native-svg";
import MainContainer from "../components/containers/Main";
import Title from "../components/texts/Title";
import SubTitle from "../components/texts/Subtitle";
import StyledTextInputs from "../components/inputs/StyledTextInputs";
import Button_Type_1 from "../components/buttons/Button_Type_1";
import { AuthEntity } from "../../../domain/user/user.entity";
import { SessionService } from "../../services/user/session.service";
import NormalText from "../components/texts/NormalText";
import { Platform, StatusBar, TouchableOpacity, StyleSheet, ImageBackground, Image, View, Text} from "react-native";
import Register from "../components/texts/Register";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import '../../../../assets/fonts/Rafaella.ttf';

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../assets/fonts/SFNS.otf'),
  });
}

export default function LoginScreen() {
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

  const navigation = useNavigation();

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const styles = StyleSheet.create({
    titleText: {
      color: 'white',
      fontFamily: titleFont,
      fontSize: 80,
      marginBottom: 10,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 0,
    },
    formContainer: {
      flex: 1,
      alignItems: 'center',
      marginBottom: 0,
      marginTop:-260,
    },
    image: {
      width: 30,
      height: 30,
      resizeMode: 'cover',
    },
    iconText: {
      color: 'white',
      fontFamily: titleFont,
      fontSize: 44,
      marginTop: 10,
    },
    xText: {
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 24,
      marginBottom: 4,
      marginLeft: 6,
      marginRight: 6,
    },
    input: {
      width: 300,
      height: 40,
    },
    normalText: {
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 18,
      marginTop: 38,
      marginBottom: -2,
    },
    bottomText: {
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 18,
      marginTop: 44,
      marginBottom: -4,
    },
    signUpText: {
      color: '#66fcf1',
      fontFamily: bodyFont,
      fontSize: 28,
      marginTop: 6,
      marginBottom: 0
    },
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_3.png')} style={styles.backgroundImage}>
      <View style={styles.mainContainer}>
        <View style={styles.iconContainer}>
          <Image source={require('../../../../assets/logo_lplan.png')} style={styles.image} />
          <Title style={styles.xText}>x</Title>
          <Title style={styles.iconText}>Lplan</Title>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.normalText}>Let's Go!</Text>
          <StyledTextInputs style={styles.input} placeholder="Mail" value={inputEmail} onChangeText={setInputEmail}/>
          <StyledTextInputs style={styles.input} placeholder="Password" value={inputPassword} onChangeText={setInputPassword} secureTextEntry={true}/>
          <Button_Type_1 onPress={() => { const formData: AuthEntity = { mailUser: inputEmail, passwordUser: inputPassword, };
              SessionService.login(formData)
                .then((response) => {
                  console.log(response);
                  if (response.status === 200) {
                    console.log(response.data);
                    SessionService.setCurrentUser(
                      JSON.stringify(response.data.user.uuid),
                      JSON.stringify(response.data.token)
                    );
                    console.log("_id" + JSON.stringify(response.data.user.uuid));
                    console.log("token" + JSON.stringify(response.data.token));
                    console.log("Login Succesfull!");
                    navigation.navigate('HomeScreen' as never, { screen: 'FeedScreen' } as never);
                  }
                })
                .catch((error) => {
                  console.error("error: " + error);
                  console.log("error.response: " + error.response);
                  switch (error.response.status) {
                    case 403:
                      // Poner aquí el alert ...
                      console.log("Incorrect Password");

                      break;
                    case 404:
                      // Poner aquí el alert ...
                      console.log("User does not exist");
                      navigation.navigate("Register" as never);
                      break;
                  }
                });
            }} />
          <Text style={styles.bottomText}>Aren't you still an @lplan member?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register" as never)}> 
            <Text style={styles.signUpText}>Sign Up!</Text> 
          </TouchableOpacity>
          <StatusBar/>
        </View>      
      </View>
    </ImageBackground>

  );
}

/*
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Button, View, Text, Linking } from "react-native";
import { Platform, StyleSheet, StyleSheet } from "react-native";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();
import * as Font from 'expo-font';

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
  });
}

export default function LoginScreen() {
  const navigation = useNavigation();

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const styles = StyleSheet.create({
    text_normal: {
      color: 'white',
      fontFamily: customFont,
      fontSize: 20,
      marginBottom: 10,
    },
  });

  return (
    <View style={styles.container}>
      {userInfo === null ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        <Text style={styles.text}>{userInfo.name}</Text>
      )}
      
    </View>
    <MainContainer>
      <Title style={styles.text_normal}>Lplan</Title>
      <SubTitle>Let's Go!</SubTitle>
      <StyledTextInputs
        placeholder="mail"
        value={inputEmail}
        onChangeText={setInputEmail}
      />
      <StyledTextInputs
        placeholder="Password"
        value={inputPassword}
        onChangeText={setInputPassword}
        secureTextEntry={true}
      />
      <ButtonGradient
        onPress={() => {
          const formData: AuthEntity = {
            mailUser: inputEmail,
            passwordUser: inputPassword,
          };

          console.log("formData " + formData.mailUser);
          console.log("formData " + formData.passwordUser);
          SessionService.login(formData)
            .then((response) => {
              console.log(response);
              if (response.status === 200) {
                console.log(response.data);
                SessionService.setCurrentUser(
                  JSON.stringify(response.data.user.uuid),
                  JSON.stringify(response.data.token)
                );
                console.log("_id" + JSON.stringify(response.data.user.uuid));
                console.log("token" + JSON.stringify(response.data.token));
                console.log("Login Succesfull!");

                navigation.navigate('HomeScreen' as never);
              }
            })
            .catch((error) => {
              console.error("error: " + error);
              console.log("error.response: " + error.response);
              switch (error.response.status) {
                case 403:
                  // Poner aquí el alert ...
                  console.log("Incorrect Password");

                  break;
                case 404:
                  // Poner aquí el alert ...
                  console.log("User does not exist");
                  navigation.navigate("Register" as never);
                  break;
              }
            });
        }}
      />
      <NormalText>Aren't you still an @lplan member?</NormalText>
      <TouchableOpacity
        onPress={() => navigation.navigate("Register" as never)}
      >
        <Register>Sign Up!</Register>
      </TouchableOpacity>
      <StatusBar />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

*/