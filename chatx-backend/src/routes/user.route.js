import express from "express";
import {
  searchUserByEmail,
  addContact,
  getMyContacts,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// Apply middleware to all routes
router.use(arcjetProtection, protectRoute);

// Search user by email
router.get("/search", searchUserByEmail);

// Add contact
router.post("/add-contact", addContact);

// Get my contacts
router.get("/contacts", getMyContacts);

export default router;
