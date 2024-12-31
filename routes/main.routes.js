import express from "express";
import cloudinary from "../config/claudinary.js";
import upload from "../middlewares/multer.js";
import fileModel from "../models/files.model.js";
import authuser from "../middlewares/authenticateuser.js";
// import auth from "../middlewares/auths.js";
import generate from "../config/chatwithai.js";

const router = express.Router();

router.get("/uploaddocs", (req, res) => {
    res.render("index2");
});

router.post('/uploaddocs', authuser, upload.single('file'), async function (req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'uploads', 
        });
        // console.log(result);
        
        const { username, email } = req.user;

        const updatedUser = await fileModel.findOneAndUpdate(
            { username, email },
            { $push: { uploads: { url: result.secure_url } } },
            { new: true, upsert: true } 
        );

        res.status(200).json({
            success: true,
            message: "File uploaded and data updated!",
            data: updatedUser, 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error uploading file",
        });
    }
});



router.get('/files', authuser, async (req, res) => {
    const { email } = req.user;

    // console.log('User email:', email); 

    try {
        const user = await fileModel.findOne({ email });

        if (!user || user.uploads.length === 0) {
            return res.status(404).json({ message: 'No files found for this user' });
        }

        // console.log('User files:', user.uploads);

        res.status(200).json({ files: user.uploads });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Error fetching files', error: error.message });
    }
});

router.get('/testyourself', (req,res)=>{
    res.render("chatwithai");
})
router.post('/testyourself', async (req, res) => {
    try {
        const userInput = req.body.text;
        // console.log(`Received user input: ${userInput}`);
    
        const aiResponse = await generate(userInput);
        // console.log(`Generated AI Response: ${aiResponse}`);
    
        res.json({ response: aiResponse });  
      } catch (error) {
        console.error('Error in AI response:', error);
        res.status(500).json({ response: 'An error occurred while generating a response.' });
      }
  });
  

export default router;
