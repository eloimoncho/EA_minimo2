import { ApplicationUseCase } from "../../application/applicationUseCase";
import { Request,Response } from "express";


export class ApplicationController{
    constructor(private applicationUseCase:ApplicationUseCase){
        this.getApplicationByIdCtrl=this.getApplicationByIdCtrl.bind(this);
        this.listApplicationCtrl=this.listApplicationCtrl.bind(this);
        this.updateApplicationCtrl=this.updateApplicationCtrl.bind(this);
        this.deleteApplicationCtrl=this.deleteApplicationCtrl.bind(this);
        this.listApplicationPagCtrl=this.listApplicationPagCtrl.bind(this);
        this.getNumApplicationsCtrl=this.getNumApplicationsCtrl.bind(this);
        this.insertApplicationCtrl=this.insertApplicationCtrl.bind(this);
    }

    public async getApplicationByIdCtrl({params}:Request,res:Response){
        const { uuid = '' } = params;
        const response=await this.applicationUseCase.getApplicationById(`${uuid}`);
        res.send(response)
    }

    public async listApplicationCtrl(req:Request,res:Response){
        const response=await this.applicationUseCase.listApplication();
        res.send(response);
    }

    public async updateApplicationCtrl({params,body}:Request,res:Response){
        const { uuid = '' } = params;
        const response=await this.applicationUseCase.updateApplication(`${uuid}`,body);
        res.send(response);
    }

    public async deleteApplicationCtrl({params}:Request,res:Response){
        const { uuid = '' } = params;
        const response=await this.applicationUseCase.deleteApplication(`${uuid}`);
        res.send(response);
    }

    public async listApplicationPagCtrl({params}:Request,res:Response){
        const {numPage=''}=params;
        const response=await this.applicationUseCase.listApplicationPag(`${numPage}`);
        res.send(response);
    }

    public async getNumApplicationsCtrl(req:Request,res:Response){
        const response=await this.applicationUseCase.getNumApplications(); 
        const data=response ? response:"NOT_FOUND";
        res.send(data);
    }

    public async insertApplicationCtrl({body}:Request,res:Response){
        const response = await this.applicationUseCase.insertApplication(body);
        res.send(response);
    }

}
