import { Router } from "express"
import { createUser, findUserByPhoneNumber, loginUser, updateContactDetails, updatePassword, updateProfilePicture } from "../controllers/user-contollers.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = Router();


router.post("/auth-signup", createUser)
router.post("/auth-login", loginUser)
router.put("/auth/change-password", checkAuth ,updatePassword)
router.put("/update/profile-url", checkAuth ,updateProfilePicture)
router.put("/update/contact-details", checkAuth ,updateContactDetails)
router.get("/users/phone/:phoneNumber",findUserByPhoneNumber)


export default router