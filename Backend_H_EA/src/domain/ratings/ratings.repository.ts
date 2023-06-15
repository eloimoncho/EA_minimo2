import { UserEntity } from "../user/user.entity";
import { RatingsEntity } from "./ratings.entity";

export interface RatingsRepository{
    getAllRatings():Promise<RatingsEntity|null>;
    getUsersWhoHaveRated(uuid:string):Promise<UserEntity[]|null>;
    insertRating(data:RatingsEntity):Promise<RatingsEntity|null>;
    updateRating(uuid:string,data:RatingsEntity):Promise<RatingsEntity|null>;
    getAverageValueRating(idRatedObject:string,ratingType:string):Promise<number|null>;
    getRating(idRatedObject:string,ratingType:string):Promise<RatingsEntity|null>;
}
