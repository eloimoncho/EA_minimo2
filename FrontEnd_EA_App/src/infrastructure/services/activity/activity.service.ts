import axios from "axios";
import { AuthHeaderService } from "../user/authHeaders.service";
import { CommentEntity } from "../../../domain/comment/comment.entity";
import { ActivityEntity } from "../../../domain/activity/activity.entity";

const  API_URL = "http://147.83.7.158:5432/";

export class ActivityService {

  // Obtener una actividad por su ID.
  static async getActivityById(uuid: string){
    const token = await AuthHeaderService.authHeader();
    try{
        const response=await axios.get(API_URL + "activity/" + uuid,{headers:token});
        return response;
    } catch(error){
        console.error('Error obtaining an activity by its ID: '+error);
        throw error;
    }
  } 

  // Crear una actividad.
  static async createActivity(activity: ActivityEntity) {
    const token = await AuthHeaderService.authHeader();
    try {
      const response = await axios.post(API_URL + "activity/add", activity, { headers: token });
      console.log("try response " + response)
      return response;
    } catch (error) {
      console.error('Error during loading comments:', error);
      throw error;
    }
  }
  
  // Obtener mis actividades.
  static async getMySchedule(uuid: string, date: string) {
    const token = await AuthHeaderService.authHeader();
    try {
      const response = await axios.get(API_URL + "activity/myweek/" + uuid + "/" + date, { headers: token });
      console.log("try response " + response)
      return response;
    } catch (error) {
      console.error('Error during loading comments:', error);
      throw error;
    }
  }
  
  // Obtener las actividades de la gente a la que sigues. 
  static async getOtherSchedule(uuid: string, numPage:string, date: string) {
    const token = await AuthHeaderService.authHeader();
    try {
      const response = await axios.get(API_URL + "activity/following/" + uuid + "/" + numPage + "/" + date, { headers: token });
      console.log("try response " + response)
      return response;
    } catch (error) {
      console.error('Error during loading comments:', error);
      throw error;
    }
  }

  // Obtener las actividades de una localización.
  static async getActivitiesOfALocation(uuid: string){
    const token = await AuthHeaderService.authHeader();
    try{
        const response=await axios.get(API_URL + "activities/bylocation/" + uuid,{headers:token});
        return response;
    } catch(error){
        console.error('Error obtaining the activities of a location: '+error);
        throw error;
    }
  }

  // Obtener todas las actividades en las que participa un usuario durante la semana actual.
  static async obtainMyActivitiesOfTheWeek(uuid: string, date: string){
    const token = await AuthHeaderService.authHeader();
    try{
        const response=await axios.get(API_URL + "activity/myweek/" + uuid + "/" + date,{headers:token});
        return response;
    } catch(error){
        console.error('Error obtaining the activities I have this week: '+error);
        throw error;
    }
  }

  // Update activity.
  // routeActivity.put("/activity/:uuid",checkJwt,activityCtrl.updateActivityCtrl);
  static async updateActivity(uuid: string, updatedActivity: any) {
    const token = await AuthHeaderService.authHeader();
    try {
      const response = await axios.put(API_URL + "activity/" + uuid, updatedActivity, { headers: token });
      return response;
    } catch (error) {
      console.error('Error updating an activity.' + error);
      throw error;
    }
  }
}