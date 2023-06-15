import { UserEntity } from "../user/user.entity";

export interface CommentEntity {
    uuid?:string;
    idUserComment: UserEntity;
    idPublicationComment: string;
    textComment: string;
    likesComment?: [string];
    responseComment?: [string];
}

