import { CommentEntity } from "./comment.entity";

export class CommentValue implements CommentEntity{
    uuid:string;
    idUserComment: string;
    idPublicationComment: string;
    textComment: string;
    likesComment?: [string];
    responseComment?: [string];

    constructor({uuid,idUserComment,idPublicationComment,textComment,likesComment,responseComment}:{uuid:string,idUserComment:string,idPublicationComment:string,textComment:string,likesComment:[string],responseComment:[string]}){
        this.uuid=uuid;
        this.idUserComment=idUserComment;
        this.idPublicationComment=idPublicationComment;
        this.textComment=textComment;
        this.likesComment=likesComment;
        this.responseComment=responseComment;
    }
}