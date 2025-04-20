import express from 'express';
import cors from 'cors';
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

export {app};