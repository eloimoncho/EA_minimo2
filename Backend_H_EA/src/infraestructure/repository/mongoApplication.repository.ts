import { ApplicationEntity } from "../../domain/application/application.entity";
import { ApplicationRepository } from "../../domain/application/application.repository";
import ApplicationModel from "../model/application.schema";


export class MongoApplicationRepository implements ApplicationRepository{

    async getApplicationById(uuid: string): Promise<any> {
        const responseItem = await ApplicationModel.findOne({_id: uuid })
        return responseItem;
    }

    async listApplication(): Promise<any> {
        const responseItem = await ApplicationModel.find({ })
        return responseItem;
    }

    async listApplicationPag(numPage: string): Promise<any> {
        const numApplicationPerPage = 2;
        const hop = (parseInt(numPage) - 1) * numApplicationPerPage;
        const responseItem = await ApplicationModel.find({ }).skip(hop).limit(numApplicationPerPage).exec();
        return responseItem;
    }

    async insertApplication(data: ApplicationEntity): Promise<any> {
        const item = await ApplicationModel.create(data);
        
        // Actualizar la propiedad uuid con el valor de response._id
        const updatedData = {
            ...data,
            uuid: item._id,
        };
        // Realizar la actualización en la base de datos
        const application= await ApplicationModel.updateOne({ _id: item._id }, updatedData);
        
        return application;
    }

    async updateApplication(uuid: string, data: ApplicationEntity): Promise<any> {
        const responseItem = await ApplicationModel.updateOne({_id: uuid},data,{new: true});
        return responseItem;
    }

    async deleteApplication(uuid: string): Promise<any> {
        const responseItem = await ApplicationModel.findOneAndRemove({_id: uuid});
        return responseItem;
    }

    async getNumApplications(): Promise<any> {
        const responseItem = (await ApplicationModel.countDocuments({})).toString();
        return responseItem;
    }
}