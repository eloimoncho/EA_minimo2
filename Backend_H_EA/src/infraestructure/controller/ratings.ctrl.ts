import { RatingsUseCase } from "../../application/ratingsUseCase";
import { Request,Response } from "express";

export class RatingsController{
    constructor(private ratingsUseCase:RatingsUseCase){
        this.getAllRatingsCtrl=this.getAllRatingsCtrl.bind(this);
        this.getUsersWhoHaveRatedCtrl=this.getUsersWhoHaveRatedCtrl.bind(this);
        this.insertRatingCtrl=this.insertRatingCtrl.bind(this);
        this.updateRatingCtrl=this.updateRatingCtrl.bind(this);
        this.getAverageValueRatingCtrl=this.getAverageValueRatingCtrl.bind(this);
        this.getRatingCtrl=this.getRatingCtrl.bind(this);
    }

    // (1) getAllRatings():Promise<RatingsEntity|null>;

    public async getAllRatingsCtrl(req:Request,res:Response){
        const response = await this.ratingsUseCase.getAllRatings();
        res.send(response);
    }

    // (2) getUsersWhoHaveRated(uuid:string):Promise<UserEntity[]|null>;

    public async getUsersWhoHaveRatedCtrl({params}:Request,res:Response){
        const { uuid = '' } = params;
        const response = await this.ratingsUseCase.getUsersWhoHaveRated(`${uuid}`);
        res.send(response);
    }

    // (3) insertRating(data:RatingsEntity):Promise<RatingsEntity|null>;

    public async insertRatingCtrl({body}:Request,res:Response){
        const response = await this.ratingsUseCase.insertRating(body);
        res.send(response);
    }

    // (4) updateRating(uuid:string,data:RatingsEntity):Promise<RatingsEntity|null>;

    public async updateRatingCtrl({params,body}:Request,res:Response){
        const { uuid = '' } = params;
        const response=await this.ratingsUseCase.updateRating(`${uuid}`,body);
        res.send(response);
    }

    // (5) getAverageValueRating(idRatedObject:string,ratingType:string):Promise<number|null>;

    public async getAverageValueRatingCtrl({params}:Request,res:Response){
        const { uuid = '', ratingType = '' } = params;
        const response = await this.ratingsUseCase.getAverageValueRating(`${uuid}`, `${ratingType}`);
        res.send(response);
    }

    // (6) getRating(idRatedObject:string,ratingType:string):Promise<RatingsEntity|null>;

    public async getRatingCtrl({params}:Request,res:Response){
        const { idRatedObject = '', ratingType = '' } = params;
        const response=await this.ratingsUseCase.getRating(`${idRatedObject}`, `${ratingType}`);
        res.send(response)
    }

}
