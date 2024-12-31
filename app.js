import express from 'express';
import userRoutes from './routes/user.routes.js'; 
import connectToDB from "./config/db.js";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";
import indexRoutes from "./routes/index.routes.js"
import mainRoutes from "./routes/main.routes.js"
connectToDB();


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use("/",indexRoutes);
app.use('/users', userRoutes);
app.use("/main",mainRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
