import { uploadUser } from './multer/userMulter.ctrl';
import { UserUseCase } from "../../application/userUseCase";
import { Request,Response } from "express";
import { EmailService,NodemailerEmailService } from "../emailSender/emailSender";
import { UserAuthEntity, UserEntity } from "../../domain/user/user.entity";
import { cloudinary } from "../utils/cloduinary.handle";
import { UserAuthValue, UserValue } from "../../domain/user/user.value";
import { isImageFile } from "../utils/isImage.handle";


export class UserController{
    emailService: EmailService;
    constructor(private userUseCase:UserUseCase){
        this.emailService=new NodemailerEmailService();
        this.getUserByIdCtrl = this.getUserByIdCtrl.bind(this);
        this.getUserByEmailCtrl= this.getUserByEmailCtrl.bind(this);
        this.listUserCtrl=this.listUserCtrl.bind(this);
        this.updateUserCtrl=this.updateUserCtrl.bind(this);
        this.registerUserCtrl=this.registerUserCtrl.bind(this);
        this.loginUserCtrl=this.loginUserCtrl.bind(this);
        this.loginFrontendUserCtrl=this.loginFrontendUserCtrl.bind(this);
        this.loginFrontendGoogleUserCtrl=this.loginFrontendGoogleUserCtrl.bind(this);
        this.deleteUserCtrl=this.deleteUserCtrl.bind(this);
        this.listUserPagCtrl=this.listUserPagCtrl.bind(this);
        this.getNumUsersCtrl=this.getNumUsersCtrl.bind(this);
        this.getSearchUsersCtrl=this.getSearchUsersCtrl.bind(this);
        this.checkFollowerCtrl=this.checkFollowerCtrl.bind(this);

        this.listFollowersPagCtrl=this.listFollowersPagCtrl.bind(this);
        this.listFollowedPagCtrl=this.listFollowedPagCtrl.bind(this);
        this.insertFollowerCtrl=this.insertFollowerCtrl.bind(this);
        this.insertFollowedCtrl=this.insertFollowedCtrl.bind(this);
        this.deleteFollowerCtrl=this.deleteFollowerCtrl.bind(this);
        this.deleteFollowedCtrl=this.deleteFollowedCtrl.bind(this);
    }

    public async getUserByIdCtrl({params}:Request,res:Response){
        const { uuid = '' } = params;
        console.log(params);
        const response=await this.userUseCase.getUserById(`${uuid}`);
        res.send(response)
    }

    public async getUserByEmailCtrl({params}:Request,res:Response){
        const { mailUser = '' } = params;
        console.log(params);
        const response=await this.userUseCase.getUserByEmail(`${mailUser}`);
        res.send(response)
    }

    public async listUserCtrl(req:Request,res:Response){
        const response=await this.userUseCase.listUser();
        console.log(response);
        res.send(response);
    }

    public async updateUserCtrl(req:Request,res:Response){
        const{uuid,appUser,nameUser,surnameUser,mailUser,birthdateUser,genderUser,ocupationUser,descriptionUser,roleUser,privacyUser,deletedUser,followedUser,followersUser}=req.body;
        try{
            if(req.file){
                if(isImageFile(req.file)){
                    console.log("FILE_YES");
                    const userA=await this.userUseCase.getUserById(uuid);
                    const uploadResUp = await cloudinary.uploader.upload(req.file.path, {
                        upload_preset: "photoUser",
                    });
                    const delUp=await cloudinary.uploader.destroy(userA.photoUser);
                    if(uploadResUp){
                        const user=new UserValue({
                            uuid: uuid,
                            appUser: appUser,
                            nameUser: nameUser,
                            surnameUser: surnameUser,
                            mailUser: mailUser,
                            photoUser: uploadResUp.secure_url,
                            birthdateUser: birthdateUser,
                            genderUser: genderUser,
                            ocupationUser: ocupationUser,
                            descriptionUser: descriptionUser,
                            roleUser: roleUser,
                            privacyUser: privacyUser,
                            deletedUser: deletedUser,
                            followersUser: followersUser,
                            followedUser: followedUser,
                        })
                        console.log('Hey');
                        const response=await this.userUseCase.updateUser(uuid,user);
                        console.log(response);
                        res.send(response);
                        console.log(response);
                    }
                }
                else{res.send("NOT_SENDING_IMAGE")}
            }
            else{
                console.log('How');
                const response=await this.userUseCase.updateUser(uuid,req.body);
                console.log(response);
                res.send(response);
            }
        }
            catch(error){}
    }

