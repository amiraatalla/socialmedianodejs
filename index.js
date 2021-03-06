const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

//connect with mongoDB Database
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB is coonnected successfully");
}).catch((err) => {
    console.log(err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Connected to ${port} Succssfully`);
})