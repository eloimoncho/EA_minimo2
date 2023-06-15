import { UserEntity } from "../user/user.entity";

export interface PublicationEntity {
    uuid?:string;
    idUser:string;
    likesPublication?:[string];
    textPublication?:string;
    photoPublication:string;
    commentsPublication?:[string];
}

export interface Publication {
    uuid:string;
    idUser:UserEntity;
    likesPublication?:[string];
    textPublication?:string;
    photoPublication:[string]; //Cuidado que photoPublication arriba no es un vector y aqui sí
    commentsPublication?:[string];
    createdAt:string;
    updatedAt:string;
}

export interface PublicationLikes {
    uuid:string;
    idUser:string;
    likesPublication?:[UserEntity];
    textPublication?:string;
    photoPublication:[string];
    commentsPublication?:[string];
    createdAt:string;
    updatedAt:string;
}
