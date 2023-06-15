import { CommentEntity } from "./comment.entity";

export interface CommentRepository{
    getCommentPublicationByIdPag(uuidPublication:string,numPage:string):Promise<CommentEntity|null>;
    insertCommentPublication(data:CommentEntity):Promise<CommentEntity|null>;
    responseComment(uuid:string,data:CommentEntity):Promise<CommentEntity|null>;
    updateCommentPublication(uuid:string,data:CommentEntity):Promise<CommentEntity|null>;
    deleteCommentPublication(uuid:string):Promise<CommentEntity|null>;
    listComment():Promise<CommentEntity[]|null>;
    getCommentById(uuid:string):Promise<CommentEntity|null>;
    updateLikes(uuid:string,uuidUser:string):Promise<CommentEntity|null>;
    listCommentPag(numPage:string):Promise<CommentEntity[]|null>;
    listResponsesPag(uuid:string,numPage:string):Promise<CommentEntity[]|null>;
    getNumComments():Promise<String|null>;
}
