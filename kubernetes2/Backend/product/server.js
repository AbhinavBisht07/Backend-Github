import express from "express"
import axios from "axios"
import morgan from "morgan"


const app = express()

app.use(morgan("dev"))
app.use(express.json())


// ye API(service) jab hit hogi ye ek aur service ko call karegi(humne jo pehhle service banayi thi(main-server-service) usko call karegi ye wali service).
app.get("/api/product", async (req, res) => {
    const response = await axios.get("http://main-server-service/")
    res.send(response.data)
})

app.listen(8080, () => {
  console.log("Product service listening on port 8080")
})
