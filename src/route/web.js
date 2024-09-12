import express from "express";
import homeController from "../controller/HomeController";
import userController from "../controller/userController";
import doctorController from '../controller/doctorController';

let router = express.Router();

let initWebRouter = (app) => {
  router.get("/", homeController.getHomepage);
  router.get("/CRUD", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/get-CRUD", homeController.displayGetCRUD);
  router.get("/edit-CRUD", homeController.getEditCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-user", userController.handleGetUser);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/allCode", userController.getAllCode);

  router.get("/api/getTopDoctor", doctorController.getTopDoctor);
  router.get("/api/getAllDoctor", doctorController.getAllDoctor);
  router.post("/api/saveInfoDoctor", doctorController.saveInfoDoctor);
  router.get("/api/get-detail-doctor-by-id", doctorController.getDetailDoctorById);


  return app.use("/", router);
};

module.exports = initWebRouter;
