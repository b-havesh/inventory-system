const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://sonibhaveshsoni0:cv2OLwwFkppOBeyh@sample.94q1k4n.mongodb.net/?retryWrites=true&w=majority&appName=sample",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Define schema and models for inventory items

const inventoryItemSchema = new mongoose.Schema({
  name: String,
  category: String,
  quantity: Number,
  dateEntered: { type: Date, default: Date.now },
  enteredBy: String,
});

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

// CRUD endpoints

// Get all inventory items
app.get("/items", async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// Add new inventory item
app.post("/items/add", (req, res) => {
  let newItem = new InventoryItem(req.body);
  newItem
    .save()
    .then((item) => {
      res.status(200).json({ item: "Item added successfully" });
    })
    .catch((err) => {
      res.status(400).send("Adding new item failed");
    });
});

// Delete inventory item
app.delete("/items/delete/:id", async (req, res) => {
  try {
    const deletedItem = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
