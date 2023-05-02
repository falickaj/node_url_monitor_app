const express = require('express')

const app = express()


app.get('/',(req,res)=>{
    res.send("Hello NODE World")
})

app.listen(3500,()=> {
    console.log("Running on port 3500")
})