import { Schema, model } from "mongoose";
import {v4 as uuid} from "uuid";

const PublicationSchema=new Schema(
    {
        uuid: {
            type: String,
            default:()=>uuid(),
            required:true,
            unique: true,
          },
          idUser:{
            type:Schema.Types.ObjectId,
            ref: 'users',
            required:true,
        },
        likesPublication:{
            type:[Schema.Types.ObjectId],
            ref: 'users',
            required:false,
        },
        textPublication:{
            type:String,
            required:false,
        },
        photoPublication:{
            type:[String],
            required:true,
        },
        commentsPublication:{
            type:[Schema.Types.ObjectId],
            ref: 'comments',
            required:false,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
const PublicationModel=model('publications',PublicationSchema);
export default PublicationModel;
