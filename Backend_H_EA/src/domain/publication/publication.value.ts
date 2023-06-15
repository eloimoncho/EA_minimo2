import { PublicationEntity } from "./publication.entity";

export class PublicationValue implements PublicationEntity{
    uuid:string;
    idUser:string;
    likesPublication?:[string];
    textPublication?:string;
    photoPublication:[string];
    commentsPublication?:[string];

    constructor({uuid,idUser,likesPublication,textPublication,photoPublication,commentsPublication}:{uuid:string,idUser:string,likesPublication?:[string],textPublication?:string,photoPublication:[string],commentsPublication?:[string]}){
        this.uuid=uuid;
        this.idUser=idUser;
        this.likesPublication=likesPublication;
        this.textPublication=textPublication;
        this.photoPublication=photoPublication;
        this.commentsPublication=commentsPublication;
    }
}
