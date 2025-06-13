import Router from 'express';
import { getCurrentUser, login, setBio, signup, updateProfilePicture } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
const router = Router();

router.post("/signup", signup);
router.post("/login", login);
// router.get("/logout", isAuthenticated, logout);
router.post("/set-bio", isAuthenticated, setBio);
router.post("/update-profile-picture", isAuthenticated, updateProfilePicture);
router.get("/check", isAuthenticated, getCurrentUser);

export default router;