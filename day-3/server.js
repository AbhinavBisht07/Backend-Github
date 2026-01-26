const express = require("express");

const app = express(); //express ko call krte hain to server ka ek instance create hojata hai and return hota hai ... to uss instance ko hum app mein store karte hain

app.get("/", (req,res)=>{
    res.send("Hello World!");
});

app.get("/about", (req,res)=>{
    res.send("This is aboput page");
});

app.get("/home", (req,res)=>{
    res.send("This is home page");
});

// app.listen(3000);
app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})