    public async registerUserCtrl(req:Request,res:Response){

        const{uuid,appUser,nameUser,surnameUser,mailUser,passwordUser,birthdateUser,genderUser,ocupationUser,descriptionUser,roleUser,privacyUser,deletedUser,followedUser,followersUser}=req.body;
        try{
            if(req.file){
                if(isImageFile(req.file)){
                    console.log("FILE_YES");
                    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
                        upload_preset: "photoUser",
                    });

                    if(uploadRes){
                        const user=new UserAuthValue({
                            uuid: uuid,
                            appUser: appUser,
                            nameUser: nameUser,
                            surnameUser: surnameUser,
                            mailUser: mailUser,
                            passwordUser: passwordUser,
                            photoUser: uploadRes.secure_url,
                            birthdateUser: birthdateUser,
                            genderUser: genderUser,
                            ocupationUser: ocupationUser,
                            descriptionUser: descriptionUser,
                            roleUser: roleUser,
                            privacyUser: privacyUser,
                            deletedUser: deletedUser,
                            followersUser: followersUser,
                            followedUser: followedUser,
                        })
                        console.log("Hey");
                        const response = await this.userUseCase.registerUser(user);
                        console.log(response);
                        res.send(response);
                        console.log(response);
                        
                    }
                }
                else{res.send("NOT_SENDING_AN_IMAGE")}
            }
            else{
                console.log("How")
                const responseUser = await this.userUseCase.registerUser(req.body);
                if (responseUser === "ALREADY_USER") {
                    res.status(403);
                    res.send(responseUser);
                    console.log(res.status);
                }
                else {res.send(responseUser);}
            }
        }catch(error){}

        //const user = response as UserAuthEntity;

        /*const sender = 'grupo3ea.eetac@gmail.com';
        const recipient = user.mailUser;
        const subject = 'Bienvenido a mi aplicación';
        const skelleton = 'Hola ' + user.nameUser + ',\n\nBienvenido a mi aplicación. ¡Gracias por registrarte!';

        try {
        await this.emailService.sendEmail(sender, recipient, subject, skelleton);
        console.log('Correo electrónico enviado a ' + recipient);
        } catch (err) {
        console.error('Error al enviar el correo electrónico', err);
        }*/

        //res.send(response);

    }

    public async loginUserCtrl({ body }: Request, res: Response){
        const responseUser=await this.userUseCase.loginUser(body);
        
        if (responseUser === "PASSWORD_INCORRECT") {
            res.status(403);
            res.send(responseUser);
            console.log(res.status);
        } else if (responseUser === "USER_NOT_ADMIN") {
            res.status(406);
            res.send(responseUser);
        } else if (responseUser === "NOT_FOUND_USER") {
            res.status(404);
            res.send(responseUser);
            console.log("not found user " + res.status);
        } else {
            res.send(responseUser);
        }
    }

    public async loginFrontendUserCtrl({ body }: Request, res: Response){
        const responseUser=await this.userUseCase.loginFrontendUser(body);
        
        if (responseUser === "PASSWORD_INCORRECT") {
            res.status(403);
            res.send(responseUser);
            console.log(res.status);
        } else if (responseUser === "NOT_FOUND_USER") {
            res.status(404);
            res.send(responseUser);
            console.log("not found user " + res.status);
        } else {
            res.send(responseUser);
        }
    }

    public async loginFrontendGoogleUserCtrl({ body }: Request, res: Response){
        const responseUser=await this.userUseCase.loginFrontendGoogleUser(body);  
        console.log("Respuesta del login: " + responseUser)  
        if (responseUser === "NOT_FOUND_USER") {
            res.status(404);
            res.send(responseUser);
            console.log("not found user " + res.status);
        } else {
            res.send(responseUser);
        }
    }

    public async deleteUserCtrl({params}:Request,res:Response){
        const { uuid = '' } = params;
        const response=await this.userUseCase.deleteUser(`${uuid}`);
        res.send(response);
    }

    public async listUserPagCtrl({params}:Request,res:Response){
        const {numPage=''}=params;
        const response=await this.userUseCase.listUserPag(`${numPage}`);
        res.send(response);
    }

    public async getNumUsersCtrl(req:Request,res:Response){
        const response=await this.userUseCase.getNumUsers(); 
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }
    
    public async getSearchUsersCtrl({params}:Request,res:Response){
        const { search = '' } = params;
        const response=await this.userUseCase.getSearchUsers(search); 
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }

    public async listFollowersPagCtrl(req: Request, res: Response){
        const { uuid = '' ,numPage = '' } = req.params;
        const response = await this.userUseCase.listFollowersPag(`${uuid}`, `${numPage}`);
        res.send(response);
    }

    public async listFollowedPagCtrl(req: Request, res: Response){
        const { uuid = '' ,numPage = '' } = req.params;
        const response = await this.userUseCase.listFollowedPag(`${uuid}`, `${numPage}`);
        res.send(response);
    }
    
    public async checkFollowerCtrl({params}: Request, res: Response){
        const { uuid = '' ,uuidFollowed = '' } = params;
        const response = await this.userUseCase.checkFollower(`${uuid}`, `${uuidFollowed}`);
        res.send(response);
    }

    public async insertFollowerCtrl({body}:Request,res:Response){
        const{uuid,uuidFollower}=body;
        const response=await this.userUseCase.insertFollower(uuid,uuidFollower);
        res.send(response);
    }

    public async insertFollowedCtrl({body}:Request,res:Response){
        const{uuid,uuidFollowed}=body;
        const response=await this.userUseCase.insertFollowed(uuid,uuidFollowed);
        res.send(response);
    }

    public async deleteFollowerCtrl({body}:Request,res:Response){
        const{uuid,uuidFollower}=body;
        const response = await this.userUseCase.deleteFollower(uuid,uuidFollower);
        res.send(response);
    }

    public async deleteFollowedCtrl({body}:Request,res:Response){
        console.log(body);
        const{uuid,uuidFollowed}=body;
        console.log(uuid);
        console.log(uuidFollowed);
        const response=await this.userUseCase.deleteFollowed(uuid,uuidFollowed);
        console.log("Ctrl: " + response);
        res.send(response);
    }
}

