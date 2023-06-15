import { UserRepository } from "../domain/user/user.repository";
import { UserValue,UserAuthValue, AuthValue } from "../domain/user/user.value";
import { NotFoundError } from "./notFoundError";

export class UserUseCase{
    constructor(private readonly userRepository:UserRepository){}

    public getUserById=async(uuid:string)=>{
        const user = await this.userRepository.getUserById(uuid);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return user;
    }
    public getUserByEmail=async(email:string)=>{
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        console.log(user)
        return user;
    }

    public listUser=async()=>{
        const listUser=await this.userRepository.listUser();
        if (!listUser) {
            throw new NotFoundError("List not found");
        }
        return listUser;
    }

    public updateUser=async(uuid:string,{appUser,nameUser,surnameUser,mailUser,photoUser,birthdateUser,genderUser,ocupationUser,descriptionUser,roleUser,privacyUser,deletedUser,followedUser,followersUser}:{appUser:string,nameUser:string,surnameUser:string,mailUser:string,photoUser:string,birthdateUser:Date,genderUser:"male" | "female",ocupationUser?: string,descriptionUser: string,roleUser: "admin" | "common" | "verified" | "business",privacyUser: boolean,deletedUser: boolean,followersUser?: [string],followedUser?: [string]})=>{
        const userValue:UserValue=new UserValue({uuid,appUser,nameUser,surnameUser,mailUser,photoUser,birthdateUser,genderUser,ocupationUser,descriptionUser,roleUser,privacyUser,deletedUser,followedUser,followersUser});
        console.log(userValue);
        const user=await this.userRepository.updateUser(uuid,userValue);
        console.log(user);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return user;
    }
    
    public registerUser=async({uuid,appUser,nameUser,surnameUser,mailUser,passwordUser,photoUser,birthdateUser,genderUser,ocupationUser,descriptionUser,roleUser,privacyUser,deletedUser,followedUser,followersUser}:{uuid:string,appUser:string,nameUser:string,surnameUser:string,mailUser:string,passwordUser:string,photoUser:string,birthdateUser:Date,genderUser:"male" | "female",ocupationUser?: string,descriptionUser: string,roleUser: "admin" | "common" | "verified" | "business",privacyUser: boolean,deletedUser: boolean,followersUser?: [string],followedUser?: [string]})=>{
        const userAuthValue=new UserAuthValue({uuid,appUser,nameUser,surnameUser,mailUser,passwordUser,photoUser,birthdateUser,genderUser,ocupationUser,descriptionUser,roleUser,privacyUser,deletedUser,followedUser,followersUser});
        const user=await this.userRepository.registerUser(userAuthValue);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return user;
    }

    public loginUser=async({mailUser,passwordUser}:{mailUser:string,passwordUser:string})=>{
        const userAuthValue=new AuthValue({mailUser,passwordUser});
        const loginUser=await this.userRepository.loginUser(userAuthValue);
        if (!loginUser) {
            throw new NotFoundError("User not found");
        }
        return loginUser;
    }

    public loginFrontendUser=async({mailUser,passwordUser}:{mailUser:string,passwordUser:string})=>{
        const userAuthValue=new AuthValue({mailUser,passwordUser});
        const loginUser=await this.userRepository.loginFrontendUser(userAuthValue);
        if (!loginUser) {
            throw new NotFoundError("User not found");
        }
        return loginUser;
    }

    public loginFrontendGoogleUser=async({mailUser,passwordUser}:{mailUser:string,passwordUser:string})=>{
        const userAuthValue=new AuthValue({mailUser,passwordUser});
        console.log("El userAuthValue es: mailUser:"+mailUser)
        const loginUser=await this.userRepository.loginFrontendGoogleUser(userAuthValue);
        console.log("Respuesta loginUser: "+ loginUser)
        if (!loginUser) {
            throw new NotFoundError("User not found");
        }
        return loginUser;
    }

    public deleteUser=async(uuid:string)=>{
        const user=await this.userRepository.deleteUser(uuid);
        return user;
    }

    public listUserPag=async(numPage:string)=>{
        const listUser=await this.userRepository.listUserPag(numPage);
        return listUser;
    }

    public getNumUsers=async()=>{
        const numUsers=await this.userRepository.getNumUsers();
        return numUsers;
    }

    public getSearchUsers=async(search:string)=>{
        const discovery=await this.userRepository.getSearchUsers(search);
        return discovery;
    }

    public listFollowersPag=async(uuid:string,numPage:string)=>{
        const listUser=await this.userRepository.listFollowersPag(uuid,numPage);
        return listUser;
    }

    public listFollowedPag=async(uuid:string,numPage:string)=>{
        const listUser=await this.userRepository.listFollowedPag(uuid,numPage);
        return listUser;
    }

    public checkFollower=async(uuid:string,uuidFollowed:string)=>{
        const check=await this.userRepository.checkFollower(uuid,uuidFollowed);
        console.log("Use case. True o false: "+ check);
        return check;
    }

    public insertFollower=async(uuid:string,uuidFollower:string)=>{
        const follower=await this.userRepository.insertFollower(uuid,uuidFollower);
        return follower;
    }

    public insertFollowed=async(uuid:string,uuidFollowed:string)=>{
        const followed=await this.userRepository.insertFollowed(uuid,uuidFollowed);
        return followed;
    }

    public deleteFollower=async(uuid:string,uuidFollower:string)=>{
        const follower=await this.userRepository.deleteFollower(uuid,uuidFollower);
        return follower;
    }
    
    public deleteFollowed=async(uuid:string,uuidFollowed:string)=>{
        const followed=await this.userRepository.deleteFollowed(uuid,uuidFollowed);
        console.log("UseCase:" + followed);
        return followed;
    }
}