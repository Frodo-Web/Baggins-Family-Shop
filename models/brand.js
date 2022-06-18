const mongoose = require('mongoose');
  
const Schema = mongoose.Schema;
const brandSchema = new Schema(
    {
        name: { type: String, required: true },
        img:
        {
            url: { type: String, required: true },
            contentType: { type: String, required: true }
        }
    }
);

brandSchema
.virtual('url')
.get(function () {
  return '/collection/brand/' + this._id;
});
  
module.exports = mongoose.model('Brand', brandSchema);