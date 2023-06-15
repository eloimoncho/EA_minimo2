import {  Schema, model, } from "mongoose";
import {v4 as uuid} from "uuid";

const ApplicationSchema=new Schema({
    uuid: {
        type: String,
        default:()=>uuid(),
        required:true,
        unique: true,
    },
    idSender:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required:true,
    },
    idReceiver:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required:true,
    },
    typeApplication:{
        type: String,
        enum:["proposal","join"],
        required: true,
    },
    idActivity:{
        type: Schema.Types.ObjectId,
        ref:'activities',
        required:true,
    },
    descriptionApplication:{
        type: String,
        required:false,
    }
},
{
    timestamps: true,
    versionKey: false,
}
);
const ApplicationModel = model('applications', ApplicationSchema);

export default ApplicationModel;