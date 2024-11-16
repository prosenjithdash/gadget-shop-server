// express call
const express = require("express")
const cors = require("cors");
// jwt-1
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config()
const app = express()

// declare port
const port = process.env.PORT || 4000;

// middleware declare
app.use(cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus:200,
}))
app.use(express.json())

// mongodb client declare
// add mongodb password and username
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kybpity.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// client declare
const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true 
    }
})


// Collection declare on database
const userCollection = client.db("gadgetShop").collection("users");
const productCollection = client.db("gadgetShop").collection("products");

// connect to Database
const dbConnect = async () => {
    try {
        client.connect();
        console.log("Database connected successfully.")

        // get user
        app.get('/user/:email', async (req, res) => {
            const query = { email: req.params.email };
            const user = await userCollection.findOne(query);
            res.send(user)
        });


        //Create API for insert user or buyer
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: "User already exists." });
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })


    } catch (error) {
        console.log(error.name, error.message);
    }
};
dbConnect();


// api declare
app.get("/",(req, res)=> {
    res.send("server is running")
})

// jwt -2
app.post('/authentication', async (req, res) => {
    const userEmail = req.body;
    const token = jwt.sign(userEmail, process.env.ACCESS_KEY_TOKEN, { expiresIn: '10d' });
    res.send({ token });
})


// listener for response send
app.listen(port, () => {
    console.log(`Server is running on port, ${port}`)
})