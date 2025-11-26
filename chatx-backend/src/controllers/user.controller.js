import User from "../models/User.js";

// Search user by email
export const searchUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Search for user by email (case-insensitive)
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't allow users to search for themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot add yourself as a contact" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in searchUserByEmail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add contact
export const addContact = async (req, res) => {
  try {
    const { email } = req.body;
    const loggedInUserId = req.user._id;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user to add
    const userToAdd = await User.findOne({ 
      email: email.toLowerCase() 
    });

    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent adding yourself
    if (userToAdd._id.toString() === loggedInUserId.toString()) {
      return res.status(400).json({ message: "Cannot add yourself as a contact" });
    }

    // Check if already in contacts
    const loggedInUser = await User.findById(loggedInUserId);
    const isAlreadyContact = loggedInUser.contacts.some(
      (contactId) => contactId.toString() === userToAdd._id.toString()
    );

    if (isAlreadyContact) {
      return res.status(400).json({ message: "User is already in your contacts" });
    }

    // Add to contacts
    loggedInUser.contacts.push(userToAdd._id);
    await loggedInUser.save();

    // Return the added contact (without password)
    const addedContact = await User.findById(userToAdd._id).select("-password");

    res.status(200).json({
      message: "Contact added successfully",
      contact: addedContact,
    });
  } catch (error) {
    console.log("Error in addContact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get my contacts
export const getMyContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find user and populate contacts
    const user = await User.findById(loggedInUserId)
      .populate("contacts", "-password");

    res.status(200).json(user.contacts || []);
  } catch (error) {
    console.log("Error in getMyContacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
