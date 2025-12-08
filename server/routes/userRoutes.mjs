import { Router } from "express";
import * as userController from "../controllers/userController.mjs";
import * as authController from "../controllers/authController.mjs";
import { validate } from "../middleware/validate.mjs";
import {
  userPatch,
  signupValidation,
  userLogin,
} from "../utils/helpers/validation.mjs";
import { checkSchema } from "express-validator";
import { isAuth } from "../middleware/isUser.mjs";

const router = Router();

router
  .route("/")
  .get(userController.getAllUsers) // ok 
  .post(checkSchema(signupValidation), validate, authController.createUser); // ok 

router.route("/:id").get(userController.getOneUser); // ok 

router
  .route("/me")
  .get( isAuth,(req, res) => {
  console.log('req.user:', req.user);
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.setHeader("Cache-Control", "no-store");
  res.json({ user: req.user });
} )
  .patch(isAuth, checkSchema(userPatch), validate, userController.updateUser) // ok
  .delete(isAuth, userController.deleteUser); // ok

router.route("/login").post(checkSchema(userLogin), validate,  authController.loginUser); // ok 

router.route("/logout").post(isAuth, authController.logoutUser); // ok 

export default router;
