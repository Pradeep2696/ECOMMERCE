const { verifyTokenAndAuthorization,verifyTokenAndAdmin,verifyToken} = require("./verifyToken.js");
const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.js");
const CryptoJS = require("crypto-js"); 

//UPDATE
router.put("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString();
    }
  //  console.log("The id is this : ", req.params.id, " and the req.body.password is this : ", req.body.password)
    try {
        const updatedUser = await User.findByIdAndUpdate(
            {
                _id : new mongoose.Types.ObjectId(req.params.id)
            }
            ,{
             $set:{
                username : req.body.username,
                email : req.body.email,
                password :req.body.password
             }
        },{new:true}
        );
       // console.log("The result set is this : ", updatedUser)
        res.status(200).json(updatedUser);
    } catch (err) {
     //   console.log('The error is this : ', err)
        res.status(500).send({errorMessage : err.name});
    }
});

//DELETE
router.delete("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been Deleted...");
    }catch(err){
        res.status(500).json(err);
    }
});
//GET USER
router.get("/find/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
      const user = await User.findById(req.params.id);
      const {password,...others}=user._doc;
      res.status(200).json(others);
    }catch(err){
        res.status(500).json(err);
    }
});
// GET ALL USER
router.get("/",verifyTokenAndAdmin,async (req,res)=>{
    const query = req.query.new;
    try{
        const users = query 
        ? await User.find().sort({_id: -1}).limit(1) 
        : await User.find();
      res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
});

//USER STATS

router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));
    try{
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {
             $project:{
             month: {$month:"$createdAt"},
             },
            }, 
            {
                $group:{
                    _id: "$month",
                    total: {$sum: 1},
                },
            }
        ]);
         
        res.status(200).json(data); 
    }catch(err){
        res.status(500).json(err);
    }

});
module.exports = router;
