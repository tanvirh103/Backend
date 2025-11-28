import dotenv from 'dotenv';
import { app } from './app';
import mongoose from 'mongoose';

dotenv.config();
const PORT = process.env.PORT || 3000;
app.listen(PORT,async()=>{
    console.log(`Server is running on port ${PORT}`);
    try{
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("Database connected successfully");
    }catch(error){
        console.error(error);
    }
});
