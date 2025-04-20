import {app} from './app.js';
import connectDB from './db/index.js';

connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch(err=>console.log("MongoDB Connection Error",err));
import dotenv from 'dotenv';
dotenv.config({path:'./config.env'});

const PORT = process.env.PORT || 5000;
