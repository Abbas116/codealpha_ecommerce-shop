import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';
// [name, brand, category, price, oldPrice, rating, reviews, image file, description, features]
const items = [
 ['Sonic Pro Wireless Headphones','Sonic','Electronics',8999,12999,4.7,1284,'headphones','Over-ear headphones with active noise cancelling and 40-hour battery life.',['Active noise cancelling','40h battery','Bluetooth 5.3','Foldable design']],
 ['Pulse Smart Watch Series 5','Pulse','Electronics',12499,15999,4.5,856,'watch','AMOLED smart watch with heart-rate, SpO2 and GPS tracking.',['1.4" AMOLED display','GPS + heart rate','5ATM water resistant','7-day battery']],
 ['AirRun Running Shoes','Stride','Fashion',6499,8999,4.6,2140,'shoes','Lightweight breathable running shoes with responsive cushioning.',['Breathable mesh','Anti-slip sole','Lightweight 260g','Cushioned insole']],
 ['Urban Commuter Backpack 25L','Nomad','Fashion',3999,5499,4.4,967,'backpack','Water-resistant backpack with padded 15.6" laptop compartment and USB port.',['25L capacity','Fits 15.6" laptop','USB charging port','Water resistant']],
 ['Ceramic Coffee Mug Set (2)','Brewly','Home',1299,1799,4.3,412,'mug','Handcrafted 350ml ceramic mugs, microwave and dishwasher safe.',['350ml each','Microwave safe','Dishwasher safe','Matte finish']],
 ['Lumen LED Desk Lamp','Lumen','Home',2799,3499,4.5,623,'lamp','Dimmable LED lamp with 5 colour modes and wireless charging base.',['5 colour modes','Touch dimming','Wireless charger','Eye-care light']],
 ['BoomBox Bluetooth Speaker','Sonic','Electronics',5499,7499,4.6,1530,'speaker','Portable waterproof speaker with deep bass and 20-hour playtime.',['IPX7 waterproof','20h playtime','360° sound','Built-in mic']],
 ['Aviator Polarized Sunglasses','Vista','Fashion',2199,2999,4.2,388,'sunglasses','UV400 polarized sunglasses with a lightweight metal frame.',['UV400 protection','Polarized lenses','Metal frame','Includes case']],
 ['MechType RGB Keyboard','Keyra','Electronics',7499,9999,4.8,1892,'keyboard','Hot-swappable mechanical keyboard with RGB backlight and tactile switches.',['Hot-swappable','RGB backlight','Tactile switches','USB-C']],
 ['Viper Gaming Mouse 16000 DPI','Keyra','Electronics',3299,4499,4.5,1105,'mouse','Ergonomic gaming mouse with 7 programmable buttons and RGB lighting.',['16000 DPI','7 buttons','RGB lighting','Braided cable']],
 ['Classic Leather Wallet','Crafto','Fashion',1899,2599,4.4,540,'wallet','Slim genuine-leather bifold wallet with RFID protection.',['Genuine leather','RFID blocking','8 card slots','Slim profile']],
 ['ThermoFlask Steel Bottle 750ml','Brewly','Home',1599,2199,4.7,978,'bottle','Double-wall insulated bottle keeps drinks cold 24h or hot 12h.',['Cold 24h / hot 12h','Stainless steel','Leak-proof lid','BPA free']]
];
await mongoose.connect(process.env.MONGO_URI);
await Product.deleteMany();
await Product.insertMany(items.map(([name,brand,category,price,oldPrice,rating,numReviews,img,description,features],i)=>
  ({ name,brand,category,price,oldPrice,rating,numReviews,description,features,image:'/images/'+img,stock:15+i*3 })));
console.log('Sample products added'); process.exit();
