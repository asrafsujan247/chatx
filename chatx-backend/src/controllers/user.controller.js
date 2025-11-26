import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

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
      email: email.toLowerCase(),
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't allow users to search for themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot add yourself as a contact" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in searchUserByEmail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const senderId = req.user._id;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user to send request to
    const receiver = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent sending request to yourself
    if (receiver._id.toString() === senderId.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });
    }

    // Check if already friends
    const sender = await User.findById(senderId);
    const isAlreadyFriend = sender.contacts.some(
      (contactId) => contactId.toString() === receiver._id.toString()
    );

    if (isAlreadyFriend) {
      return res
        .status(400)
        .json({ message: "Already friends with this user" });
    }

    // Check for existing request (either direction)
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiver._id },
        { sender: receiver._id, receiver: senderId },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res
          .status(400)
          .json({ message: "Friend request already exists" });
      }
      // If rejected, allow sending again by updating the existing request
      if (existingRequest.status === "rejected") {
        existingRequest.status = "pending";
        existingRequest.sender = senderId;
        existingRequest.receiver = receiver._id;
        await existingRequest.save();

        // Emit real-time notification
        const receiverSocketId = getReceiverSocketId(receiver._id.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("friendRequest", {
            requestId: existingRequest._id,
            sender: {
              _id: sender._id,
              fullName: sender.fullName,
              email: sender.email,
              profilePic: sender.profilePic,
            },
          });
        }

        return res.status(200).json({
          message: "Friend request sent",
          request: existingRequest,
        });
      }
    }

    // Create new friend request
    const friendRequest = new FriendRequest({
      sender: senderId,
      receiver: receiver._id,
      status: "pending",
    });

    await friendRequest.save();

    // Emit real-time notification to receiver
    const receiverSocketId = getReceiverSocketId(receiver._id.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequest", {
        requestId: friendRequest._id,
        sender: {
          _id: sender._id,
          fullName: sender.fullName,
          email: sender.email,
          profilePic: sender.profilePic,
        },
      });
    }

    res.status(200).json({
      message: "Friend request sent successfully",
      request: friendRequest,
    });
  } catch (error) {
    console.log("Error in sendFriendRequest:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Respond to friend request (accept/reject)
export const respondToRequest = async (req, res) => {
  try {
    const { requestId, accept } = req.body;
    const userId = req.user._id;

    if (!requestId || accept === undefined) {
      return res
        .status(400)
        .json({ message: "Request ID and accept status required" });
    }

    // Find the request
    const request = await FriendRequest.findById(requestId)
      .populate("sender", "-password")
      .populate("receiver", "-password");

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify user is the receiver
    if (request.receiver._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to respond to this request" });
    }

    // Check if already responded
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already responded to" });
    }

    if (accept) {
      // Accept request
      request.status = "accepted";
      await request.save();

      // Add both users to each other's contacts
      await User.findByIdAndUpdate(request.sender._id, {
        $addToSet: { contacts: request.receiver._id },
      });
      await User.findByIdAndUpdate(request.receiver._id, {
        $addToSet: { contacts: request.sender._id },
      });

      // Emit real-time notification to sender
      const senderSocketId = getReceiverSocketId(request.sender._id.toString());
      if (senderSocketId) {
        io.to(senderSocketId).emit("requestResponse", {
          requestId: request._id,
          status: "accepted",
          user: {
            _id: request.receiver._id,
            fullName: request.receiver.fullName,
            email: request.receiver.email,
            profilePic: request.receiver.profilePic,
          },
        });
      }

      res.status(200).json({
        message: "Friend request accepted",
        request,
        contact: request.sender,
      });
    } else {
      // Reject request
      request.status = "rejected";
      await request.save();

      // Emit real-time notification to sender
      const senderSocketId = getReceiverSocketId(request.sender._id.toString());
      if (senderSocketId) {
        io.to(senderSocketId).emit("requestResponse", {
          requestId: request._id,
          status: "rejected",
          user: {
            _id: request.receiver._id,
            fullName: request.receiver.fullName,
            email: request.receiver.email,
            profilePic: request.receiver.profilePic,
          },
        });
      }

      res.status(200).json({
        message: "Friend request rejected",
        request,
      });
    }
  } catch (error) {
    console.log("Error in respondToRequest:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get pending incoming requests
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.log("Error in getPendingRequests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get sent requests
export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await FriendRequest.find({
      sender: userId,
      status: "pending",
    })
      .populate("receiver", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.log("Error in getSentRequests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get my contacts
export const getMyContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find user and populate contacts
    const user = await User.findById(loggedInUserId).populate(
      "contacts",
      "-password"
    );

    res.status(200).json(user.contacts || []);
  } catch (error) {
    console.log("Error in getMyContacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
