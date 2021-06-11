const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    _id: Number,
    name: String,
    parentId: Number,
    childrenCount: Number,
    productCount: Number,
});

module.exports = mongoose.model('Category', categorySchema);