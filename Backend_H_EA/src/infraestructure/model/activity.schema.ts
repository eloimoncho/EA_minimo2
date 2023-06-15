import {  Schema, model, } from "mongoose";
import {v4 as uuid} from "uuid";

const ActivitySchema = new Schema({
    
    uuid: {
        type: String,
        default:()=>uuid(),
        required:true,
        unique: true,
    },
    nameActivity:{
        type: String,
        required:true,
    },
    creatorActivity:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required: true,
    },
    participantsActivity:{
        type: [Schema.Types.ObjectId],
        ref: 'users',
        required: true,
    },
    publicationActivity:{
        type: [Schema.Types.ObjectId],
        required:false,
    },
    dateActivity:{
        type: Schema.Types.Date,
        required: true,
    },
    hoursActivity:{
        type: [String],
        required: true,
    },
    idLocation:{
        type: Schema.Types.ObjectId,
        ref:'locations',
        required:false,
    },
    descriptionActivity:{
        type: String,
        required: false,
    },
    privacyActivity:{
        type: Boolean,
        required:true,
    },
    roleActivity:{
        type: String,
        enum:["verificado","common", "empresa"],
        required:true,
    }
},
{
    timestamps: true,
    versionKey: false,
}
);
const ActivityModel = model('activities', ActivitySchema);

export default ActivityModel;