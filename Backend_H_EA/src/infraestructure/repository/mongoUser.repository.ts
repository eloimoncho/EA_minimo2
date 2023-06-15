import { Types } from "mongoose";
import { AuthEntity, UserAuthEntity, UserEntity } from "../../domain/user/user.entity";
import { UserRepository } from "../../domain/user/user.repository";
import UserModel from "../model/user.schema";
import {encrypt,verified} from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";

export class MongoUserRepository implements UserRepository{

    async getUserById(uuid: string): Promise<any> {
        console.log(uuid);
        const response = await UserModel.findOne({_id:uuid});
        console.log(response);
        return response;
    }

    async getUserByEmail(mailUser: string): Promise<any> {
        console.log(mailUser);
        const response = await UserModel.findOne({mailUser:mailUser});
        if (!response) {return 'NOT_FOUND_USER';}
        console.log(response);
        return response;
    }

    async listUser(): Promise<any> {
        const response = await UserModel.find();
        console.log(response);
        return response;
    }

    async updateUser(uuid:string,data:UserEntity):Promise<any>{
        const response=await UserModel.findOneAndUpdate({_id:uuid},data,{new:true});
        console.log(response);
        return response;
    }

    async registerUser(data: UserAuthEntity): Promise<any> {
        console.log("Estoy en mongo")
        const {uuid,appUser,nameUser,surnameUser,mailUser,passwordUser,photoUser,birthdateUser,genderUser,ocupationUser,descriptionUser,roleUser,privacyUser,deletedUser,followedUser,followersUser}=data;
        const checkIs = await UserModel.findOne({ mailUser });
        console.log("Dentro del register, el mail que cojo es: "+ mailUser)
        if (checkIs) return "ALREADY_USER";
        const passHash = await encrypt(passwordUser);
        const encryptedData= {uuid,appUser,nameUser,surnameUser,mailUser,passwordUser:passHash,photoUser,birthdateUser,genderUser,ocupationUser,descriptionUser,roleUser,privacyUser,deletedUser,followedUser,followersUser};
        console.log(encryptedData);
        const user = await UserModel.create(encryptedData);
        console.log("register user " + user);
        const encryptedUpdate= {uuid:user._id,appUser,nameUser,surnameUser,mailUser,passwordUser:passHash,photoUser,birthdateUser,genderUser,ocupationUser,descriptionUser,roleUser,privacyUser,deletedUser,followedUser,followersUser};
        const response=await UserModel.findOneAndUpdate({_id:encryptedUpdate.uuid},encryptedUpdate,{new:true});
        console.log("Update user " + response);
        console.log("AtraveseMongo");
        
        return response;
    }

    async loginUser(data:AuthEntity):Promise<any>{
        const{mailUser,passwordUser}=data;
        const checkIs=await UserModel.findOne({mailUser:mailUser});

        if (!checkIs) return 'NOT_FOUND_USER';


        const passwordHash = checkIs.passwordUser; 
        const isCorrect = await verified(passwordUser, passwordHash);
        if (!isCorrect) return "PASSWORD_INCORRECT";

        if (checkIs.roleUser!=='admin') return 'USER_NOT_ADMIN';

        const token = generateToken(checkIs.mailUser, checkIs.roleUser);
        const item = {token, user: checkIs};
        return item;
    };

    async loginFrontendUser(data:AuthEntity):Promise<any>{
        const{mailUser,passwordUser}=data;
        const checkIs=await UserModel.findOne({mailUser:mailUser});

        if (!checkIs) return 'NOT_FOUND_USER';


        const passwordHash = checkIs.passwordUser; 
        const isCorrect = await verified(passwordUser, passwordHash);
        if (!isCorrect) return "PASSWORD_INCORRECT";

        const token = generateToken(checkIs.mailUser, checkIs.roleUser);
        const item = {token, user: checkIs};
        return item;
    };

    async loginFrontendGoogleUser(data:AuthEntity):Promise<any>{
        const{mailUser,passwordUser}=data;
        console.log("Mail del user: " + mailUser)
        const checkIs=await UserModel.findOne({mailUser:mailUser});
        console.log("Repository response: " + checkIs)
        if (!checkIs) return 'NOT_FOUND_USER';
        //const passwordHash = checkIs.passwordUser;
        //const isCorrect = await verified(passwordUser, passwordHash);
        //if (!isCorrect) return "PASSWORD_INCORRECT";
        const token = generateToken(checkIs.mailUser, checkIs.roleUser);
        const item = {token, user: checkIs};
        return item;
    };
    

