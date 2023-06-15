import { ActivityEntity } from "./activity.entity";

export class ActivityValue implements ActivityEntity{
    uuid:string;
    nameActivity: string;
    creatorActivity: string;
    participantsActivity?: [string];
    publicationActivity?: [string];
    dateActivity: Date;
    hoursActivity: [string];
    idLocation?: string;
    descriptionActivity?: string;
    privacyActivity: boolean;
    roleActivity: "verificado" | "common" | "empresa" ;

    constructor({uuid,nameActivity,creatorActivity,participantsActivity,publicationActivity,dateActivity,hoursActivity,idLocation,descriptionActivity,privacyActivity,roleActivity}:{uuid:string,nameActivity:string,creatorActivity:string,participantsActivity:[string],publicationActivity:[string],dateActivity:Date,hoursActivity:[string],idLocation:string,descriptionActivity:string,privacyActivity:boolean,roleActivity:"verificado" | "common" | "empresa"}){
        this.uuid=uuid;
        this.nameActivity=nameActivity;
        this.creatorActivity=creatorActivity;
        this.participantsActivity=participantsActivity;
        this.publicationActivity=publicationActivity;
        this.dateActivity=dateActivity;
        this.hoursActivity=hoursActivity;
        this.idLocation=idLocation;
        this.descriptionActivity=descriptionActivity;
        this.privacyActivity=privacyActivity;
        this.roleActivity=roleActivity;
    }
}