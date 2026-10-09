import { createContext, useContext, useState, useEffect } from 'react';
export const money = n => 'Rs. ' + Number(n).toLocaleString('en-PK');
export const shipping = t => (t === 0 || t >= 5000 ? 0 : 200);
export const api = async (url, { method = 'GET', body, token } = {}) => {
  const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api' + url, { method, body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};
const Ctx = createContext();
export const useApp = () => useContext(Ctx);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };

export function Provider({ children }) {
  const [user, setUser] = useState(load('user', null));
  const [cart, setCart] = useState(load('cart', []));
  const [wish, setWish] = useState(load('wish', []));
  const [theme, setTheme] = useState(load('theme', 'light'));
  const [msg, setMsg] = useState('');
  useEffect(() => localStorage.setItem('user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('wish', JSON.stringify(wish)), [wish]);
  useEffect(() => { localStorage.setItem('theme', JSON.stringify(theme)); document.documentElement.dataset.theme = theme; }, [theme]);
  const toast = m => { setMsg(m); setTimeout(() => setMsg(''), 2200); };
  const add = (p, qty = 1) => { setCart(c => c.find(x => x._id === p._id)
    ? c.map(x => x._id === p._id ? { ...x, qty: Math.min(x.qty + qty, p.stock) } : x)
    : [...c, { _id: p._id, name: p.name, price: p.price, image: p.image, stock: p.stock, qty }]); toast('Added to cart 🛒'); };
  const setQty = (id, qty) => setCart(c => c.map(x => x._id === id ? { ...x, qty: Math.max(1, Math.min(qty, x.stock)) } : x));
  const remove = id => setCart(c => c.filter(x => x._id !== id));
  const clear = () => setCart([]);
  const toggleWish = id => { setWish(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]); toast(wish.includes(id) ? 'Removed from wishlist' : 'Saved to wishlist ♥'); };
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return <Ctx.Provider value={{ user, setUser, cart, add, setQty, remove, clear, total, wish, toggleWish, theme, setTheme, msg, toast }}>{children}</Ctx.Provider>;
}