    async deleteUser(uuid:string):Promise<any>{
        const response = await UserModel.findOneAndRemove({_id:uuid});
        return response;
    }

    async listUserPag(numPage:string):Promise<any>{
        const items = 2;
        const hop = (parseInt(numPage,10) - 1) * items;
        const response = await UserModel.find({}).skip(hop).limit(items).exec();
        return response;
    }

    async getNumUsers():Promise<any>{
        const response = (await UserModel.countDocuments({})).toString();
        return response;
    }

    async getSearchUsers(search:string):Promise<any>{
        const responseUser = await UserModel.findOne({ appUser: search });
  
        const regex = new RegExp(`^${search}`, 'i');
        const responseItem = await UserModel.find({ appUser: regex }).limit(10);

        if(responseUser){
            return [responseUser, ...responseItem.slice(0, 9)];
        }else{
            return responseItem;
        }
    }

    async listFollowersPag(uuid:string,numPage:string):Promise<any>{
        const items = 2;
        const hop = (parseInt(numPage) - 1) * items;
        const follower=await UserModel.findById(uuid);
        if(!uuid){
            throw new Error(`User with ID ${uuid} not found`);
        }
        const userFollowers = follower?.followersUser;
        if(!userFollowers || userFollowers.length ===0){
            return [];
        }
        const responseItem = await UserModel.find({_id: { $in: userFollowers }}).skip(hop).limit(items).exec();
        return responseItem;
    }

    async listFollowedPag(uuid:string,numPage:string):Promise<any>{
        const items = 2;
        const hop = (parseInt(numPage) - 1) * items;
        const followed=await UserModel.findById(uuid);
        if(!uuid){
            throw new Error(`User with ID ${uuid} not found`);
        }
        const userFollowed = followed?.followedUser;
        if(!userFollowed || userFollowed.length ===0){
            return [];
        }
        const responseItem = await UserModel.find({_id: { $in: userFollowed }}).skip(hop).limit(items).exec();
        return responseItem;
    }

    async checkFollower(uuid:string, uuidFollowed:string):Promise<any>{
        
        const user = await UserModel.findOne({_id: uuid, followedUser: { $in: [uuidFollowed] }});
        console.log("Estoy en mongoUser repository: " + user);
        if (!user) {
        return false;
        }
    
        return true;
    }

    async insertFollower(uuid:string,uuidFollower:string):Promise<any>{

        const responseItem=await UserModel.findOneAndUpdate(
            {_id:uuid},
            {$addToSet:{followersUser:new Types.ObjectId(uuidFollower)}},
            {new:true}
          ).populate('followersUser');
          const item=await UserModel.findOneAndUpdate(
            {_id:uuidFollower},
            {$addToSet:{followedUser:new Types.ObjectId(uuid)}},
            {new:true}
          )
          console.log(responseItem);
          return responseItem;
    }

    async insertFollowed(uuid:string,uuidFollowed:string):Promise<any>{
        const responseItem=await UserModel.findOneAndUpdate(
            {_id:uuid},
            {$addToSet:{followedUser:new Types.ObjectId(uuidFollowed)}},
            {new:true}
          ).populate('followedUser');
          const item=await UserModel.findOneAndUpdate(
            {_id:uuidFollowed},
            {$addToSet:{followersUser:new Types.ObjectId(uuid)}},
            {new:true}
          )
          console.log(responseItem);
          return responseItem;
    }

    async deleteFollower(uuid:string,uuidFollower:string):Promise<any>{
        console.log("removeFOllower!!!");
        const responseItem = await UserModel.findOneAndUpdate(
            {_id: uuid},
            {$pull: {followersUser: new Types.ObjectId(uuidFollower)}},
            {new: true}
        ).then((data)=>console.log("resposta:",data));
        /* console.log(responseItem);
        if (!responseItem) {
            throw new Error('User not found');
        }*/
        
        return responseItem;
    }

    async deleteFollowed(uuid:string,uuidFollowed:string):Promise<any>{
        console.log("Entramos al servicio");
        console.log(uuidFollowed);
        const responseItem = await UserModel.findOneAndUpdate(
            {_id: uuid},
            {$pull: {followedUser: new Types.ObjectId(uuidFollowed)}},
            {new: true}
          ).populate('followedUser');
          if (!responseItem) {
            throw new Error('User not found');
          }
        const item = await UserModel.findOneAndUpdate(
            {_id: uuidFollowed},
            {$pull: {followersUser: new Types.ObjectId(uuid)}},
            {new: true}
            )
            if (!item) {
                throw new Error('User not found');
            }
        console.log("Respuesta del que pierde un follower:" + item);
        return responseItem;
    }
}