import axios from "axios";
import { AuthEntity, UserAuthEntity } from "../../../domain/user/user.entity";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://147.83.7.158:5432/";

export class SessionService {
  static getVoiceControl() {
      throw new Error("Method not implemented.");
  }
  static async login(auth: AuthEntity) {
    try {
      const response = await axios.post(API_URL + "user/loginfrontend", auth);
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  static async register(user: UserAuthEntity) {
    console.log(user);
    try {
      const response = await axios.post(API_URL + "user/register", user);
      console.log(response);
      console.log("Register Bien");
      return response;
    } catch (error) {
      console.error("Error during register:", error);
      throw error;
    }
  }

  
  static async getCurrentUser() {
    try {
      const userId = await AsyncStorage.getItem('uuid');
      console.log("AAAAAAAAAAAAAAAAAA (raw value):", userId);
  
      if (userId) {
        console.log("AAAAAAAAAAAAAAAAAA (parsed value):", JSON.parse(userId));
        return JSON.parse(userId);
      }
      else(console.log("UserId not found"));
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error);
    }
  }

  

  static setCurrentUser(userId: string, token: string) {
    try {
      console.log("Saving userId to AsyncStorage:", userId);
      AsyncStorage.setItem("uuid", userId);
      AsyncStorage.setItem("token", token);
    } catch (error) {
      console.error("Error saving userId to AsyncStorage:", error);
    }
  }
  

  static logOut() {
    try {
      AsyncStorage.removeItem("userId");
      AsyncStorage.removeItem("token");
    } catch (error) {}
  }

  static async getAudioDescription() {
    try {
      const AudioDescription = await AsyncStorage.getItem('voiceRecognitionEnabled');
  
      if (AudioDescription) {
        return AudioDescription;
      }
      else(console.log("UserId not found"));
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error);
    }
  }

  

  static setAudioDescription(isAudioDescription: string) {
    try {
      AsyncStorage.setItem("voiceRecognitionEnabled", isAudioDescription);
    } catch (error) {
      console.error("Error saving userId to AsyncStorage:", error);
    }
  }
}
