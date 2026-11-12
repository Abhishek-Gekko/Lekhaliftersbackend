const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Enquiry = require("./models/Enquiry")
const Quotation = require("./models/Quotation")
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("backend is running");
});

mongoose.connect(process.env.MONG_URI).then(()=>{
    console.log("Mongoose connected sucessfully");
}).catch((error)=>{
    console.log("Failed to connect: ",error)
})

app.post("/api/enquiries", async (req,res)=>{
   try { const{name,email,phone,message} = req.body;

    const newEnquiry = new  Enquiry({
        name,
        email,
        phone,
        message
    });

    await newEnquiry.save();

    res.status(201).json({
        success:true,
        message:"Sent sucessfully"
    }); 
} catch(error){
    console.log("failed to fetch : ",error);

    res.status(500).json({
        success:false,
        message:"Failed to send"
    });
};   
}); 

app.post("/api/quotation", async (req, res) => {
    try {
      const {
        Customername,
        phone,
        email,
        brand,
        model,
        Companyname,
        Quantity,
        requirements,
      } = req.body;

      const newQuotation = new Quotation({
        Customername,
        phone,
        email,
        brand,
        model,
        Companyname,
        Quantity,
        requirements,
      });

      await newQuotation.save();

      res.status(201).json({
        success: true,
        message: "Sent sucessfully",
      });
    } catch (error) {
      console.log("failed to send", error);

      res.status(500).json({
        success: false,
        message: "Failed to send",
      });
    }
});



app.listen(5000,()=>{
    console.log("http://localhost:5000")
})

