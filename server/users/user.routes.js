import { Router } from "express";
import * as userController from "./user.controller.js";
import upload from './uploadMiddleware.js';

const router = Router();

router.get("/", userController.getUsers);
router.post("/register", userController.userRegister);
router.post("/login", userController.loginuser);
router.put("/update",userController.udpassword);
router.delete("/delete/:user_id", userController.deleteUser);
router.get("/profile/:email", userController.getUserProfile);
router.put('/profile/update/:email', upload.single('avatar'), userController.updateUserProfile);

export default router;


