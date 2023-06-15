import { LocationEntity } from './../../domain/location/location.entity';
import { Types } from "mongoose";
import { LocationRepository } from "../../domain/location/location.repository";
import LocationModel from "../model/location.schema";

export class MongoLocationRepository implements LocationRepository{

    async getLocationById(uuid:string):Promise<any>{
        const response = await LocationModel.findOne({_id:uuid});
        return response;
    }

    async listLocation(): Promise<any> {
        const response = await LocationModel.find();
        return response;
    }

    async updateLocation(uuid:string,data:LocationEntity):Promise<any>{
        const response=await LocationModel.findOneAndUpdate({_id:uuid},data,{new:true});
        return response;
    }

    async insertLocation(data:LocationEntity):Promise<any>{
        const item=await LocationModel.create(data);
        const updatedData = {
            ...data,
            uuid: item._id,
        };
        const location= await LocationModel.updateOne({ _id: item._id }, updatedData);
        return location;
    }

    async deleteLocation(uuid: string): Promise<any> {
        const response = await LocationModel.findOneAndRemove({_id:uuid});
        return response;
    }

    async listLocationPag(numPage:string):Promise<any>{
        const items = 2;
        const hop = (parseInt(numPage,10) - 1) * items;
        const response = await LocationModel.find({}).skip(hop).limit(items).exec();
        return response;
    }

    async getNumLocations():Promise<any>{
        const response = (await LocationModel.countDocuments({})).toString();
        return response;
    }

}
