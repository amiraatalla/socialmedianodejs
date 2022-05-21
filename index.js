const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth.js');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

//All API Routes
app.use("/api/auth", authRoute);

//connect with mongoDB Database
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB is connected successfully");
}).catch((err) => {
    console.log(err);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Connected to ${PORT} Succssfully`);
})