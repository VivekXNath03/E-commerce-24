import express from "express";
import {
  registerController,
    loginController,
    testController,
    forgotPasswordController
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";


//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

router.post("/login",loginController)


router.get("/test" ,requireSignIn, isAdmin ,testController);


router.get('/user-auth' , requireSignIn , (req,res) => {
  res.status(200).send({ok:true });
})

router.get('/admin-auth' , requireSignIn ,isAdmin , (req,res) => {
  res.status(200).send({ok:true });
})


router.post('/forgot-password' , forgotPasswordController);


export default router;