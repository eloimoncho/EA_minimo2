import AsyncStorage from "@react-native-async-storage/async-storage";
export class AuthHeaderService{
    static async authHeader(){
        try{
        const tokenData=await AsyncStorage.getItem('token');
        if (tokenData) {
            const token = JSON.parse(tokenData);
            console.log("Estoy enseñando el token:"+token);
            console.log("Remix AAAAAAAAAAAAAAAAAA (parsed value):", JSON.parse(tokenData));
            return { Authorization: 'Bearer ' + token }; // for Spring Boot back-end
        }
        else(console.log("Token not found"));
    } catch (error: any) {
      console.error("Error al obtener el usuario actual:", error);
    }
}
}
