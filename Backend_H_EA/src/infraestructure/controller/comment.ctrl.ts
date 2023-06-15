import { CommentUseCase } from "../../application/commentUseCase";
import { Request,Response } from "express";

export class CommentController{
    constructor(private commentUseCase:CommentUseCase){
        this.getCommentPublicationByIdPagCtrl=this.getCommentPublicationByIdPagCtrl.bind(this);
        this.insertCommentPublicationCtrl=this.insertCommentPublicationCtrl.bind(this);
        this.responseCommentCtrl=this.responseCommentCtrl.bind(this);
        this.updateCommentPublicationCtrl=this.updateCommentPublicationCtrl.bind(this);
        this.deleteCommentPublicationCtrl=this.deleteCommentPublicationCtrl.bind(this);
        this.listCommentCtrl=this.listCommentCtrl.bind(this);
        this.getCommentByIdCtrl=this.getCommentByIdCtrl.bind(this);
        this.updateLikesCtrl=this.updateLikesCtrl.bind(this);
        this.listCommentPagCtrl=this.listCommentPagCtrl.bind(this);
        this.listResponsesPagCtrl=this.listResponsesPagCtrl.bind(this);
        this.getNumCommentsCtrl=this.getNumCommentsCtrl.bind(this);
    }

    public async getCommentPublicationByIdPagCtrl({params}:Request,res:Response){
        const {uuidPublication='',numPage}=params;
        console.log(params);
        const response=await this.commentUseCase.getCommentPublicationByIdPag(uuidPublication, numPage);
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }

    public async insertCommentPublicationCtrl({body}:Request,res:Response){
        const response=await this.commentUseCase.insertCommentPublication(body);
        res.send(response);
    }

    public async responseCommentCtrl({params,body}:Request,res:Response){
        const{uuid=''}=params;
        const response=await this.commentUseCase.responseComment(uuid,body);
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }

    public async updateCommentPublicationCtrl({params,body}:Request,res:Response){
        const{uuid=''}=params;
        const {idUserComment,idPublicationComment,textComment,likesComment,responseComment}=body;
        const response=await this.commentUseCase.updateCommentPublication(uuid,body);
        res.send(response);
    }

    public async deleteCommentPublicationCtrl({params}:Request,res:Response){
        const{uuid=''}=params;
        const response=await this.commentUseCase.deleteCommentPublication(uuid);
        res.send(response);
    }

    public async listCommentCtrl(req:Request,res:Response){
        const response=await this.commentUseCase.listComment(); 
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }

    public async getCommentByIdCtrl({params}:Request,res:Response){
        const {uuid}=params;
        const response=await this.commentUseCase.getCommentById(uuid); 
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }

    public async updateLikesCtrl({params}:Request,res:Response){
        const {uuid, uuidUser}=params;
        const response=await this.commentUseCase.updateLikes(uuid, uuidUser);
        res.send(response);
    }

    public async listCommentPagCtrl({params}:Request,res:Response){
        const {numPage}=params;
        const response=await this.commentUseCase.listCommentPag(numPage); 
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }

    public async listResponsesPagCtrl({params}:Request,res:Response){
        const {uuid,numPage}=params;
        const response=await this.commentUseCase.listResponsesPag(uuid,numPage); 
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }

    public async getNumCommentsCtrl(req:Request,res:Response){
        const response=await this.commentUseCase.getNumComments(); 
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }
}
