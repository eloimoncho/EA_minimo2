import { Router } from "express";
import { MongoActivityRepository } from "../repository/mongoActivity.repository";
import { ActivityUseCase } from "../../application/activityUseCase";
import { ActivityController } from "../controller/activity.ctrl";
import { checkJwt } from "../controller/session.ctrl";

const routeActivity=Router();

const activityRepo=new MongoActivityRepository();
const activityUseCase = new ActivityUseCase(activityRepo)
const activityCtrl = new ActivityController(activityUseCase)

routeActivity.get("/activity/:uuid",checkJwt,activityCtrl.getActivityByIdCtrl);//OK
routeActivity.get("/activities/all",checkJwt,activityCtrl.listActivityCtrl);//OK
routeActivity.get("/activity/paginated/:numPage",checkJwt,activityCtrl.listActivityPagCtrl);//OK
routeActivity.get("/activity/all/participants/:uuid/:numPage",checkJwt,activityCtrl.getParticipantsOfActivityCtrl);//NO ok
routeActivity.get("/activity/all/count/docs",checkJwt,activityCtrl.getNumActivityCtrl);//OK
routeActivity.get("/activity/myweek/:uuid/:date",checkJwt,activityCtrl.getActivitiesByUserAndWeekCtrl);
routeActivity.get("/activity/following/:uuid/:numPage/:date",checkJwt,activityCtrl.getFollowedUsersActivitiesCtrl);

routeActivity.post("/activity/add",checkJwt,activityCtrl.insertActivityCtrl);//OK

routeActivity.put("/activity/:uuid",checkJwt,activityCtrl.updateActivityCtrl);//OK

routeActivity.delete("/activity/:uuid",checkJwt,activityCtrl.deleteActivityCtrl);//OK

routeActivity.get("/activities/bylocation/:locationId",checkJwt,activityCtrl.getActivitiesByLocationCtrl);

export default routeActivity;