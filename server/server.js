import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./src/db/index.js";

dotenv.config({
  path: "./.env"
})


const PORT = process.env.PORT || 5001

connectDB()
.then(() => {
  app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`)
  } )
})
.catch((err) => {
  console.log("MngoDB connection error");
  
})


