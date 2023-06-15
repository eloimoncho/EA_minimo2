import { PublicationUseCase } from "../../application/publicationUseCase";
import { Request,Response } from "express";
import { isImageFile } from "../utils/isImage.handle";
import { cloudinary } from "../utils/cloduinary.handle";
import { PublicationValue } from "../../domain/publication/publication.value";

export class PublicationController{
    constructor(private publicationUseCase:PublicationUseCase){
        this.getPublicationByIdCtrl=this.getPublicationByIdCtrl.bind(this);
        this.listPublicationCtrl=this.listPublicationCtrl.bind(this);
        this.updatePublicationCtrl=this.updatePublicationCtrl.bind(this);
        this.insertPublicationCtrl=this.insertPublicationCtrl.bind(this);
        this.deletePublicationCtrl=this.deletePublicationCtrl.bind(this);
        this.listPublicationPagCtrl=this.listPublicationPagCtrl.bind(this);
        this.getNumPublicationsCtrl=this.getNumPublicationsCtrl.bind(this);
        this.getFollowingPostCtrl=this.getFollowingPostCtrl.bind(this);
        this.getOwnPostsCtrl=this.getOwnPostsCtrl.bind(this);
        this.getLikesCtrl=this.getLikesCtrl.bind(this);
        this.getNumFollowingPostCtrl=this.getNumFollowingPostCtrl.bind(this);
        this.updateLikesCtrl=this.updateLikesCtrl.bind(this);
        this.deleteLikesCtrl=this. deleteLikesCtrl.bind(this);
        
    }

    public async getPublicationByIdCtrl({params}:Request,res:Response){
        const { uuid = '' } = params;
        console.log(params);
        const response=await this.publicationUseCase.getPublicationById(`${uuid}`);
        res.send(response)
    }

    public async listPublicationCtrl(req:Request,res:Response){
        const response=await this.publicationUseCase.listPublication();
        console.log(response);
        res.send(response);
    }

    public async updatePublicationCtrl(req:Request,res:Response){
        const{uuid,idUser,likesPublication,textPublication,photoPublication,commentsPublication}=req.body;
        try{
            if(req.file){
                if(isImageFile(req.file)){
                    console.log("FILE_YES");
                    const publicationA=await this.publicationUseCase.getPublicationById(uuid);
                    console.log("Aqui1")
                    const uploadResUp = await cloudinary.uploader.upload(req.file.path, {
                        upload_preset: "publication",
                    });
                    const delUp=await cloudinary.uploader.destroy(publicationA.photoPublication);
                    if(uploadResUp){
                        const publication=new PublicationValue({
                            uuid:uuid,
                            idUser:idUser,
                            likesPublication:likesPublication,
                            textPublication:textPublication,
                            photoPublication:uploadResUp.secure_url,
                            commentsPublication:commentsPublication,
                        })
                        console.log('Hey');
                        const response=await this.publicationUseCase.updatePublication(uuid,publication);
                        console.log(response);
                        res.send(response);
                        console.log(response);
                    }
                }
                else{res.send("NOT_SENDING_IMAGE")}
            }
            else{
                console.log('How');
                const response=await this.publicationUseCase.updatePublication(uuid,req.body);
                res.send(response);
            }
        }
            catch(error){}
    }

    public async insertPublicationCtrl(req:Request,res:Response){
        const{uuid,idUser,likesPublication,textPublication,photoPublication,commentsPublication}=req.body;
        try{
            if(req.file){
                if(isImageFile(req.file)){
                    console.log("FILE_YES");
                    const uploadRes=await cloudinary.uploader.upload(req.file.path,{
                        upload_preset:"publication",
                    });

                    if(uploadRes){
                        const publication=new PublicationValue({
                            uuid:uuid,
                            idUser:idUser,
                            likesPublication:likesPublication,
                            textPublication:textPublication,
                            photoPublication:uploadRes.secure_url,
                            commentsPublication:commentsPublication,
                        })
                        console.log('Hey');
                        const response=await this.publicationUseCase.insertPublication(publication);
                        console.log(response);
                        res.send(response);
                        console.log(response);
                    }
                }
                else{res.send("NOT_SENDING_IMAGE")}
            }
            else{
                console.log('How');
                const response=await this.publicationUseCase.insertPublication(req.body);
                res.send(response);
            }
        }catch(error){}
    }


    public async deletePublicationCtrl(req: Request, res: Response) {
        const { uuid = '' } = req.params;
        try {
          const publication = await this.publicationUseCase.getPublicationById(uuid);
      
          if (publication) {
            const photoUrl = publication.photoPublication;
            var i=photoUrl.length;
            console.log("destroy");
            while(i>0){
                await cloudinary.uploader.destroy(photoUrl);
                i--;
            }
            const response = await this.publicationUseCase.deletePublication(uuid);
            res.send(response);
          } else {
            res.send("La publicación no existe");
          }
        } catch (error) {
          console.error(error);
          res.status(500).send("Error al eliminar la publicación");
        }
      }

    public async listPublicationPagCtrl({params}:Request,res:Response){
        const {numPage=''}=params;
        const response=await this.publicationUseCase.listPublicationsPag(`${numPage}`);
        res.send(response);
    }

    public async getNumPublicationsCtrl(req:Request,res:Response){
        const response=await this.publicationUseCase.getNumPublications();
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }

    public async getFollowingPostCtrl({params}:Request,res:Response){
        console.log(params);
        const {numPage='', uuid=''}=params;
        const response=await this.publicationUseCase.getFollowingPost(numPage, uuid);
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }

    // BEREAL
    public async getOwnPostsCtrl({params}:Request,res:Response){
        console.log(params);
        const {uuid=''}=params;
        const response=await this.publicationUseCase.getOwnPosts(uuid);
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }
    
    public async getNumFollowingPostCtrl({params}:Request,res:Response){
        console.log(params);
        const {uuid=''}=params;
        const response=await this.publicationUseCase.getNumFollowingPost(uuid);
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }

    public async getLikesCtrl({params}:Request,res:Response){
        console.log(params);
        const {uuid='', numPage=''}=params;
        const response=await this.publicationUseCase.getLikes(uuid,numPage);
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }

    public async updateLikesCtrl({body}:Request,res:Response){
        const {uuid, uuidUser}=body;
        const response=await this.publicationUseCase.updateLikes(uuid,uuidUser);
        res.send(response);
    }
    
    
    public async deleteLikesCtrl({body}:Request,res:Response){
        const {uuid, uuidUser}=body;
        const response=await this.publicationUseCase.deleteLikes(uuid,uuidUser);
        res.send(response);
    }
}
