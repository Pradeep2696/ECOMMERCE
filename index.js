const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const authRoute = require("./routes/auth");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");

dotenv.config();

mongoose 
.connect(process.env.CONNECTION_STRING)
.then (()=> console.log("DB connection Successfull"))
.catch((err)=>{
    console.log(err);
});
app.use(express.json());
app.use("/api/auth", authRoute); 
app.use("/api/users", userRoute); 
app.use("/api/products",productRoute);
app.use("/api/orders",orderRoute);
app.use("/api/carts",cartRoute);




app.listen(process.env.PORT || 8000, ()=> {
    console.log("Backend server is running!");
});
