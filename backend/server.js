require("dotenv").config();
const express = require('express');
const app = express();
const connectDb = require('./utils/db');
const authRoute = require("./routers/authRouter");
const visitorRoute = require("./routers/visitorRouter");
const roomsRoute = require("./routers/roomsRouter");
const cors = require('cors');
const morgan = require('morgan');

const corsOptions = {
    // origin: 'http://localhost:5173' || 'https://mern-project-server-egcj.onrender.com',
    origin:'*',
    methods: 'GET, POST, PUT, DELETE, PATCH, HEAD',
    credentials:true
}
app.use(morgan('dev'));
app.use(cors(corsOptions));
  
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello Worlda');
});

app.use("/api/auth", authRoute);
app.use("/api/visitor", visitorRoute);
app.use("/api/rooms", roomsRoute);
const PORT = 5000;
connectDb().then(() =>{
    app.listen(PORT, ()=>{
    console.log("server is running on port 5000"); 
});
}); 

// mongodb+srv://visiterDB:dbUserPassword@version1.nfho4.mongodb.net/?retryWrites=true&w=majority&appName=Version1