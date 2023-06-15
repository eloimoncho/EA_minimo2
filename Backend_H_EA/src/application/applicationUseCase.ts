import { ApplicationRepository } from "../domain/application/application.repository";
import { ApplicationValue } from "../domain/application/application.value";
import { NotFoundError } from "./notFoundError";

export class ApplicationUseCase{
    constructor(private readonly applicationRepository:ApplicationRepository){}

        public insertApplication=async({uuid,idSender,idReceiver,typeApplication,idActivity,descriptionApplication}:{uuid:string,idSender:string,idReceiver:string,typeApplication:"proposal" | "join",idActivity:string,descriptionApplication:string})=>{
            const applicationValue=new ApplicationValue({uuid,idSender,idReceiver,typeApplication,idActivity,descriptionApplication});
            const activity=await this.applicationRepository.insertApplication(applicationValue);
            if (!activity) {
                throw new NotFoundError("Application not found");
            }
            return activity;
        }

        public updateApplication=async(uuid:string,{idSender,idReceiver,typeApplication,idActivity,descriptionApplication}:{idSender:string,idReceiver:string,typeApplication:"proposal" | "join",idActivity:string,descriptionApplication:string})=>{
            const applicationValue=new ApplicationValue({uuid,idSender,idReceiver,typeApplication,idActivity,descriptionApplication});
            const application=await this.applicationRepository.updateApplication(uuid,applicationValue);
            if (!application) {
                throw new NotFoundError("Application not found");
            }
            return application;
        }

        public deleteApplication=async(uuid:string)=>{
            const application=await this.applicationRepository.deleteApplication(uuid);
            return application;
        }

        public listApplication=async()=>{
            const listApplication=await this.applicationRepository.listApplication();
            if (!listApplication) {
                throw new NotFoundError("Application not found");
            }
            return listApplication;
        }

        public getApplicationById=async(uuid:string)=>{
            const application = await this.applicationRepository.getApplicationById(uuid);
            if (!application) {
                throw new NotFoundError("Application not found");
            }
            return application;
        }

        public listApplicationPag=async(numPage:string)=>{
            const listApplication=await this.applicationRepository.listApplicationPag(numPage);
            return listApplication;
        }

        public getNumApplications=async()=>{
            const numApplication=await this.applicationRepository.getNumApplications();
            return numApplication;
        }
}
