import { LocationEntity } from "./location.entity";

export interface LocationRepository{
    insertLocation(data:LocationEntity):Promise<LocationEntity|null>;
    listLocation():Promise<LocationEntity[]|null>;
    listLocationPag(numPage:string):Promise<LocationEntity[]|null>;
    getLocationById(uuid:string):Promise<LocationEntity|null>;
    updateLocation(uuid:string,data:LocationEntity):Promise<LocationEntity|null>;
    deleteLocation(uuid:string):Promise<LocationEntity|null>;
    getNumLocations():Promise<String|null>;
}