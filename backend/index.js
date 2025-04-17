const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const connectDatabase = require("./config/connection")
const PORT = 8080;
const cors = require("cors")

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

connectDatabase();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());

const userRoutes = require('./routes/userRoutes');
const electionRoutes = require('./routes/electionRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
// const voteRoutes = require('./routes/voteRoutes');

app.use('/api/user', userRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/candidates', candidateRoutes);
// app.use('/api/vote', voteRoutes);

app.get("/", (req,res)=>{
    res.status(201).json({
        success: true,
        msg: "Hello from another side"
    })
})

app.listen(PORT, () => console.log("Server running on ", PORT));