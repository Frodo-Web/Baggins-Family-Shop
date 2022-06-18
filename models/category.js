const mongoose = require('mongoose');
  
const Schema = mongoose.Schema;
const categorySchema = new Schema(
    {
        name: String
    }
);

categorySchema
.virtual('url')
.get(function () {
  return '/collection/category/' + this._id;
});
  
module.exports = mongoose.model('Category', categorySchema);