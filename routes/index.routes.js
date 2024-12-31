import express from "express"
import auth from "../middlewares/auths.js";
import feedbackModel from "../models/feedback.model.js"
import contactModel from "../models/contact.model.js";
const router=express.Router();

router.get("/",(req,res)=>{
    res.render("index");
});


router.get("/features",(req,res)=>{
    res.render("features");
})
router.get("/testimonials",(req,res)=>{
    res.render("testimonials");
})
router.get("/call-to-action",(req,res)=>{
    res.render("call-to-action");
})

router.get("/feedback",(req,res)=>{
    res.render("feedback");
})

router.post("/feedback",async (req,res)=>{
    const {name,email,feedback}= req.body;
    console.log(name,email,feedback);
    
    const feed=await feedbackModel.create({
        username:name,
        email,
        feedback
    });
    res.redirect("/");
})

router.get("/contact",(req,res)=>{
    res.render("contact");
})

router.post("/contact",async (req,res)=>{
    const {username,email,message}= req.body;
    console.log(username,email,message);
    
    const mess=await contactModel.create({
        username,
        email,
        message
    });
    res.redirect("/");
})

export default router;