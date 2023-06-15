import {  Schema, model, } from "mongoose";
import {v4 as uuid} from "uuid";

const CommentSchema = new Schema(
    {
        uuid: {
            type: String,
            default:()=>uuid(),
            required:true,
            unique: true,
          },
        idUserComment:{
            type: Schema.Types.ObjectId,
            ref:'users',
            required:true,
        },
        idPublicationComment:{
            type: Schema.Types.ObjectId,
            ref:'publications',
            required:false,
        },
        textComment:{
            type: String,
            required:true,
        },
        likesComment:{
            type: [Schema.Types.ObjectId],
            ref:'users',
            required:false,
        },
        responseComment:{
            type: [Schema.Types.ObjectId],
            ref:'comments',
            required:false,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
const CommentModel = model('comments', CommentSchema);

export default CommentModel;
