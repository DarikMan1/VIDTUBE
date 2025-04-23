import { Router } from "express";
import { registerUser,logoutUser } from "../controllers/user.controllers.js";
import { uploadFields } from "../middlewares/multer.middlewares.js";  // Import uploadFields middleware
import { verifyJWT } from "../middlewares/auth.middlewares.js";  // Import JWT verification middleware
import { verify } from "jsonwebtoken";
const router = Router();

// Route to handle user registration
router.route("/register").post(uploadFields, registerUser);  // Handle file upload and user registration
//secure routes

router.route("/logout").post(verifyJWT,logoutUser)
export default router;
