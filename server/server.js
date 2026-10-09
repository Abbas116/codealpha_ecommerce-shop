import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB once (works locally and on Vercel)
let conn;
app.use(async (req, res, next) => {
  try { conn ||= mongoose.connect(process.env.MONGO_URI); await conn; next(); }
  catch (e) { conn = null; res.status(500).json({ message: 'Database error: ' + e.message }); }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use((err, req, res, next) => res.status(err.status || 500).json({ message: err.message }));

if (!process.env.VERCEL) app.listen(process.env.PORT || 5000, () => console.log('Server running on port', process.env.PORT || 5000));
export default app;