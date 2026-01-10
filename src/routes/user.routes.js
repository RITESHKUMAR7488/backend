import { Router } from "express";
import { logoutUser, registerUser,refreshAccessToken } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";



const router = Router();

router.route("/register").post
    (
        upload.fields([
            {
            name: "avatar",
             maxCount:1
            },
            {
                name: "coverImage",
                maxCount:1
            }
            
        ]),
        registerUser
    )

router.route("/login").post(loginUser)

// secure routes
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/refresh-token").post()





export  default router;