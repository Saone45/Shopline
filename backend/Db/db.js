 import mongoose from "mongoose";

 export const connectToDB = async () =>{
     try {
        
        // connect to database -->
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅MongoDb Connected Successfully')
        
     } catch (error) {
       console.error('❌MongoDb Connection Faild',error);
       process.exit(1);
     }
 };
