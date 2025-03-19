import {Router} from "express"
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()


//unsecured routes
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)


//secured routs

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-iser").get(verifyJWT, getCurrentUser)
router.route("/update-Details").patch(verifyJWT, updateAccountDetails)
router.route("/update-Avatar").patch(verifyJWT,upload.single("avatar"), updateUserAvatar)

export default router