# Novacart — MERN E-Commerce Store
Advanced MERN store: JWT auth, product catalogue (search/filter/sort), product detail, cart, wishlist, checkout & orders, dark mode, animations.

## Run
1. Put your MongoDB link in `server/.env` (MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.../mern_ecommerce)
2. `npm run install-all`  →  `npm run seed`  →  `npm run server` (terminal 1)  →  `npm run client` (terminal 2)
3. Open http://localhost:5173

## Features
Register/Login (bcrypt + JWT) · 12 products with brand, rating, discount, features · Search, category chips, sorting · Product detail with related products · Cart with quantity stepper & shipping rule (free over Rs. 5,000, else Rs. 200) · Wishlist · Checkout (COD) · Order history with status tracker · Dark/Light mode (saved) · Toasts, skeleton loaders, hover/zoom/page animations · Responsive.

## Real product photos
Put `headphones.jpg, watch.jpg, shoes.jpg, backpack.jpg, mug.jpg, lamp.jpg, speaker.jpg, sunglasses.jpg, keyboard.jpg, mouse.jpg, wallet.jpg, bottle.jpg` in `client/public/images/` — they replace the illustrations automatically (no re-seed needed).

## API
POST /api/auth/register · POST /api/auth/login · GET /api/products · GET /api/products/:id · POST /api/orders (auth) · GET /api/orders/mine (auth) · GET /api/orders/:id (auth)

## Structure
server/ (models, routes, middleware, seed.js, server.js) · client/src/ (context.jsx state+API, pages.jsx, App.jsx, index.css)
