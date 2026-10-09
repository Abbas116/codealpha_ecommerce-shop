import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api, useApp, money, shipping } from './context.jsx';

// Real photo (name.jpg) is used if present, else the built-in illustration (name.svg)
export const Pic = ({ src, alt }) => <img src={src + '.jpg'} alt={alt} loading="lazy" onError={e => { e.target.onerror = null; e.target.src = src + '.svg'; }} />;
const Stars = ({ r, n }) => <span className="stars">{'★'.repeat(Math.round(r))}{'☆'.repeat(5 - Math.round(r))}<small className="muted"> {r} ({n})</small></span>;
const Err = ({ msg }) => msg ? <p className="error">{msg}</p> : null;

function Card({ p, i }) {
  const { add, wish, toggleWish } = useApp();
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <div className="card" style={{ animationDelay: i * 60 + 'ms' }}>
      {off > 0 && <span className="tag">-{off}%</span>}
      <button className={'heart' + (wish.includes(p._id) ? ' on' : '')} onClick={() => toggleWish(p._id)}>♥</button>
      <Link to={'/product/' + p._id} className="imgbox"><Pic src={p.image} alt={p.name} /></Link>
      <small className="muted">{p.brand} · {p.category}</small>
      <Link to={'/product/' + p._id}><h3>{p.name}</h3></Link>
      <Stars r={p.rating} n={p.numReviews} />
      <div className="between">
        <div><b className="price">{money(p.price)}</b>{p.oldPrice && <s className="muted"> {money(p.oldPrice)}</s>}</div>
        <button className="btn sm" disabled={!p.stock} onClick={() => add(p)}>{p.stock ? 'Add +' : 'Sold out'}</button>
      </div>
    </div>);
}

