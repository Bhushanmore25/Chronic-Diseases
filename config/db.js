import mongoose  from 'mongoose';
import dotenv from "dotenv";
dotenv.config();
function connectToDB() {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Connected to DB!");        
    })
}
export default connectToDB;