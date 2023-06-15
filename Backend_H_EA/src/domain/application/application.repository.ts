import { ApplicationEntity } from "./application.entity";

export interface ApplicationRepository{
    insertApplication(data:ApplicationEntity):Promise<ApplicationEntity|null>;
    updateApplication(uuid:string,data:ApplicationEntity):Promise<ApplicationEntity|null>;
    deleteApplication(uuid:string):Promise<ApplicationEntity|null>;
    listApplication():Promise<ApplicationEntity[]|null>;
    getApplicationById(uuid:string):Promise<ApplicationEntity|null>;
    listApplicationPag(numPage:string):Promise<ApplicationEntity[]|null>;
    getNumApplications():Promise<String|null>;
}
