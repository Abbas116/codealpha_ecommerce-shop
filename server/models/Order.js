import mongoose from 'mongoose';
export default mongoose.model('Order', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, name: String, price: Number, qty: Number }],
  shippingAddress: { address: String, city: String, phone: String },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  totalPrice: Number,
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' }
}, { timestamps: true }));
