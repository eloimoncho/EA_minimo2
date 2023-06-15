import { ActivityValue } from '../domain/activity/activity.value';
import { ActivityRepository } from './../domain/activity/activity.repository';
import { NotFoundError } from "./notFoundError";

export class ActivityUseCase{
    constructor(private readonly activityRepository:ActivityRepository){}

    public getActivitiesByLocation=async(idLocation: string)=>{
        const activities = await this.activityRepository.listActivity();
        if (!activities) {
            throw new NotFoundError("There are no activities.");
        }
        else{
            const activitiesByLocation = activities.filter(activity => activity.idLocation?.toString() === idLocation.toString());
            if (!activitiesByLocation){
                throw new NotFoundError("There are no activities in this location.");
            }
            else {
                return activitiesByLocation;
            }
        }
    }

    public getActivityById=async(uuid:string)=>{
        const activity = await this.activityRepository.getActivityById(uuid);
        if (!activity) {
            throw new NotFoundError("Activity not found");
        }
        return activity;
    }

    public listActivity=async()=>{
        const listActivity=await this.activityRepository.listActivity();
        if (!listActivity) {
            throw new NotFoundError("Activity not found");
        }
        return listActivity;
    }

    public updateActivity=async(uuid:string,{nameActivity,creatorActivity,participantsActivity,publicationActivity,dateActivity,hoursActivity,idLocation,descriptionActivity,privacyActivity,roleActivity}:{nameActivity:string,creatorActivity:string,participantsActivity:[string],publicationActivity:[string],dateActivity:Date,hoursActivity:[string],idLocation:string,descriptionActivity:string,privacyActivity:boolean,roleActivity:"verificado" | "common" | "empresa"})=>{
        const activityValue=new ActivityValue({uuid,nameActivity,creatorActivity,participantsActivity,publicationActivity,dateActivity,hoursActivity,idLocation,descriptionActivity,privacyActivity,roleActivity});
        const activity=await this.activityRepository.updateActivity(uuid,activityValue);
        if (!activity) {
            throw new NotFoundError("Activity not found");
        }
        return activity;
    }

    public deleteActivity=async(uuid:string)=>{
        const activity=await this.activityRepository.deleteActivity(uuid);
        return activity;
    }

    public insertActivity=async({uuid,nameActivity,creatorActivity,participantsActivity,publicationActivity,dateActivity,hoursActivity,idLocation,descriptionActivity,privacyActivity,roleActivity}:{uuid:string,nameActivity:string,creatorActivity:string,participantsActivity:[string],publicationActivity:[string],dateActivity:Date,hoursActivity:[string],idLocation:string,descriptionActivity:string,privacyActivity:boolean,roleActivity:"verificado" | "common" | "empresa"})=>{
        const activityValue=new ActivityValue({uuid,nameActivity,creatorActivity,participantsActivity,publicationActivity,dateActivity,hoursActivity,idLocation,descriptionActivity,privacyActivity,roleActivity});
        const activity=await this.activityRepository.insertActivity(activityValue);
        if (!activity) {
            throw new NotFoundError("Activity not found");
        }
        return activity;
    }

    public listActivityPag=async(numPage:string)=>{
        const listActivity=await this.activityRepository.listActivityPag(numPage);
        return listActivity;
    }

    public getNumActivity=async()=>{
        const numActivity=await this.activityRepository.getNumActivity();
        return numActivity;
    }

    public getParticipantsOfActivity=async(uuid:string,numPage:string)=>{
        const participants=await this.activityRepository.getParticipantsOfActivity(uuid,numPage);
        return participants;
    }

    public getActivitiesByUserAndWeek=async(uuid: string, startDate: Date)=>{
        const activities=await this.activityRepository.getActivitiesByUserAndWeek(uuid,startDate);
        return activities;
    }

    public getFollowedUsersActivities=async(uuid: string, page: string, startDate: Date)=>{
        const activities=await this.activityRepository.getFollowedUsersActivities(uuid,page,startDate);
        return activities;
    }

}
