import React, { useEffect, useState } from 'react';
import { ImageBackground, Image, View, StyleSheet, Text, Platform } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import NormalText from '../components/texts/NormalText';
import Color from '../constants/color/Color';
import Video from 'react-native-video';
import jwtDecode from 'jwt-decode';
import { DecodedToken } from '../../../domain/decodedToken';

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../assets/fonts/SFNS.otf'),
  });
}

export default function SplashScreen() {
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

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    footerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      marginBottom: 32,
    },
    image: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
    },
    text_normal: {
      color: 'white',
      fontSize: 20,
      marginBottom: 10,
    },
    titleText: {
      color: 'white',
      fontFamily: titleFont,
      fontSize: 38,
      marginTop: 20,
    },
    creditsText: {
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 18,
      marginTop: 14,
    },
    versionText: {
      color: '#66fcf1',
      fontFamily: bodyFont,
      fontSize: 18,
      marginBottom: 2,
    },
    footerText: {
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 14,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
  });

  useEffect(() => {
    setTimeout(() => {
        const checkToken = async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (token) {
                const decodedToken : DecodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Obtener la hora actual en segundos
                console.log("DECODED TOKEN: ", decodedToken);

                if (decodedToken.exp < currentTime) {
                  
                  // El token ha expirado, redirigir al usuario a la pantalla de inicio de sesión
                  navigation.navigate('LoginScreen' as never);
                } else {
                  // El token es válido, redirigir al usuario a la pantalla principal
                  console.log("El token es válido");
                  navigation.navigate('HomeScreen' as never, { screen: 'ProfileScreen' } as never);
                }
                
                // navigation.navigate('HomeScreen' as never, { screen: 'ProfileScreen' } as never);
              } else {
                navigation.navigate('LoginScreen' as never);
              }
            } catch (error) {
              console.log('Error al obtener el token:', error);
            }
          };
        checkToken();
    }, 3600);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_1.png')} style={styles.backgroundImage}>
      <View style={styles.mainContainer}>
        <View style={styles.mainContainer}>
            <Image source={require('../../../../assets/logo_lplan.png')} style={styles.image} />
            <Text style={styles.titleText}>Lplan</Text>
            <Text style={styles.creditsText}>2023</Text>
        </View>
        <View style={styles.footerContainer}>
            <Text style={styles.versionText}>Group 3</Text>
            <Text style={styles.footerText}>Eloi, Genís, Óscar, Victor, Marc</Text>
        </View>
      </View>
    </ImageBackground>
    
  );
}