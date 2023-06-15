import { Router } from "express";
import { UserUseCase } from "../../application/userUseCase";
import { UserController } from "../controller/user.ctrl";
import { MongoUserRepository } from "../repository/mongoUser.repository";
import { logMiddleware } from "../controller/login.ctrl";
import { checkJwt } from "../controller/session.ctrl";

const routeUser = Router();

const userRepo=new MongoUserRepository();
const userUseCase = new UserUseCase(userRepo)
const userCtrl = new UserController(userUseCase)

routeUser.get("/user/:uuid",checkJwt,userCtrl.getUserByIdCtrl);//ok
routeUser.get("/user/google/check/:mailUser",userCtrl.getUserByEmailCtrl),
routeUser.get("/users/all",checkJwt,userCtrl.listUserCtrl);//OK logMiddleware
routeUser.get("/user/all/:numPage",checkJwt,userCtrl.listUserPagCtrl);//ok
routeUser.get("/user/all/count/docs",checkJwt,userCtrl.getNumUsersCtrl);
routeUser.get("/user/search/:search",checkJwt,userCtrl.getSearchUsersCtrl); //ok
routeUser.get("/user/follower/:uuid/:numPage", checkJwt,userCtrl.listFollowersPagCtrl);//ok
routeUser.get("/user/followed/:uuid/:numPage",checkJwt, userCtrl.listFollowedPagCtrl);//ok
routeUser.get("/user/isFollower/:uuid/:uuidFollowed",checkJwt,userCtrl.checkFollowerCtrl);//ok

routeUser.put("/user/:uuid",checkJwt, userCtrl.updateUserCtrl);//ok
routeUser.put('/user/followed/this',checkJwt, userCtrl.deleteFollowedCtrl);

routeUser.post('/user/follower',checkJwt ,userCtrl.insertFollowerCtrl);//ok
routeUser.post('/user/followed',checkJwt, userCtrl.insertFollowedCtrl);//ok
routeUser.post('/user/register',userCtrl.registerUserCtrl);//ok
routeUser.post('/user/login',userCtrl.loginUserCtrl);//Ok
routeUser.post('/user/loginfrontend',userCtrl.loginFrontendUserCtrl);//Ok
routeUser.post('/user/loginfrontendgoogle',userCtrl.loginFrontendGoogleUserCtrl);

routeUser.delete("/user/:uuid",checkJwt,userCtrl.deleteUserCtrl);//ok
routeUser.delete('/user/follower/this',checkJwt, userCtrl.deleteFollowerCtrl);



export default routeUser;