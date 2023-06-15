import { CommentEntity } from "../../domain/comment/comment.entity";
import { CommentRepository } from "../../domain/comment/comment.repository";
import CommentModel from "../model/comment.schema";
import PublicationModel from "../model/publication.schema";

export class MongoCommentRepository implements CommentRepository{
    
    async getCommentPublicationByIdPag(uuidPublication:string,numPage:string):Promise<any>{
        const numCommentsPerPage = 2;
        const hop = (parseInt(numPage) - 1) * numCommentsPerPage;
        const responseItem = await CommentModel.find({ idPublicationComment:uuidPublication }).skip(hop).limit(numCommentsPerPage).populate("idUserComment").exec();
        return responseItem;
    }
    
    async insertCommentPublication(data:CommentEntity):Promise<any>{
        const responseInsert = await CommentModel.create(data);
        // Actualizar la propiedad uuid con el valor de response._id
        const updatedData = {
            ...data,
            uuid: responseInsert._id,
        };
        
        // Realizar la actualización en la base de datos
        const response= await CommentModel.updateOne({ _id: responseInsert._id }, updatedData);
        console.log(response);
        const responseItem = await PublicationModel.findOneAndUpdate({ _id: data.idPublicationComment }, { $addToSet: { commentsPublication: responseInsert._id } },{new: true});
        return responseItem;
    }

    async responseComment(uuid:string,data:CommentEntity):Promise<any>{
        const responseInsert = await CommentModel.create(data);
        // Actualizar la propiedad uuid con el valor de response._id
        const updatedData = {
            ...data,
            uuid: responseInsert._id,
        };
        
        // Realizar la actualización en la base de datos
        const response= await CommentModel.updateOne({ _id: responseInsert._id }, updatedData);
        console.log(response);
        const responseItem = await CommentModel.findOneAndUpdate({ _id: uuid }, { $addToSet: { responseComment: responseInsert._id } },{new: true});
        return responseItem;
    }

    async updateCommentPublication(uuid:string,data:CommentEntity):Promise<any>{
        const responseItem = await CommentModel.updateOne({_id: uuid},data,{new: true});
        return responseItem;
    }

    async deleteCommentPublication(uuid:string):Promise<any>{
        const responseItem = await CommentModel.findOneAndRemove({_id: uuid});
        return responseItem;
    }

    async listComment():Promise<any>{
        const responseItem = await CommentModel.find({ })
        return responseItem;
    }

    async getCommentById(uuid:string):Promise<any>{
        const responseItem = await CommentModel.findOne({_id: uuid })
        return responseItem;
    }

    async updateLikes(uuid:string,uuidUser:string):Promise<any>{
        const responseItem = await CommentModel.findOneAndUpdate({_id: uuid}, { $addToSet: { likesComment: uuidUser } } ,{new: true});
        return responseItem;
    }

    async listCommentPag(numPage:string):Promise<any>{
        const numCommentsPerPage = 2;
        const hop = (parseInt(numPage) - 1) * numCommentsPerPage;
        const responseItem = await CommentModel.find({ }).skip(hop).limit(numCommentsPerPage).exec();
        return responseItem;
    }

    async listResponsesPag(uuid:string,numPage:string):Promise<any>{
        const numCommentsPerPage = 2;
        const hop = (parseInt(numPage) - 1) * numCommentsPerPage;
        const originalComment = await CommentModel.findById(uuid);
        if (!originalComment) {
            throw new Error(`Comment with _id=${uuid} not found`);
        }
        const responseCommentIds = originalComment.responseComment;
        if (!responseCommentIds || responseCommentIds.length === 0) {
            return [];
        }
        const responseItem = await CommentModel.find({_id: { $in: responseCommentIds }}).skip(hop).limit(numCommentsPerPage).exec();
        return responseItem;
    }

    async getNumComments():Promise<any>{
        const responseItem = (await CommentModel.countDocuments({})).toString();
        return responseItem;
    }
}
