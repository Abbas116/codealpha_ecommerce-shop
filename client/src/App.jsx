import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './context.jsx';
import { Home, ProductDetail, Cart, Auth, Checkout, Orders, Wishlist } from './pages.jsx';

export default function App() {
  const { user, setUser, cart, wish, theme, setTheme, msg } = useApp();
  const nav = useNavigate(); const loc = useLocation();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const guard = el => user ? el : <Navigate to="/login" />;
  return (<>
    <header className="nav">
      <Link to="/" className="logo">🛒 Nova<span>cart</span></Link>
      <nav>
        <Link to="/wishlist" title="Wishlist">♥ <b className="pill">{wish.length}</b></Link>
        <Link to="/cart" title="Cart">🛒 <b className="pill">{count}</b></Link>
        {user ? <><Link to="/orders">Orders</Link><span className="muted">Hi, {user.name.split(' ')[0]}</span>
          <button className="ghost" onClick={() => { setUser(null); nav('/'); }}>Logout</button></>
          : <><Link to="/login">Login</Link><Link to="/register" className="btn sm">Sign up</Link></>}
        <button className="ghost round" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☀️' : '🌙'}</button>
      </nav>
    </header>
    <main className="container page" key={loc.pathname}>
      <Routes>
        <Route path="/" element={<Home />} /><Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} /><Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Auth mode="login" />} /><Route path="/register" element={<Auth mode="register" />} />
        <Route path="/checkout" element={guard(<Checkout />)} /><Route path="/orders" element={guard(<Orders />)} />
      </Routes>
    </main>
    <footer className="foot">© 2026 Novacart · Built with MongoDB, Express, React & Node</footer>
    {msg && <div className="toast">{msg}</div>}
  </>);
}
