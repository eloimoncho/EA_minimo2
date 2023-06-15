import { ApplicationController } from './../controller/application.ctrl';
import { ApplicationUseCase } from './../../application/applicationUseCase';
import { Router } from "express";
import { MongoApplicationRepository } from "../repository/mongoApplication.repository";
import { checkJwt } from "../controller/session.ctrl";

const routeApplication=Router();

const applicationRepo=new MongoApplicationRepository();
const applicationUseCase=new ApplicationUseCase(applicationRepo);
const applicationCtrl=new ApplicationController(applicationUseCase);

routeApplication.get("/application/:uuid",checkJwt,applicationCtrl.getApplicationByIdCtrl);//OK
routeApplication.get("/applications/all",checkJwt,applicationCtrl.listApplicationCtrl);//OK
routeApplication.get("/application/paginated/:numPage",checkJwt,applicationCtrl.listApplicationPagCtrl);//OK
routeApplication.get("/application/all/count/docs",checkJwt,applicationCtrl.getNumApplicationsCtrl);//OK

routeApplication.post("/application/add",checkJwt,applicationCtrl.insertApplicationCtrl);//OK

routeApplication.put("/application/:uuid",checkJwt,applicationCtrl.updateApplicationCtrl);//OK

routeApplication.delete("/application/:uuid",checkJwt,applicationCtrl.deleteApplicationCtrl);//OK

export default routeApplication;
