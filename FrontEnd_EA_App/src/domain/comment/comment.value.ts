import { UserEntity } from "../user/user.entity";
import { CommentEntity } from "./comment.entity";

export class CommentValue implements CommentEntity {
    uuid: string;
    idUserComment: UserEntity;
    idPublicationComment: string;
    textComment: string;
    likesComment?: [string] | undefined;
    responseComment?: [string] | undefined;

    
    constructor({uuid,idUserComment,idPublicationComment,textComment,likesComment,responseComment}:{uuid: string, idUserComment: UserEntity, idPublicationComment: string, textComment: string, likesComment: [string] | undefined,  responseComment?: [string] | undefined}){
        this.uuid=uuid;
        this.idUserComment=idUserComment;
        this.idPublicationComment=idPublicationComment;
        this.textComment=textComment;
        this.likesComment=likesComment;
        this.responseComment=responseComment;
        
    }
    
}
