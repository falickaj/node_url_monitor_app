const mongoose = require('mongoose')


const urlSchema = mongoose.Schema(
    {
        url:{
            type: String,
            require: [true,"System requires an url to monitor it"]
        },
        category: {
            type: String,
            require: [true,"Without a category you will have a problem to know what server is this"]
        },
        status:{
            type: String,
            enum: ['pending','up','down'],default:'pending'
        }
    }
);

const Url = mongoose.model('Url',urlSchema);
module.exports = Url;