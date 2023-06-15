import { RatingsValue } from '../domain/ratings/ratings.value';
import { RatingsRepository } from './../domain/ratings/ratings.repository';
import { NotFoundError } from "./notFoundError";

export class RatingsUseCase{

    constructor(private readonly ratingsRepository:RatingsRepository){}

    // (1) getAllRatings():Promise<RatingsEntity|null>;

    public getAllRatings=async()=>{
        const ratings=await this.ratingsRepository.getAllRatings();
        if (!ratings) {
            throw new NotFoundError("There are no ratings!");
        }
        return ratings;
    }

    // (2) getUsersWhoHaveRated(uuid:string):Promise<UserEntity[]|null>;

    public getUsersWhoHaveRated=async(uuid:string)=>{
        const usersWhoHaveRated = await this.ratingsRepository.getUsersWhoHaveRated(uuid);
        if (!usersWhoHaveRated) {
            throw new NotFoundError("Nobody has rated!");
        }
        return usersWhoHaveRated;
    }

    // (3) insertRating(data:RatingsEntity):Promise<RatingsEntity|null>;

    public insertRating=async({uuid,ratingType,idRatedObject,ratingAverage,idRaters}:{uuid:string,ratingType:"users" | "activities" | "locations" | "comments" | "publications",idRatedObject:string,ratingAverage:number,idRaters?:[string]})=>{
        const ratingValue=new RatingsValue({uuid,ratingType,idRatedObject,ratingAverage,idRaters});
        const rating=await this.ratingsRepository.insertRating(ratingValue);
        if (!rating) {
            throw new NotFoundError("The new rating can't be found!");
        }
        return rating;
    }

    // (4) updateRating(uuid:string,data:RatingsEntity):Promise<RatingsEntity|null>;

    public updateRating=async(uuid:string,{ratingType,idRatedObject,ratingAverage,idRaters}:{uuid:string,ratingType:"users" | "activities" | "locations" | "comments" | "publications",idRatedObject:string,ratingAverage:number,idRaters?:[string]})=>{
        const newRatingValue=new RatingsValue({uuid,ratingType,idRatedObject,ratingAverage,idRaters});
        const newRating=await this.ratingsRepository.updateRating(uuid,newRatingValue);
        if (!newRating) {
            throw new NotFoundError("The updated rating can't be found!");
        }
        return newRating;
    }

    // (5) getAverageValueRating(idRatedObject:string,ratingType:string):Promise<number|null>;

    public getAverageValueRating=async(idRatedObject:string, ratingType:string)=>{
        const averageRate = await this.ratingsRepository.getAverageValueRating(idRatedObject, ratingType);
        if (!averageRate) {
            throw new NotFoundError("There's no average rate!");
        } else {
            return averageRate;
        }
    }

    // (6) getRating(idRatedObject:string,ratingType:string):Promise<RatingsEntity|null>;

    public getRating=async(idRatedObject:string, ratingType:string)=>{
        const rate = await this.ratingsRepository.getRating(idRatedObject, ratingType);
        if (!rate) {
            throw new NotFoundError("This object doesn't have any rate!");
        } else {
            return rate;
        }
    }

}
