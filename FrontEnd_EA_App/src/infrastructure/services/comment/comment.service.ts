import axios from "axios";
import { AuthHeaderService } from "../user/authHeaders.service";
import { CommentEntity } from "../../../domain/comment/comment.entity";


const  API_URL = "http://147.83.7.158:5432/comment";

export class CommentService {
  
  //OBTENER LAS PUBLICACIONES DE LA GENTE QUE SIGUES
  static async getCommentsPublication(uuidPublication: string, numPage: string) {
    const token = await AuthHeaderService.authHeader();
    try {
      const response = await axios.get(API_URL + "/publication/by/paginated/" + uuidPublication + "/" + numPage, { headers: token });
      console.log("try response " + response)
      return response;
    } catch (error) {
      console.error('Error during loading comments:', error);
      throw error;
    }
  }

  //CREAR UN COMENTARIO
  static async createComment(comment: CommentEntity) {
    const token = await AuthHeaderService.authHeader();
    try {
      const response = await axios.post(API_URL + "/add", comment, { headers: token });
      console.log("try response " + response)
      return response;
    } catch (error) {
      console.error('Error during loading comments:', error);
      throw error;
    }
  }

}