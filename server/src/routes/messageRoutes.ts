import express from "express"
import multer from "multer"
import { protect } from "../middleware/userMiddleware";
import { getMessages, uploadFiles } from "../controller/messageController";






const messagesRoutes = express.Router()
const storage = multer.memoryStorage();


const upload = multer({
    storage, limits: {
        fileSize: 5 * 1024 * 1024
    }
});

messagesRoutes.get("/get-user-messages/:id", protect, getMessages);

messagesRoutes.post("/upload", protect, upload.single('file'), uploadFiles)


export default messagesRoutes;

