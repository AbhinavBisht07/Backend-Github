// server start karna 
// doosra kaam iska thoda important hai :-  server ko database se connect karna 

const app = require('./src/app');
const mongoose = require('mongoose');
require('dotenv').config();

function connectToDb(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("Connected to database");
    })
}

connectToDb()

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})