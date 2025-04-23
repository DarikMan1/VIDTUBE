import { Router } from "express";
import { 
    verifyJWT,
    registerUser,
    logoutUser,
    loginUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    getUserChannelProfile, 
    updateAccountDetails, 
    updateUserCoverImage, 
    updateUserAvatar, 
    getWathcHistory } from "../controllers/user.controllers.js";
import { uploadFields } from "../middlewares/multer.middlewares.js";  // Import uploadFields middleware
import { verifyJWT } from "../middlewares/auth.middlewares.js";  // Import JWT verification middleware
import { verify } from "jsonwebtoken";
const router = Router();

// Route to handle user registration
router.route("/register").post(uploadFields, registerUser);  // Handle file upload and user registration

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken)
//secure routes
router.route("/change-password").post(verifyJWT,
    changeCurrentPassword
)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/c/:username").get(verifyJWT,
    getUserChannelProfile
)
router.route("update-account").patch(verifyJWT,
    updateAccountDetails
)
router.route("/avater").patch(verifyJWT,uploadFields.single("avatar"),updateUserAvatar) // Handle file upload for avatar
router.route("/cover-image").patch(verifyJWT,uploadFields.single("coverImage"),updateUserCoverImage)
router.route("/history").get(verifyJWT,getWathcHistory)

router.route("/logout").post(verifyJWT,logoutUser)
export default router;
