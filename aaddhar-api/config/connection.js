const mongoose = require("mongoose");
require('dotenv').config();

console.log("url ", process.env.DATABASE_URL)

const connectDatabase = ()=>{
    try{
        mongoose.connect(process.env.DATABASE_URL)
        .then((data)=>{
            console.log("Connection Successful to Database");
        })
    }
    catch (error) {
        console.log('there is error in database connection');
        console.log(error);
        
    }
} 

module.exports = connectDatabase;