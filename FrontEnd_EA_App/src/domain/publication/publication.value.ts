import { UserEntity } from "../user/user.entity";
import { PublicationEntity } from "./publication.entity";

export class PublicationValue implements PublicationEntity {
    uuid: string;
    idUser: UserEntity;
    likesPublication?: [string] | undefined;
    textPublication?: string | undefined;
    photoPublication: [string];
    commentsPublication?: [string] | undefined;
    createdAt: string;
    updatedAt: string;
    
    constructor({uuid,idUser,likesPublication,textPublication,photoPublication,commentsPublication,createdAt,updatedAt}:{uuid: string, idUser: UserEntity, likesPublication?: [string] | undefined, textPublication?: string | undefined, photoPublication: [string], commentsPublication?: [string] | undefined, createdAt: string, updatedAt: string}){
        this.uuid=uuid;
        this.idUser=idUser;
        this.likesPublication=likesPublication;
        this.textPublication=textPublication;
        this.photoPublication=photoPublication;
        this.commentsPublication=commentsPublication;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;
    }
}
