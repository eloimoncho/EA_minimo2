import { Router } from "express";
import { MongoRatingsRepository } from "../repository/mongoRatings.repository";
import { RatingsUseCase } from "../../application/ratingsUseCase";
import { RatingsController } from "../controller/ratings.ctrl";
import { checkJwt } from "../controller/session.ctrl";

const routeRatings = Router();

const ratingsRepo=new MongoRatingsRepository();
const ratingsUseCase = new RatingsUseCase(ratingsRepo);
const ratingsCtrl = new RatingsController(ratingsUseCase);

// (GET) getAllRatings()
routeRatings.get("/ratings/all",checkJwt,ratingsCtrl.getAllRatingsCtrl); // ¡Verificada!

// (GET) getUsersWhoHaveRated(uuid: string)
routeRatings.get("/rating/getraters/:uuid",checkJwt,ratingsCtrl.getUsersWhoHaveRatedCtrl); // ¡Verificada!

// (GET) getAverageValueRating(idRatedObject: string, ratingType: string)
routeRatings.get("/rating/getaverage/:idRatedObject/:ratingType",checkJwt,ratingsCtrl.getAverageValueRatingCtrl);  // No acaba de ir.

// (GET) getRating(idRatedObject: string, ratingType: string)
routeRatings.get("/rating/get/:idRatedObject/:ratingType",checkJwt,ratingsCtrl.getRatingCtrl); // ¡Verificada!

// (POST) insertRating(data: RatingsEntity)
routeRatings.post("/rating/add",checkJwt,ratingsCtrl.insertRatingCtrl); // ¡Verificada!

// (PUT) updateRating(uuid: string, data: RatingsEntity)
routeRatings.put("/rating/update/:uuid",checkJwt,ratingsCtrl.updateRatingCtrl); // ¡Verificada!

export default routeRatings;