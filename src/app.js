import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler} from './middlewares/error.middlewares.js';

const app = express();
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        Credentials: true
    })
)
// common middlewares
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(cookieParser())
//import routes
import healthcheckRoute from './routes/healthcheck.route.js';
import userRouter from './routes/user.routes.js';

//routes
app.use("/api/v1/healthcheck",healthcheckRoute)
app.use("/api/v1/users",userRouter)
app.use(errorHandler);

export {app}; 