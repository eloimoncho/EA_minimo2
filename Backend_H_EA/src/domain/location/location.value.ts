import { LocationEntity } from "./location.entity";

export class LocationValue implements LocationEntity{
    uuid: string;
    nameLocation: string;
    latLocation: string;
    lonLocation: string;
    descriptionLocation?: string;

    constructor({uuid,nameLocation,latLocation,lonLocation,descriptionLocation}:{uuid:string,nameLocation:string,latLocation:string,lonLocation:string,descriptionLocation:string}){
        this.uuid=uuid;
        this.nameLocation=nameLocation;
        this.latLocation=latLocation;
        this.lonLocation=lonLocation;
        this.descriptionLocation=descriptionLocation;
    }
}