// require('dotenv').config();
// const express=require("express");
// const mongoose=require("mongoose");
// const bodyParser=require('body-parser');
// const cors=require('cors');
// const bcrypt = require("bcrypt");

// const {HoldingsModel}=require("./model/HoldingsModel");
// const { PositionModel } = require('./model/PositionModel');
// const {OrderModel}=require("./model/OrderModel");

// const PORT=process.env.PORT || 3002;  // ✅ match your React axios call

// const url=process.env.MONGO_URL;

// const app=express();

// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.json()); // built-in body parser




// app.get("/allHoldings", async (req, res) => {
//     let allHoldings = await HoldingsModel.find({});
//     res.json(allHoldings);
// });

// app.get("/allPositions", async (req, res) => {
//     let allPositions = await PositionModel.find({});
//     res.json(allPositions);
// });

// // Fetch all orders
// app.get("/orders", async (req, res) => {
//   try {
//     const orders = await OrderModel.find().sort({ createdAt: -1 }); // optional: sort by newest
//     res.json(orders);
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//     res.status(500).send("Server error");
//   }
// });


// app.post("/newOrder", async (req, res) => {
//   let newOrder = new OrderModel({
//     name: req.body.name,
//     qty: req.body.qty,
//     price: req.body.price,
//     mode: req.body.mode,
//   });
//   await newOrder.save();
//   res.send("Order is Saved");
// });

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// app.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new UserModel({ name, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: "Signup successful" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // Login
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid email" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: "Invalid password" });

//     // You can generate JWT here
//     res.json({ message: "Login successful", token: "dummy-token" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // DELETE an order
// app.delete("/orders/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Order.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).json({ error: "Order not found" });
//     res.json({ message: "Order deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to delete order" });
//   }
// });



// const User = mongoose.model('User', userSchema);

// mongoose.connect(url).then(()=>{
//     console.log("Database is connected..");
//     app.listen(PORT,()=>{
//         console.log(`App is listening on port ${PORT}`);
//     });
// }).catch(err=>console.error("DB connection failed: ",err));

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require("bcrypt");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionModel } = require('./model/PositionModel');
const { OrderModel } = require("./model/OrderModel");

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  joinDate: { type: Date, default: Date.now }
});

const UserModel = mongoose.model('User', userSchema);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Holdings routes
app.get("/allHoldings", async (req, res) => {
  try {
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    console.error("Error fetching holdings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Positions routes
app.get("/allPositions", async (req, res) => {
  try {
    let allPositions = await PositionModel.find({});
    res.json(allPositions);
  } catch (err) {
    console.error("Error fetching positions:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Orders routes
app.get("/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    let newOrder = new OrderModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });
    await newOrder.save();
    res.json({ message: "Order saved successfully" });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

app.delete("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await OrderModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// Authentication routes
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ 
      name, 
      email, 
      password: hashedPassword 
    });
    
    await newUser.save();

    res.status(201).json({ 
      message: "Signup successful", 
      user: { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email,
        joinDate: newUser.joinDate
      } 
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ 
      message: "Login successful", 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        joinDate: user.joinDate
      },
      token: "dummy-token" // Replace with JWT in production
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Connect to database and start server
mongoose.connect(url)
  .then(() => {
    console.log("Database is connected..");
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  })
  .catch(err => console.error("DB connection failed: ", err));