import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
const r = Router();

// Place order (price is calculated on server, never trusted from client)
r.post('/', protect, async (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!items?.length) return res.status(400).json({ message: 'Cart is empty' });
  if (!shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.phone)
    return res.status(400).json({ message: 'Shipping address is required' });
  const orderItems = []; let total = 0;
  for (const i of items) {
    const p = await Product.findById(i.product);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    if (p.stock < i.qty) return res.status(400).json({ message: `Not enough stock for ${p.name}` });
    orderItems.push({ product: p._id, name: p.name, price: p.price, qty: i.qty });
    total += p.price * i.qty;
  }
  for (const i of orderItems) await Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.qty } });
  const order = await Order.create({ user: req.userId, items: orderItems, shippingAddress, totalPrice: total + (total >= 5000 ? 0 : 200) });
  res.status(201).json(order);
});

r.get('/mine', protect, async (req, res) => res.json(await Order.find({ user: req.userId }).sort('-createdAt')));
r.get('/:id', protect, async (req, res) => {
  const o = await Order.findOne({ _id: req.params.id, user: req.userId }).catch(() => null);
  o ? res.json(o) : res.status(404).json({ message: 'Order not found' });
});
export default r;
