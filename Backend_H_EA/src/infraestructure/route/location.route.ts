import { LocationUseCase } from './../../application/locationUseCase';
import { Router } from "express";
import { LocationController } from '../controller/location.ctrl';
import { MongoLocationRepository } from '../repository/mongoLocation.repository';
import { checkAdmin } from '../controller/session.ctrl';
import { logMiddleware } from '../controller/login.ctrl';
import { checkJwt } from "../controller/session.ctrl";

const locationRoute = Router();

const locationRepo=new MongoLocationRepository();
const locationUseCase = new LocationUseCase(locationRepo);
const locationCtrl = new LocationController(locationUseCase);

locationRoute.get("/location/:uuid",checkJwt,locationCtrl.getLocationByIdCtrl);//Ok
locationRoute.get("/locations/all",logMiddleware,locationCtrl.listLocationCtrl);//Ok
locationRoute.get("/location/all/:numPage",checkJwt,locationCtrl.listLocationPagCtrl);//Ok
locationRoute.get("/location/all/count/docs",checkJwt,locationCtrl.getNumLocationsCtrl);//ok

locationRoute.put("/location/:uuid",checkJwt,locationCtrl.updateLocationCtrl);//ok

locationRoute.post('/location/add',checkJwt,locationCtrl.insertLocationCtrl);//Ok

locationRoute.delete("/location/:uuid",checkAdmin,locationCtrl.deleteLocationCtrl);//Ok

export default locationRoute;
