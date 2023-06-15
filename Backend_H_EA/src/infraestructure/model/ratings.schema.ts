import {  Schema, model, } from "mongoose";
import {v4 as uuid} from "uuid";

const RatingsSchema = new Schema({
   
    uuid: {
        type: String,
        default:()=>uuid(),
        required:true,
        unique: true,
    },
    ratingType:{
        type: String,
        enum:["users", "activities", "locations", "comments", "publications"],
        required:true,
    },
    idRatedObject: {
        type: String,
        required: true,
        validate: {
          validator: async function (value: string) {
            const collections = ['users', 'activities', 'locations', 'comments', 'publications'];
            for (const collection of collections) {
              const result = await model(collection).findOne({ _id: value }).exec();
              if (result) {
                return true;
              }
            }
            return false;
          },
        },
    },
    /*
    idRatedObject:{
        type: Schema.Types.ObjectId,
        ref: function () {
            return this.ratingType;
        },
        required:true,
    },
    */
    ratingAverage:{
        type: Number,
        required:true,
    },
    idRaters:{
        type: [Schema.Types.ObjectId],
        ref:'users',
        required:false,
    }
},
{
    timestamps: true,
    versionKey: false,
}
);

const RatingsModel = model('ratings', RatingsSchema);

export default RatingsModel;