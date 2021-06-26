const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 7070;

// monogDB connection
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ube8o.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("blogs").collection("blogsCollection");
  // blog posting
  app.post("/addBlogs", (req, res) => {
    const newBlog = req.body;
    collection.insertOne(newBlog).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // read or get blogs
  app.get("/blogs", (req, res) => {
    collection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  // delete
  app.delete("/deleteBlog/:id", (req, res) => {
    collection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });

  console.log("MongoDB connect successfully");
});

app.get("/", (req, res) => {
  res.send("Welcome Express JS!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
