import { ActivityEntity } from "../../domain/activity/activity.entity";
import { ActivityRepository } from "../../domain/activity/activity.repository";
import ActivityModel from "../model/activity.schema";
import UserModel from "../model/user.schema";
import { ObjectId } from 'mongodb';

export class MongoActivityRepository implements ActivityRepository{

    async getActivitiesByLocation(locationId: string): Promise<any> {
        const responseItems = await ActivityModel.find({ idLocation: locationId });
        return responseItems;
    }

    async getActivityById(uuid: string): Promise<any> {
        const responseItem = await ActivityModel.findOne({_id: uuid })
        return responseItem;
    }

    async listActivity(): Promise<any> {
        const responseItem = await ActivityModel.find({ })
        return responseItem;
    }

    async listActivityPag(numPage: string): Promise<any> {
        const numActivityPerPage = 2;
        const hop = (parseInt(numPage) - 1) * numActivityPerPage;
        const responseItem = await ActivityModel.find({ }).skip(hop).limit(numActivityPerPage).exec();
        return responseItem;
    }

    async insertActivity(data: ActivityEntity): Promise<any> {
        
        const item=await ActivityModel.create(data);

        // Actualizar la propiedad uuid con el valor de response._id
        const updatedData = {
            ...data,
            uuid: item._id,
        };
        // Realizar la actualización en la base de datos
        const activity= await ActivityModel.updateOne({ _id: item._id }, updatedData);
        
        return activity;
    }

    async updateActivity(uuid: string, data: ActivityEntity): Promise<any> {
        const responseItem = await ActivityModel.updateOne({_id: uuid},data,{new: true});
        return responseItem;
    }

    async deleteActivity(uuid: string): Promise<any> {
        const responseItem = await ActivityModel.findOneAndRemove({_id: uuid});
        return responseItem;
    }

    async getNumActivity(): Promise<any> {
        const responseItem = (await ActivityModel.countDocuments({})).toString();
        return responseItem;
    }

    async getParticipantsOfActivity(uuid: string, numPage: string): Promise<any> {
        const activitiesPerPage = 2;
        const hop = (parseInt(numPage) - 1) * activitiesPerPage;
        const activity = await ActivityModel.findById(uuid);
        if (!activity) {
        
        throw new Error(`Activity with _id=${uuid} not found`);
        }
        const responseParticipantIds = activity.participantsActivity;
        if (!responseParticipantIds || responseParticipantIds.length === 0) {
        
        return [];
        }
        const responseItem = await UserModel.find({_id: { $in: responseParticipantIds }}).skip(hop).limit(activitiesPerPage).exec();
        return responseItem;
    }

    async getActivitiesByUserAndWeek(uuid: string, startDate: Date): Promise<any> {
        const startOfWeek = new Date(startDate);
        const dayOfWeek = startDate.getDay();
        console.log("dayofWeek", dayOfWeek);
        // Ajustar el día de la semana
        const adjustedDayOfWeek = (dayOfWeek + 6) % 7; // Convertir domingo (0) a 6 y desplazar los demás días

        // Obtener el primer día (lunes) de la semana
        startOfWeek.setDate(startOfWeek.getDate() - adjustedDayOfWeek + 1);
        console.log("start of week", startOfWeek);

        // Obtener el último día (domingo) de la semana
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        console.log("end of week",endOfWeek);
        const activities = await ActivityModel.find({ participantsActivity: uuid }).exec();
        const activitiesOfWeek = activities.filter((activity) =>
            activity.dateActivity >= startOfWeek &&
            activity.dateActivity <= endOfWeek
        );
        console.log("myactivities",activitiesOfWeek)
        return activitiesOfWeek;
    }

    async getFollowedUsersActivities(currentUserId:string, page: string, startDate: Date): Promise<any> {
        // Obtener los IDs de los usuarios seguidos
        console.log(currentUserId, page, startDate);
        const user = await UserModel.findById(currentUserId).exec();
        if (!user) {
            return [];
        }
        const followedUserIds = user.followedUser;
         if (!followedUserIds || followedUserIds.length === 0) {
         return [];
        }

        const startOfWeek = new Date(startDate);
        const dayOfWeek = startDate.getDay();
        // Ajustar el día de la semana
        const adjustedDayOfWeek = (dayOfWeek + 6) % 7; // Convertir domingo (0) a 6 y desplazar los demás días
        startOfWeek.setDate(startOfWeek.getDate() - adjustedDayOfWeek + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        const pageSize = 1; // Tamaño de página fijo
        const numPage = parseInt(page, 10);
        const startIndex = (numPage -1) * pageSize;
        const endIndex = startIndex + pageSize;
      

        const activitiesByUser: { uuid: string; activities: any[] }[] = [];
    
        // Obtener las actividades de los usuarios seguidos
        for (let i = 0; i < followedUserIds.length; i++) {
            const followedUserId = followedUserIds[i];
            const activities = await ActivityModel.find({ participantsActivity: followedUserId }).exec();
            const filteredActivities = activities.filter((activity) => {
                return activity.dateActivity >= startOfWeek && activity.dateActivity <= endOfWeek;
            });

            activitiesByUser.push({
                uuid: followedUserId.toString(),
                activities: filteredActivities,
            });

        }
      
        return activitiesByUser[startIndex];
    }
}
