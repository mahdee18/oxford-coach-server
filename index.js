
const express = require("express");
const http = require("http");
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");
require("dotenv").config();
const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://oxford_coach:o0yMU99752n6kDT1@cluster0.ftqixdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("OXFORD Coach Media is running!!");
});

server.listen(port, () => {
  console.log(`OXFORD Coach is running now on port: ${port}`);
});