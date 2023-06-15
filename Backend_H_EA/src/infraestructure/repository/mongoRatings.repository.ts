import { RatingsEntity } from "../../domain/ratings/ratings.entity";
import { RatingsRepository } from "../../domain/ratings/ratings.repository";
import { UserEntity } from "../../domain/user/user.entity";
import RatingsModel from "../model/ratings.schema";
import UserModel from "../model/user.schema";
import { ObjectId } from 'mongodb';

export class MongoRatingsRepository implements RatingsRepository{
    
    async getAllRatings(): Promise<any> {
        const responseItems = await RatingsModel.find();
        return responseItems;
    }

    async getUsersWhoHaveRated(uuid: string): Promise<any> {
        const responseItem = await RatingsModel.findOne({ _id: uuid });
        if (responseItem) {
          const { idRaters } = responseItem;
          return idRaters;
        }
        return null;
    }
    
    async insertRating(data: RatingsEntity): Promise<any> {
        const item=await RatingsModel.create(data);
        const updatedData = {
            ...data,
            uuid: item._id,
        };
        const activity= await RatingsModel.updateOne({ _id: item._id }, updatedData);
        return activity;    
    }
    
    async updateRating(uuid: string, data: RatingsEntity): Promise<any> {
        const responseItem = await RatingsModel.updateOne({_id: uuid},data,{new: true});
        return responseItem;
    }
    
    async getAverageValueRating(idRatedObject: string, ratingType: string): Promise<any> {
        const result = await RatingsModel.findOne({ idRatedObject, ratingType });
        console.log("RESULTADO: "+ result);
        if (result) {
          return result.ratingAverage;
        }
        return null;
    }
    
    async getRating(idRatedObject: string, ratingType: string): Promise<any> {
        const result = await RatingsModel.findOne({ idRatedObject, ratingType });
        if (result) {
          return result;
        }
        return {};
    }
}