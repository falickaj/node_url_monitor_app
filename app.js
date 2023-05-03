const express = require('express')
const mongoose = require('mongoose')
const Url = require('./models/productModel')
const morgan = require('morgan')
const cron = require('node-cron')
const path = require('path');

const app = express()
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/api/urls', async (req, res) => {
    try {
      const urls = await Url.find({});
      const data = urls.map(url => ({
        url: url.url,
        status: url.status
      }));
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

app.get('/urls', (req, res) => {
    res.sendFile(path.join(__dirname, '', 'urls.html'));
  });

app.post('/new',async(req,res)=> {
    try{
        const url = await Url.create(req.body)
        res.status(200).json(url);
    }catch (error){
        console.log(error)
        res.status(500).json({message:error.message})
    }
})


app.delete('/delete/:id',async(req,res)=> {
    try{
        const {id} = req.params;
        const url = Url.findByIdAndDelete(id);
        if (!url){
            return res.status(404).json({message:`cannot find url with id ${id}`})
        }
    }catch (error){
        res.status(500).json({message:error.message})
    }
})


async function updateUrlsStatus() {
    const urls = await Url.find();
    for (const url of urls) {
      const response = await fetch(url.url);
      const status = response.status >= 200 && response.status < 400 ? 'up' : 'down';
      url.status = status;
      await url.save();
    }
    console.log('Status updated for all URLs');
  }


cron.schedule('*/2 * * * *', updateUrlsStatus);

// Connect DB before launching app
mongoose.connect('mongodb+srv://<user>:<pass>@servers.h57m66n.mongodb.net/?retryWrites=true&w=majority')
.then(() =>{
    app.listen(3500,()=> {
        console.log("Running on port 3500")
    })
    console.log("Database connected")
}).catch((error) => {
    console.log(error)
})


