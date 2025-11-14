import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// the middlewares execute in order - so requests get rate-limited first, then authenticated
// this is actually more efficient since unauthenticated requests get blocked by rate limiting before hitting the auth middleware.

router.use(arcjetProtection, protectRoute);

// Get all contacts
router.get("/contacts", getAllContacts);
// Get chat partners
router.get("/chats", getChatPartners);
// get messages by user id
router.get("/:id", getMessagesByUserId);
// send message to user by id
router.post("/send/:id", sendMessage);

export default router;
