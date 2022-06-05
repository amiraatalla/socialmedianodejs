const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const userRoute = require('./routes/user');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());


const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Social media REST API',
            description: "A REST API built with Express and MongoDB. This API help user to add , delete , update , list , like,and unlike posts , list friends list , follow and un follow people, register and login."
        },
    },
    apis: ["./routes/auth.js","./routes/user.js","./routes/posts.js"]
}







//All API Routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/user", userRoute);


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


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