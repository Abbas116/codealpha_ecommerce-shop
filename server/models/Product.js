import mongoose from 'mongoose';
export default mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true }, brand: String, description: String,
  price: { type: Number, required: true }, oldPrice: Number, image: String, category: String,
  rating: { type: Number, default: 4 }, numReviews: { type: Number, default: 0 },
  features: [String], stock: { type: Number, default: 0 }
}, { timestamps: true }));
