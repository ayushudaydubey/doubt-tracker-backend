import mongoose from 'mongoose';

export const connectDB  =  async () => {
   mongoose.connect(process.env.MONGO_DB_URL)
   .then(()=>{
    console.log("DB Connected ");
    
   })
   .catch((err)=>{
    console.log("ERROR in DB",err);
    
   })
}
