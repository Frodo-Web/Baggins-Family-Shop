const mongoose = require('mongoose');
  
const Schema = mongoose.Schema;
const imageSchema = new Schema(
    {
        name: { type: String, required: false },
        alt: { type: String, required: false },
        img:
        {
            url: { type: String, required: true },
            contentType: { type: String, required: true}
        },
        uploadTime: { type: Date, default: Date.now() }
    }
);
  
module.exports = mongoose.model('Image', imageSchema);