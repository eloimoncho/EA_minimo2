import { PublicationValue } from './../domain/publication/publication.value';
import { PublicationRepository } from './../domain/publication/publication.repository';
import { NotFoundError } from './notFoundError';

export class PublicationUseCase{
    constructor(private readonly publicationRepository:PublicationRepository){}

    public getPublicationById=async(uuid:string)=>{
        const publication=await this.publicationRepository.getPublicationById(uuid);
        if(!publication){
            throw new NotFoundError("Publication not found");
        }
        return publication;
    }
    public updatePublication=async(uuid:string,{idUser,likesPublication,textPublication,photoPublication,commentsPublication}:{idUser:string,likesPublication?:[string],textPublication?:string,photoPublication:[string],commentsPublication?:[string]})=>{
        const publicationValue=new PublicationValue({uuid,idUser,likesPublication,textPublication,photoPublication,commentsPublication});
        const publication=await this.publicationRepository.updatePublication(uuid,publicationValue);
        if(!publication){
            throw new NotFoundError("Publication not found");
        }
        return publication;
    }

    public insertPublication=async({uuid,idUser,likesPublication,textPublication,photoPublication,commentsPublication}:{uuid:string,idUser:string,likesPublication?:[string],textPublication?:string,photoPublication:[string],commentsPublication?:[string]})=>{
        const publicationValue:PublicationValue=new PublicationValue({uuid,idUser,likesPublication,textPublication,photoPublication,commentsPublication});
        console.log("PerroSanxe" + publicationValue);
        const publication=await this.publicationRepository.insertPublication(publicationValue);
        if(!publication){
            throw new NotFoundError("Publication not found");
        }
        return publication;
    }

    public deletePublication=async(uuid:string)=>{
        const publication=await this.publicationRepository.deletePublication(uuid);
        return publication;
    }

    public getNumPublications=async()=>{
        const numPublications=await this.publicationRepository.getNumPublications();
        return numPublications;
    }

    public getFollowingPost=async(numPage:string, uuid:string)=>{
        console.log(numPage,uuid);
        const numPublications=await this.publicationRepository.getFollowingPost(numPage, uuid);
        return numPublications;
    }

    // BEREAL
    public getOwnPosts=async(uuid:string)=>{
        const ownPosts=await this.publicationRepository.getOwnPosts(uuid);
        return ownPosts;
    }
    
    public getNumFollowingPost=async( uuid:string)=>{
        console.log(uuid);
        const numPublications=await this.publicationRepository.getNumFollowingPost(uuid);
        return numPublications;
    }

    public getLikes=async( uuid:string, numPage:string)=>{
        console.log(uuid);
        const publicationLikes=await this.publicationRepository.getLikes(uuid, numPage);
        return publicationLikes;
    }

    public listPublicationsPag=async(numPage:string)=>{
        const listPublication=await this.publicationRepository.listPublicationsPag(numPage);
        return listPublication;
    }

    public updateLikes=async(uuid:string,uuidUser:string)=>{
        const publication=await this.publicationRepository.updateLikes(uuid,uuidUser);
        return publication;
    }
    
    public deleteLikes=async(uuid:string,uuidUser:string)=>{
        const publication=await this.publicationRepository.deleteLikes(uuid,uuidUser);
        return publication;
    }

    public listPublication=async()=>{
        const listPublication=await this.publicationRepository.listPublication();
        if(!listPublication){
            throw new NotFoundError("Publication not found");
        }
        return listPublication;
    }

}