export interface PublicationEntity{
    uuid:string;
    idUser:string;
    likesPublication?:[string];
    textPublication?:string;
    photoPublication:[string];
    commentsPublication?:[string];
}