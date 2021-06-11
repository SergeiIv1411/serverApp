const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  _id: String,
  name: String,
  article: String,
  description: String,
  weight: Number,
  count: Number,
  priceForOne: Number,
  new_product: Boolean,
  sale: Boolean,
  composition: String,
  code: String,
  brand: String,
  color: String,
  country: String,
  size: String,
  countInPackage: String,
  images: [String],
  categories: [Number],
  packages: [{
    barcode: { type: String},
    package_id: { type: String},
    package_name: { type: String},
    price: { type: Number},
  }],
});

module.exports = mongoose.model("Product", productSchema);
