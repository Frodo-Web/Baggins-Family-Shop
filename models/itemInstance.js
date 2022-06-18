const mongoose = require('mongoose');
  
const Schema = mongoose.Schema;
const itemInstanceSchema = new Schema(
    {
        item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
        size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], required: true },
        status: { type: String, enum: ['Available', 'Sold', 'Maintance'], default: 'Maintance' }
    }
);

itemInstanceSchema
.virtual('url')
.get(function () {
  return '/collection/itemInstance/' + this._id;
});
  
module.exports = mongoose.model('ItemInstance', itemInstanceSchema);