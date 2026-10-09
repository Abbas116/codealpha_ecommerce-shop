import { Router } from 'express';
import Product from '../models/Product.js';
const r = Router();
r.get('/', async (req, res) => {
  const q = req.query.search ? { name: { $regex: req.query.search, $options: 'i' } } : {};
  res.json(await Product.find(q).sort('-createdAt'));
});
r.get('/:id', async (req, res) => {
  const p = await Product.findById(req.params.id).catch(() => null);
  p ? res.json(p) : res.status(404).json({ message: 'Product not found' });
});
export default r;
