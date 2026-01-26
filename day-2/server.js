const express = require("express");

const app = express() // Creates server instance 

app.get('/', (req, res) => {
    res.send("Hello World!");
})
// Iss ooper wale code ka mtlb ye hai agar user slash(/) pe request karega to server respose karega Hello World! .. slash pe request karega bole to page ka jo default area hota(react mein pdha tha ki slash default area hota website ka jo website khulte hi dikhta humko) .... filhaal abhi ke liye to yahi mtlb smjho iska ... khudse jada padhne jaoge to confuse hojaoge backend mein ... filhaal ke liye sach mein bas itna hi mtlb smjho iska ... baaki isko bhi detail mein pdhenge bas abhi ke liye itna samjho ki agar use slash pe request karega to server response mein Hello World dega.
// ab iske jesa kuch aur try karte hain :-
app.get("/about", function (req,res){
    res.send("This is ABOUT PAGE");
})
// this means ki agar user /about mein kuch request karega to This is ABOUT PAGE as a response aega.

app.get("/home", (req,res)=>{
    res.send("This is HOME PAGE");
})

app.listen(3000) // Starts the server