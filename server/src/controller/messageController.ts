import { Request, Response } from "express";
import { UserDocument } from "../model/userModel";
import Message from "../model/messageModel";
import cloudinary from "cloudinary"

interface AuthenticatedRequest extends Request {
    user?: UserDocument | undefined;
}

export const getMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    try {
        const user1 = req.user!._id;
        const user2 = req.params.Id;
        if(!user1 || !user2){
            res.status(400).send("both user ids are required")
            return;
        }

        const messages = Message.find({
            $or: [
                {
                    sender: user1,
                    recipient: user2
                },
                {
                    sender: user2,
                    recipient: user1
                }
            ]
        }).sort({timeStamp: 1});


        res.status(400).json({
            messages
        })
        return


    }catch(err){
        console.log(err);
        res.status(500).send("internal server error")
        return;
    }
}


const uploadImage = async (file: Express.Multer.File) => {
    const image = file
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI, {
        quality: "auto",
        fetch_format: "auto",
        timeout:180000
    });
    

    return uploadResponse.url;


}

export const uploadFiles = async (req: Request, res: Response): Promise<void> => {
    try {

        if (!req.file) {
             res.status(400).send("file is required");
             return
            
        }


        const imageUrl = await uploadImage(req.file as Express.Multer.File);
        res.status(200).json({ filePath: imageUrl });
        return;
    } catch (err) {
        console.log({ err });
        res.status(500).send("internal server error");
        return;
    }
};