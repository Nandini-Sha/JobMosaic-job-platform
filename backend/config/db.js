const mongoose = require('mongoose');//importing mongoose library for database connection


// asynchronous function for database connection
const connectdb = async()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI);//wait and then using environment variable to connect MongoDB Atlas
    console.log('MongoDB connected');
  }catch (error){
    console.error(error);
    process.exit(1);//exit in case error occured
  }
};

module.exports = connectdb; //Exporting function to use in server.js