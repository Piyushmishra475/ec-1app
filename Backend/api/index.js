import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from '../config/mongodb.js'
import productRouter from '../routes/productRoute.js'
import userRouter from '../routes/userRoute.js'
import orderRouter from '../routes/orderRoute.js'
import cartRouter from '../routes/cartRoute.js'

let app;

function createApp() {
  if (!app) {
    app = express();
    app.use(express.json());
    app.use(cors({
      origin: process.env.NODE_ENV === 'production' ? true : ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true
    }));
    
    app.get('/', (req, res) => {
      res.json({ message: 'API Working' });
    });
    
    app.get('/api/test-db', async (req, res) => {
      try {
        const productModel = (await import('../models/productModel.js')).default;
        const count = await productModel.countDocuments();
        const products = await productModel.find({}, 'name subcategory category');
        res.json({ success: true, productCount: count, products, message: 'DB connection working' });
      } catch (error) {
        res.json({ success: false, error: error.message });
      }
    });
    
    app.post('/api/fix-subcategories', async (req, res) => {
      try {
        const productModel = (await import('../models/productModel.js')).default;
        
        // Delete all existing products
        await productModel.deleteMany({});
        
        // Add new products with proper subcategories
        const newProducts = [
          {
            name: "Men Cotton T-shirt",
            description: "Comfortable cotton t-shirt for men",
            price: 100,
            image: ["https://via.placeholder.com/400x400?text=Topwear1"],
            category: "Men",
            subcategory: "Topwear",
            sizes: ["S", "M", "L", "XL"],
            bestseller: true,
            date: Date.now()
          },
          {
            name: "Men Casual Jeans",
            description: "Stylish casual jeans for men",
            price: 150,
            image: ["https://via.placeholder.com/400x400?text=Bottomwear1"],
            category: "Men",
            subcategory: "Bottomwear",
            sizes: ["S", "M", "L", "XL"],
            bestseller: false,
            date: Date.now()
          },
          {
            name: "Winter Jacket",
            description: "Warm winter jacket",
            price: 200,
            image: ["https://via.placeholder.com/400x400?text=Winterwear1"],
            category: "Men",
            subcategory: "Winterwear",
            sizes: ["S", "M", "L", "XL"],
            bestseller: false,
            date: Date.now()
          },
          {
            name: "Women Cotton Top",
            description: "Comfortable cotton top for women",
            price: 120,
            image: ["https://via.placeholder.com/400x400?text=Topwear2"],
            category: "Women",
            subcategory: "Topwear",
            sizes: ["S", "M", "L", "XL"],
            bestseller: true,
            date: Date.now()
          }
        ];
        
        await productModel.insertMany(newProducts);
        
        const updatedProducts = await productModel.find({}, 'name subcategory category');
        res.json({ success: true, message: 'Products replaced with subcategories', products: updatedProducts });
      } catch (error) {
        res.json({ success: false, error: error.message });
      }
    });
    
    app.use('/api/product', productRouter);
    app.use('/api/user', userRouter);
    app.use('/api/order', orderRouter);
    app.use('/api/cart', cartRouter);
  }
  return app;
}

export default async function handler(req, res) {
  try {
    // Ensure database connection
    await connectDB();
    const app = createApp();
    return app(req, res);
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ success: false, error: 'Database connection failed' });
  }
}