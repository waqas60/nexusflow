
import express from "express"
import connectToDB from "./config.js"
const app = express()

app.get("/", (req, res) => {
    res.send("hi there")
})

app.listen(3000, async () => {
    await connectToDB()
    console.log("Server running on http://localhost:3000");  
})