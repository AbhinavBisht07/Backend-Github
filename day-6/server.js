// server start karna 
// doosra kaam iska thoda important hai :-  server ko database se connect karna 

const app = require('./src/app');
const mongoose = require('mongoose');

function connectToDb(){
    mongoose.connect("mongodb+srv://abhinav:OGUtskeFXebOWlXc@cluster0.rnl9exf.mongodb.net/day-6")
    .then(()=>{
        console.log("Connected to database");
    })
}

connectToDb()

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})


