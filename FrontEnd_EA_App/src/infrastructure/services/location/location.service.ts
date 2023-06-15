import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthHeaderService } from "../user/authHeaders.service";

const API_URL = "http://147.83.7.158:5432/location";

export class LocationService {
  static async getLocations() {
    const token = await AuthHeaderService.authHeader();
    if (token) {
      try {
        const response = await axios.get(
          "http://147.83.7.158:5432/locations/all",
          {
            headers: token,
          }
        );
        return response;
      } catch (error) {
        console.error("Error during locations:", error);
        throw error;
      }
    }
  }
  //OK
  static async searchLocations(searchQuery: string) {
    const token = await AuthHeaderService.authHeader();
    if (token) {
      try {
        console.log("He entrado al servicio:" + searchQuery);
        const response = await axios.get(API_URL + "/search/" + searchQuery, {
          headers: token,
        });
        return response;
      } catch (error) {
        console.error("Error during register:", error);
        throw error;
      }
    }
  }

  //OK
  static async getLocation(locationId: string) {
    const token = await AuthHeaderService.authHeader();
    if (token) {
      try {
        const response = await axios.get(API_URL + "/" + locationId, {
            headers: token,
        });
        return response;
      } catch (error) {
        console.error("Error when obtaining person:", error);
        throw error;
      }
    }
  }
}
