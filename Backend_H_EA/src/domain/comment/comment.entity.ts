export interface CommentEntity{
    uuid:string;
    idUserComment: string;
    idPublicationComment: string;
    textComment: string;
    likesComment?: [string];
    responseComment?: [string];
}