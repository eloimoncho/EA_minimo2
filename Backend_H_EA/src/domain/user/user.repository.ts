import { AuthEntity, UserEntity,UserAuthEntity } from "./user.entity";

export interface UserRepository{
    getUserById(uuid:string):Promise<UserEntity|null>;
    getUserByEmail(email:string):Promise<UserEntity|null>;
    listUser():Promise<UserEntity[]|null>;
    updateUser(uuid:string,data:UserEntity):Promise<UserEntity|null>;
    registerUser(data:UserAuthEntity):Promise<UserAuthEntity|null|string>;
    loginUser(data:AuthEntity):Promise<string[2]|null>;
    loginFrontendUser(data:AuthEntity):Promise<String[2]|null>;
    loginFrontendGoogleUser(data:AuthEntity):Promise<String[2]|null>;
    deleteUser(uuid:string):Promise<UserEntity|null>;
    listUserPag(numPage:string):Promise<UserEntity[]|null>;
    getNumUsers():Promise<string|null>;
    getSearchUsers(search:string):Promise<UserEntity[]|null>;
    checkFollower(uuid:string, uuidFollowed:string):Promise<boolean|null>;

    listFollowersPag(uuid:string,numPage:string):Promise<UserEntity[]|null>;
    listFollowedPag(uuid:string,numPage:string):Promise<UserEntity[]|null>;
    insertFollower(uuid:string,uuidFollower:string):Promise<UserEntity[]|null>;
    insertFollowed(uuid:string,uuidFollowed:string):Promise<UserEntity[]|null>;
    deleteFollower(uuid:string,uuidFollower:string):Promise<UserEntity|null>;
    deleteFollowed(uuid:string,uuidFollowed:string):Promise<UserEntity|null>;
}
