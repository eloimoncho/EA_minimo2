import { ApplicationEntity } from "./application.entity";

export class ApplicationValue implements ApplicationEntity{
    uuid:string;
    idSender: string;
    idReceiver: string;
    typeApplication: "proposal" | "join"; 
    idActivity: string;
    descriptionApplication?: string;

    constructor({uuid,idSender,idReceiver,typeApplication,idActivity,descriptionApplication}:{uuid:string,idSender:string,idReceiver:string,typeApplication:"proposal" | "join",idActivity:string,descriptionApplication:string}){
        this.uuid=uuid;
        this.idSender=idSender;
        this.idReceiver=idReceiver;
        this.typeApplication=typeApplication;
        this.idActivity=idActivity;
        this.descriptionApplication=descriptionApplication;
    }
}