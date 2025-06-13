import Router from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { getMessagesForSelectedUser, getUserforSidebar, markMessageAsSeen, sendMessage } from '../controllers/message.controller.js';

const router = Router();

router.post("/send/:id", isAuthenticated, sendMessage);
router.get("/users", isAuthenticated, getUserforSidebar);
router.get("/:id", isAuthenticated, getMessagesForSelectedUser);
router.put("/mark/:id", isAuthenticated, markMessageAsSeen);

export default router;