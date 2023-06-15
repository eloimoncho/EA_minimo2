import axios from "axios";
import { AuthHeaderService } from "./authHeaders.service";

const API_URL = "http://147.83.7.158:5432/user";

export class CRUDService{
    static async getUser(userId: string) {
        console.log(userId);
        const token=await AuthHeaderService.authHeader()
        if(token){
          try {
            console.log("Hola token")
            const response = await axios.get(API_URL + "/"+ userId,{ headers:  token});
            return response;
          } catch (error) {
            console.error("Error during register:", error);
            throw error;
          }
        }else(console.log("Token problemas"))
    } 
    static async editUser(user: any) {
      console.log(user.uuid);
      const token = await AuthHeaderService.authHeader();
      if (token) {
        try {
          console.log("Estamos en el editUser");
          
          const response = await axios.put(API_URL + "/" + user.uuid, user, {headers: token});
          console.log("Recibimos respuesta" + response);
          return response;
        } catch (error) {
          console.error("Error editing user: ", error);
          throw error;
        }
      }
    }

    static async searchUsers(searchQuery: string) {
      const token=await AuthHeaderService.authHeader()
      if(token){
        try {
          console.log("He entrado al servicio:" + searchQuery);
          const response = await axios.get(API_URL + "/search/" + searchQuery, { headers:  token});
          return response;
        } catch (error) {
          console.error("Error during register:", error);
          throw error;
        }
      }else(console.log("Problems with the Token"))
    }

    static async getUsers() {
      const token=await AuthHeaderService.authHeader()
      if(token){
        try {
          const response = await axios.get(API_URL + "/all/" + 1, { headers: token });
          return response;
        } catch (error) {
          console.error("Error during register:", error);
          throw error;
        }
      }else(console.log("Problems with the Token"))
    }


    static async isFollowed(uuid:string, uuidFollowed: string) {
      console.log(uuid, uuidFollowed);
      const token=await AuthHeaderService.authHeader()
      if(token){
        try {
          const response = await axios.get(API_URL + "/isFollower/" + uuid + "/" + uuidFollowed, { headers: token });
          return response;
        } catch (error) {
          console.error("Error when obtaining if follower:", error);
          throw error;
        }
      }
    }

     //OK
    static async addFollowed(uuid: string, uuidFollowed: string) {
      console.log(uuid, uuidFollowed);
      const token=await AuthHeaderService.authHeader()
      if(token){
        try {
          const response = await axios.post(API_URL + "/followed", {uuid: uuid, uuidFollowed: uuidFollowed}, { headers: token });
          return response;
        } catch (error) {
          console.error("Error adding followed:", error);
          throw error;
        }
      }
    }

    //OK
    static async removeFollowed(uuid: string, uuidFollowed: string) {
      console.log(uuid, uuidFollowed);
      const token=await AuthHeaderService.authHeader()
      if(token){
        try {
          const response = await axios.put(API_URL + "/followed/this", { uuid: uuid, uuidFollowed: uuidFollowed }, { headers: token}, );
          return response;
        } catch (error) { 
          console.error("Error removing followed:", error);
          throw error;
        }
      }
    }

    static async getFollowers(uuid: string | undefined, numPage: string) {
      const token=await AuthHeaderService.authHeader()
      try {
        const response = await axios.get(API_URL + "/follower/" + uuid + "/" + numPage, { headers: token });
        return response;
      } catch (error) {
        console.error("Error getting followers:", error);
        throw error;
      }
    }

    static async getFollowed(uuid: string | undefined, numPage: string) {
      const token=await AuthHeaderService.authHeader()
      try {
        const response = await axios.get(API_URL + "/followed/" + uuid + "/" + numPage, { headers: token });
        return response;
      } catch (error) {
        console.error("Error getting followed:", error);
        throw error;
      }
    }

    static async getPerson(userId: string) {
      const token=await AuthHeaderService.authHeader()
      try {
        const response = await axios.get(API_URL + "/" + userId, { headers: token });
        return response;
      } catch (error) {
        console.error("Error when obtaining person:", error);
        throw error;
      }
    }
    
}


/**
 * const getUser = async () => {
        const userId = await SessionService.getCurrentUser();
        console.log("BBBBBBBBBBBB:  "+userId);
        if (userId) {
          try {
            await CRUDService.getUser(userId)
            .then((response) => {
              console.log("Punto 1:"+response);
              console.log(response.data);
              setCurrentUser(response.data);
            })
          } catch (error) {
            console.log("Encontre el id pero no va")
          }
}
      };
 */
