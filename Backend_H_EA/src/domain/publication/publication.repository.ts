import { PublicationEntity } from "./publication.entity";

export interface PublicationRepository{
    insertPublication(data:PublicationEntity):Promise<PublicationEntity|null>;
    listPublication():Promise<PublicationEntity[]|null>;
    getNumPublications():Promise<String|null>;
    getFollowingPost(numPage:string, uuid:string):Promise<PublicationEntity[]|null>;

    getOwnPosts(uuid:string):Promise<PublicationEntity[]|null>;

    getNumFollowingPost(uuid:string):Promise<string|null>;
    getPublicationById(uuid:string):Promise<PublicationEntity|null>;
    getLikes(uuid:string, numPage:string):Promise<PublicationEntity|null>;
    updatePublication(uuid:string,data:PublicationEntity):Promise<PublicationEntity|null>;
    deletePublication(uuid:string):Promise<PublicationEntity|null>;
    listPublicationsPag(numPage:string):Promise<PublicationEntity[]|null>;
    updateLikes(uuid:string,uuidUser:string):Promise<PublicationEntity|null>;
    deleteLikes(uuid:string,uuidUser:string):Promise<PublicationEntity|null>;
}