export function Home() {
  const [all, setAll] = useState(null), [q, setQ] = useState(''), [cat, setCat] = useState('All'), [sort, setSort] = useState('new'), [error, setError] = useState('');
  useEffect(() => { api('/products').then(setAll).catch(e => setError(e.message)); }, []);
  const cats = ['All', ...new Set((all || []).map(p => p.category))];
  let list = (all || []).filter(p => (cat === 'All' || p.category === cat) && (p.name + p.brand).toLowerCase().includes(q.toLowerCase()));
  if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
  if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
  return (<>
    <section className="hero">
      <div><span className="chip on">New season sale · up to 35% off</span>
        <h1>Upgrade your <span className="grad">everyday</span> life</h1>
        <p>Premium gadgets, fashion & home essentials. Free delivery on orders over Rs. 5,000.</p>
        <a href="#shop" className="btn">Shop now →</a></div>
      <div className="floaty">🛍️</div>
    </section>
    <div className="perks"><span>🚚 Free delivery 5k+</span><span>🔒 Secure checkout</span><span>↩️ 7-day returns</span><span>💬 24/7 support</span></div>
    <div id="shop" className="toolbar">
      <input className="search" placeholder="🔍 Search products or brands..." value={q} onChange={e => setQ(e.target.value)} />
      <select value={sort} onChange={e => setSort(e.target.value)}>
        <option value="new">Newest</option><option value="low">Price: Low → High</option><option value="high">Price: High → Low</option><option value="rating">Top rated</option>
      </select>
    </div>
    <div className="chips">{cats.map(c => <button key={c} className={'chip' + (c === cat ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>)}</div>
    <Err msg={error} />
    <div className="grid">
      {!all && !error && [...Array(8)].map((_, i) => <div key={i} className="card sk" />)}
      {list.map((p, i) => <Card key={p._id} p={p} i={i} />)}
    </div>
    {all && !list.length && <p className="center muted">No products found 😕</p>}
  </>);
}

export function ProductDetail() {
  const { id } = useParams(); const nav = useNavigate();
  const { add, wish, toggleWish } = useApp();
  const [p, setP] = useState(null), [rel, setRel] = useState([]), [qty, setQty] = useState(1), [error, setError] = useState('');
  useEffect(() => { setP(null); setQty(1);
    api('/products/' + id).then(x => { setP(x); api('/products').then(a => setRel(a.filter(r => r.category === x.category && r._id !== x._id).slice(0, 4))); }).catch(e => setError(e.message)); }, [id]);
  if (error) return <Err msg={error} />;
  if (!p) return <div className="card sk" style={{ height: 380 }} />;
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (<>
    <p className="muted"><Link to="/">Home</Link> / {p.category} / {p.name}</p>
    <div className="detail">
      <div className="imgbox big zoom"><Pic src={p.image} alt={p.name} /></div>
      <div>
        <small className="muted">{p.brand}</small><h1>{p.name}</h1><Stars r={p.rating} n={p.numReviews} />
        <p className="price big">{money(p.price)} {p.oldPrice && <><s className="muted small"> {money(p.oldPrice)}</s> <span className="tag inline">-{off}%</span></>}</p>
        <p>{p.description}</p>
        <ul className="feat">{p.features.map(f => <li key={f}>✓ {f}</li>)}</ul>
        <p className={p.stock > 5 ? 'ok' : 'warn'}>{p.stock > 0 ? (p.stock > 5 ? `In stock (${p.stock})` : `Only ${p.stock} left!`) : 'Out of stock'}</p>
        {p.stock > 0 && <div className="actions">
          <div className="stepper"><button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span>{qty}</span><button onClick={() => setQty(Math.min(p.stock, qty + 1))}>+</button></div>
          <button className="btn" onClick={() => add(p, qty)}>Add to Cart</button>
          <button className="btn alt" onClick={() => { add(p, qty); nav('/cart'); }}>Buy Now</button>
          <button className={'ghost round heartbtn' + (wish.includes(p._id) ? ' on' : '')} onClick={() => toggleWish(p._id)}>♥</button>
        </div>}
      </div>
    </div>
    {rel.length > 0 && <><h2>You may also like</h2><div className="grid">{rel.map((r, i) => <Card key={r._id} p={r} i={i} />)}</div></>}
  </>);
}

export function Cart() {
  const { cart, setQty, remove, total, user } = useApp(); const nav = useNavigate();
  if (!cart.length) return <div className="center"><h2>Your cart is empty 🛒</h2><Link to="/" className="btn">Start shopping</Link></div>;
  const ship = shipping(total);
  return (<>
    <h2>Shopping Cart</h2>
    <div className="two">
      <div>{cart.map(i => (
        <div className="row" key={i._id}>
          <div className="imgbox mini"><Pic src={i.image} alt={i.name} /></div>
          <div style={{ flex: 1 }}><Link to={'/product/' + i._id}><b>{i.name}</b></Link><div className="muted">{money(i.price)}</div></div>
          <div className="stepper"><button onClick={() => setQty(i._id, i.qty - 1)}>−</button><span>{i.qty}</span><button onClick={() => setQty(i._id, i.qty + 1)}>+</button></div>
          <b>{money(i.price * i.qty)}</b><button className="ghost" onClick={() => remove(i._id)}>✕</button>
        </div>))}</div>
      <div className="summary">
        <h3>Order Summary</h3>
        <p className="between"><span>Subtotal</span><span>{money(total)}</span></p>
        <p className="between"><span>Shipping</span><span>{ship ? money(ship) : 'FREE'}</span></p>
        {ship > 0 && <small className="muted">Add {money(5000 - total)} more for free delivery</small>}
        <hr /><p className="between"><b>Total</b><b className="price">{money(total + ship)}</b></p>
        <button className="btn full" onClick={() => nav(user ? '/checkout' : '/login')}>Checkout →</button>
      </div>
    </div>
  </>);
}

export function Wishlist() {
  const { wish } = useApp(); const [list, setList] = useState([]);
  useEffect(() => { api('/products').then(a => setList(a.filter(p => wish.includes(p._id)))); }, [wish]);
  return (<><h2>My Wishlist ♥</h2>{!list.length && <p className="muted">Nothing saved yet. Tap the ♥ on any product.</p>}
    <div className="grid">{list.map((p, i) => <Card key={p._id} p={p} i={i} />)}</div></>);
}

export function Auth({ mode }) {
  const { setUser, toast } = useApp(); const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' }), [error, setError] = useState('');
  const ch = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => { e.preventDefault(); setError('');
    try { setUser(await api('/auth/' + mode, { method: 'POST', body: f })); toast('Welcome! 🎉'); nav('/'); } catch (err) { setError(err.message); } };
  return (
    <div className="auth">
      <div className="authside"><h2>{mode === 'login' ? 'Welcome back!' : 'Join Novacart'}</h2><p>Track orders, save favourites and checkout faster.</p><div className="floaty">🎁</div></div>
      <form className="form" onSubmit={submit}>
        <h2>{mode === 'login' ? 'Login' : 'Create account'}</h2><Err msg={error} />
        {mode === 'register' && <input placeholder="Full name" value={f.name} onChange={ch('name')} required />}
        <input type="email" placeholder="Email" value={f.email} onChange={ch('email')} required />
        <input type="password" placeholder="Password (min 6)" value={f.password} onChange={ch('password')} required />
        <button className="btn full">{mode === 'login' ? 'Login' : 'Register'}</button>
        <p className="center muted">{mode === 'login' ? <>New here? <Link to="/register">Sign up</Link></> : <>Already a member? <Link to="/login">Login</Link></>}</p>
      </form>
    </div>);
}

export function Checkout() {
  const { cart, total, user, clear, toast } = useApp(); const nav = useNavigate();
  const [s, setS] = useState({ address: '', city: '', phone: '' }), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  if (!cart.length) return <div className="center"><h2>Cart is empty</h2><Link to="/" className="btn">Shop</Link></div>;
  const ship = shipping(total); const ch = k => e => setS({ ...s, [k]: e.target.value });
  const place = async e => { e.preventDefault(); setError(''); setBusy(true);
    try { await api('/orders', { method: 'POST', token: user.token, body: { items: cart.map(i => ({ product: i._id, qty: i.qty })), shippingAddress: s } });
      clear(); toast('Order placed successfully ✅'); nav('/orders'); } catch (err) { setError(err.message); setBusy(false); } };
  return (<><h2>Checkout</h2>
    <div className="two">
      <form className="form" onSubmit={place}><h3>Shipping details</h3><Err msg={error} />
        <input placeholder="Street address" value={s.address} onChange={ch('address')} required />
        <input placeholder="City" value={s.city} onChange={ch('city')} required />
        <input placeholder="Phone number" value={s.phone} onChange={ch('phone')} required />
        <p className="muted">💵 Payment: Cash on Delivery</p>
        <button className="btn full" disabled={busy}>{busy ? 'Placing order...' : `Place order · ${money(total + ship)}`}</button></form>
      <div className="summary"><h3>Your items</h3>
        {cart.map(i => <p className="between" key={i._id}><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></p>)}
        <hr /><p className="between"><span>Shipping</span><span>{ship ? money(ship) : 'FREE'}</span></p>
        <p className="between"><b>Total</b><b className="price">{money(total + ship)}</b></p></div>
    </div></>);
}

export function Orders() {
  const { user } = useApp(); const [orders, setOrders] = useState(null), [error, setError] = useState('');
  useEffect(() => { api('/orders/mine', { token: user.token }).then(setOrders).catch(e => setError(e.message)); }, []);
  const step = { Pending: 1, Shipped: 2, Delivered: 3 };
  return (<><h2>My Orders</h2><Err msg={error} />
    {orders && !orders.length && <div className="center"><p className="muted">No orders yet.</p><Link to="/" className="btn">Shop now</Link></div>}
    {(orders || []).map(o => (
      <div className="order" key={o._id}>
        <div className="between"><b>Order #{o._id.slice(-6).toUpperCase()}</b><span className="muted">{new Date(o.createdAt).toLocaleDateString()}</span></div>
        <div className="track">{['Pending', 'Shipped', 'Delivered'].map((t, i) => <span key={t} className={i < step[o.status] ? 'done' : ''}>{t}</span>)}</div>
        {o.items.map(i => <p className="between" key={i._id}><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></p>)}
        <hr /><p className="between"><span className="muted">{o.shippingAddress.address}, {o.shippingAddress.city}</span><b className="price">{money(o.totalPrice)}</b></p>
      </div>))}</>);
}
