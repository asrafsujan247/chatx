import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import path from "path";
import { connectDB } from "./lib/db.js";

dotenv.config();


const app = express();

const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../chatx-frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../chatx-frontend", "dist", "index.html")
    );
  });
}

// connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port: " + PORT);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB: ", error);
    process.exit(1);
  });
