import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { uploadFields } from "../middlewares/multer.middlewares.js";  // Import uploadFields middleware

const router = Router();

// Route to handle user registration
router.route("/register").post(uploadFields, registerUser);  // Handle file upload and user registration

export default router;
