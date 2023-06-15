import { CommentRepository } from "../domain/comment/comment.repository";
import { CommentValue } from "../domain/comment/comment.value";
import { NotFoundError } from "./notFoundError";

export class CommentUseCase{
    constructor(private readonly commentRepository:CommentRepository){}

    public getCommentById=async(uuid:string)=>{
        const comment = await this.commentRepository.getCommentById(uuid);
        if (!comment) {
            throw new NotFoundError("Comment not found");
        }
        return comment;
    }

    public listComment=async()=>{
        const listComment=await this.commentRepository.listComment();
        if (!listComment) {
            throw new NotFoundError("List not found");
        }
        return listComment;
    }

    public updateCommentPublication=async(uuid:string,{idUserComment,idPublicationComment,textComment,likesComment,responseComment}:{idUserComment:string,idPublicationComment:string,textComment:string,likesComment:[string],responseComment:[string]})=>{
        const commentValue=new CommentValue({uuid,idUserComment,idPublicationComment,textComment,likesComment,responseComment});
        const comment=await this.commentRepository.updateCommentPublication(uuid,commentValue);
        if (!comment) {
            throw new NotFoundError("Comment not found");
        }
        return comment;
    }

    public insertCommentPublication=async({uuid,idUserComment,idPublicationComment,textComment,likesComment,responseComment}:{uuid:string,idUserComment:string,idPublicationComment:string,textComment:string,likesComment:[string],responseComment:[string]})=>{
        const commentValue=new CommentValue({uuid,idUserComment,idPublicationComment,textComment,likesComment,responseComment});
        const comment=await this.commentRepository.insertCommentPublication(commentValue);
        if (!comment) {
            throw new NotFoundError("Comment not found");
        }
        return comment;
    }

    public deleteCommentPublication=async(uuid:string)=>{
        const comment=await this.commentRepository.deleteCommentPublication(uuid);
        return comment;
    }

    public listCommentPag=async(numPage:string)=>{
        const listComment=await this.commentRepository.listCommentPag(numPage);
        return listComment;
    }

    public getNumComments=async()=>{
        const numComments=await this.commentRepository.getNumComments();
        return numComments;
    }

    public responseComment=async(uuid:string,{idUserComment,idPublicationComment,textComment,likesComment,responseComment}:{idUserComment:string,idPublicationComment:string,textComment:string,likesComment:[string],responseComment:[string]})=>{
        const commentValue=new CommentValue({uuid,idUserComment,idPublicationComment,textComment,likesComment,responseComment});
        const comment=await this.commentRepository.responseComment(uuid,commentValue);
        if (!comment) {
            throw new NotFoundError("Comment not found");
        }
        return comment;
    }

    public listResponsesPag=async(uuid:string,numPage:string)=>{
        const listComment=await this.commentRepository.listResponsesPag(uuid,numPage);
        return listComment;
    }

    public updateLikes=async(uuid:string,uuidUser:string)=>{
        const comment=await this.commentRepository.updateLikes(uuid,uuidUser);
        return comment;
    }

    public getCommentPublicationByIdPag=async(uuidPublication:string,numPage:string)=>{
        const comment=await this.commentRepository.getCommentPublicationByIdPag(uuidPublication,numPage);
        return comment;
    }

}
