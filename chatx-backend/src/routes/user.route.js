import express from "express";
import {
  searchUserByEmail,
  sendFriendRequest,
  respondToRequest,
  getPendingRequests,
  getSentRequests,
  getMyContacts,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// Apply middleware to all routes
router.use(arcjetProtection, protectRoute);

// Search user by email
router.get("/search", searchUserByEmail);

// Send friend request
router.post("/send-request", sendFriendRequest);

// Respond to friend request (accept/reject)
router.post("/respond-request", respondToRequest);

// Get pending incoming requests
router.get("/requests/pending", getPendingRequests);

// Get sent requests
router.get("/requests/sent", getSentRequests);

// Get my contacts
router.get("/contacts", getMyContacts);

export default router;
