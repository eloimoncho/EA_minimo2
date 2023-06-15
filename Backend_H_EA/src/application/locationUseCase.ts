import { LocationValue } from './../domain/location/location.value';
import { LocationRepository } from "../domain/location/location.repository";
import { NotFoundError } from './notFoundError';

export class LocationUseCase{
    constructor(private readonly locationRepository:LocationRepository){}

    public getLocationById=async(uuid:string)=>{
        const location=await this.locationRepository.getLocationById(uuid);
        if (!location) {
            throw new NotFoundError("Location not found");
        }
        return location;
    }

    public listLocation=async()=>{
        const listLocation=await this.locationRepository.listLocation();
        if (!listLocation) {
            throw new NotFoundError("List not found");
        }
        return listLocation;
    }

    public updateLocation=async(uuid:string,{nameLocation,latLocation,lonLocation,descriptionLocation}:{nameLocation:string,latLocation:string,lonLocation:string,descriptionLocation:string})=>{
        const locationValue=new LocationValue({uuid,nameLocation,latLocation,lonLocation,descriptionLocation});
        const location=await this.locationRepository.updateLocation(uuid,locationValue);
        if (!location) {
            throw new NotFoundError("Location not found");
        }
        return location;
    }

    public deleteLocation=async(uuid:string)=>{
        const location=await this.locationRepository.deleteLocation(uuid);
        return location;
    }

    public listLocationPag=async(numPage:string)=>{
        const listLocation=await this.locationRepository.listLocationPag(numPage);
        return listLocation;
    }

    public getNumLocations=async()=>{
        const getNumLocations=await this.locationRepository.getNumLocations();
        return getNumLocations;
    }

    public insertLocation=async({uuid,nameLocation,latLocation,lonLocation,descriptionLocation}:{uuid:string,nameLocation:string,latLocation:string,lonLocation:string,descriptionLocation:string})=>{
        const locationValue=new LocationValue({uuid,nameLocation,latLocation,lonLocation,descriptionLocation});
        const location=await this.locationRepository.insertLocation(locationValue);
        if (!location) {
            throw new NotFoundError("Location not found");
        }
        return location;
    }
}