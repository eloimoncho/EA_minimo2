import { Router } from "express";
import { MongoCommentRepository } from "../repository/mongoComment.repository";
import { CommentUseCase } from "../../application/commentUseCase";
import { CommentController } from "../controller/comment.ctrl";
import { checkJwt } from "../controller/session.ctrl";

const routeComment=Router();

const commentRepo=new MongoCommentRepository();
const commentUseCase = new CommentUseCase(commentRepo)
const commentCtrl = new CommentController(commentUseCase)

routeComment.get("/comment/publication/by/paginated/:uuidPublication/:numPage",checkJwt,commentCtrl.getCommentPublicationByIdPagCtrl);//Ok
routeComment.get("/comment/response/:uuid",checkJwt,commentCtrl.responseCommentCtrl);//OK
routeComment.get("/comments/all",checkJwt,commentCtrl.listCommentCtrl);//OK
routeComment.get("/comment/comment/id/:uuid",checkJwt,commentCtrl.getCommentByIdCtrl);//Ok
routeComment.get("/comment/paginated/page/num/:numPage",checkJwt,commentCtrl.listCommentPagCtrl);//Ok
routeComment.get("/commentresponses/list/responses/:uuid/:numPage",checkJwt,commentCtrl.listResponsesPagCtrl);//Ok
routeComment.get("/comment/number",checkJwt,commentCtrl.getNumCommentsCtrl);//ok


routeComment.post("/comment/add",checkJwt,commentCtrl.insertCommentPublicationCtrl);//OK
routeComment.post("/comment/response/:uuid",checkJwt,commentCtrl.responseCommentCtrl);//To fix

routeComment.put("/comment/:uuid",checkJwt,commentCtrl.updateCommentPublicationCtrl);//Ok
routeComment.put("/comment/likes/:uuid/:uuidUser",checkJwt,commentCtrl.updateLikesCtrl);//ok

routeComment.delete("/comment/:uuid",checkJwt,commentCtrl.deleteCommentPublicationCtrl);//Ok

export default routeComment;
