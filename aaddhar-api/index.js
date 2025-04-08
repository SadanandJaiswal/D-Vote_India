const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const connectDatabase = require("./config/connection")
const PORT = 8000;

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

connectDatabase();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream: accessLogStream }));

const aadhaarRoutes = require("./routes/aadhaarRoutes");
app.use("/api/aadhaar", aadhaarRoutes);

const otpRoutes = require("./routes/otpRoutes");
app.use("/api/otp", otpRoutes);


app.get("/", (req,res)=>{
    res.status(201).json({
        success: true,
        msg: "Hello from another side"
    })
})

app.listen(PORT, () => console.log("Server running on ", PORT));