import { LocationUseCase } from "../../application/locationUseCase";
import { Request,Response } from "express";

export class LocationController{
    constructor(private locationUseCase:LocationUseCase){
        this.getLocationByIdCtrl=this.getLocationByIdCtrl.bind(this);
        this.listLocationCtrl=this.listLocationCtrl.bind(this);
        this.updateLocationCtrl=this.updateLocationCtrl.bind(this);
        this.deleteLocationCtrl=this.deleteLocationCtrl.bind(this);
        this.listLocationPagCtrl=this.listLocationPagCtrl.bind(this);
        this.getNumLocationsCtrl=this.getNumLocationsCtrl.bind(this);
        this.insertLocationCtrl=this.insertLocationCtrl.bind(this);
    }

    public async getLocationByIdCtrl({params}:Request,res:Response){
        const { uuid = '' } = params;
        const response=await this.locationUseCase.getLocationById(`${uuid}`);
        res.send(response)
    }

    public async listLocationCtrl(req:Request,res:Response){
        const response=await this.locationUseCase.listLocation();
        res.send(response);
    }

    public async updateLocationCtrl({params,body}:Request,res:Response){
        const { uuid = '' } = params;
        const response=await this.locationUseCase.updateLocation(`${uuid}`,body);
        res.send(response);
    }

    public async deleteLocationCtrl({params}:Request,res:Response){
        const { uuid = '' } = params;
        const response=await this.locationUseCase.deleteLocation(`${uuid}`);
        res.send(response);
    }

    public async listLocationPagCtrl({params}:Request,res:Response){
        const {numPage=''}=params;
        const response=await this.locationUseCase.listLocationPag(`${numPage}`);
        res.send(response);
    }

    public async getNumLocationsCtrl(req:Request,res:Response){
        const response=await this.locationUseCase.getNumLocations(); 
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }

    public async insertLocationCtrl({body}:Request,res:Response){
        const response = await this.locationUseCase.insertLocation(body);
        res.send(response);
    }

}