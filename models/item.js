const mongoose = require('mongoose');
  
const Schema = mongoose.Schema;
const itemSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
        category: { type: Schema.Types.ObjectId, ref: 'Category' },
        sex: { type: String, enum: ['men', 'women', 'unisex'], default: 'unisex' },
        price: { value: String, unit: String },
        bestseller: { type: Boolean, default: false },
        img:
        {
            url: { type: String, required: true },
            contentType: { type: String, required: true }
        },
        updateTime: { type: Date, default: () => Date.now() }
    }
);

itemSchema
.virtual('url')
.get(function () {
  return '/collection/item/' + this._id;
});
  
module.exports = mongoose.model('Item', itemSchema);