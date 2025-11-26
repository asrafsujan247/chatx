import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

// Get all contacts (only users in the logged-in user's contacts list)
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find the logged-in user and populate their contacts
    const user = await User.findById(loggedInUserId).populate(
      "contacts",
      "-password"
    );

    // Return only the user's contacts
    res.status(200).json(user.contacts || []);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get messages by user id
export const getMessagesByUserId = async (req, res) => {
  try {
    // get my id and user to chat id
    const myId = req.user._id;
    const { id: userToChatId } = req.params;
    // fetch messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    // return messages
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessagesByUserId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send message to user by id
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // validations
    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    // Check if receiver is in sender's contacts
    const sender = await User.findById(senderId);
    const isContact = sender.contacts.some(
      (contactId) => contactId.toString() === receiverId.toString()
    );

    if (!isContact) {
      return res.status(403).json({
        message:
          "You can only send messages to your contacts. Please add this user first.",
      });
    }

    let imageUrl;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    // create new message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    // send message to the receiver in real-time
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);

      // Also emit message notification
      io.to(receiverSocketId).emit("messageNotification", {
        messageId: newMessage._id,
        senderId: senderId,
        senderName: req.user.fullName,
        text: newMessage.text,
        image: newMessage.image,
        timestamp: newMessage.createdAt,
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// getChatPartners (only return chat partners who are in contacts)
export const getChatPartners = async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    // Get user's contacts
    const user = await User.findById(loggedInUser);
    const contactIds = user.contacts.map((id) => id.toString());

    // find the messages where the logged-in user is either the sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUser }, { receiverId: loggedInUser }],
    });

    // extract unique chat partner ids
    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUser.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    // Filter to only include contacts
    const filteredChatPartnerIds = chatPartnerIds.filter((id) =>
      contactIds.includes(id)
    );

    // fetch user details of chat partners
    const chatPartners = await User.find({
      _id: { $in: filteredChatPartnerIds },
    }).select("-password");

    // return chat partners
    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("Error in getChatPartners:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
