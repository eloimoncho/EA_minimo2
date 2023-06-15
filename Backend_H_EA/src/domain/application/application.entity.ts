export interface ApplicationEntity{
    uuid:string;
    idSender: string;
    idReceiver: string;
    typeApplication: "proposal" | "join"; 
    idActivity: string;
    descriptionApplication?: string;
}
