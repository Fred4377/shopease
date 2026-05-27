import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@shopease.com',
        password: await bcrypt.hash('admin123', 10),
        isAdmin: true,
      }
    ]);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = [
      {
        name: 'iPhone 15 Pro',
        image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
        description: 'The latest iPhone with a titanium design and incredible pro-grade camera system.',
        category: 'Electronics',
        price: 999.99,
        stock: 10,
        rating: 4.8,
        numReviews: 12,
        user: adminUser,
      },
      {
        name: 'Nike Running Shoes',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        description: 'Comfortable and lightweight running shoes engineered for speed and endurance.',
        category: 'Sports',
        price: 89.99,
        stock: 25,
        rating: 4.5,
        numReviews: 8,
        user: adminUser,
      },
      {
        name: 'JavaScript: The Definitive Guide',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        description: 'The complete guide to mastering modern JavaScript programming from basics to advanced.',
        category: 'Books',
        price: 29.99,
        stock: 50,
        rating: 4.9,
        numReviews: 45,
        user: adminUser,
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        description: 'Industry-leading noise-cancelling wireless headphones for an immersive audio experience.',
        category: 'Electronics',
        price: 149.99,
        stock: 15,
        rating: 4.7,
        numReviews: 24,
        user: adminUser,
      },
      {
        name: 'Linen Casual T-Shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80',
        description: 'Premium breathable linen t-shirt, perfect for warm summer days.',
        category: 'Clothing',
        price: 24.99,
        stock: 100,
        rating: 4.3,
        numReviews: 31,
        user: adminUser,
      },
      {
        name: 'Ceramic Coffee Mug',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&auto=format&fit=crop&q=80',
        description: 'Artisan handcrafted ceramic mug for the perfect morning coffee ritual.',
        category: 'Home',
        price: 14.99,
        stock: 40,
        rating: 4.6,
        numReviews: 18,
        user: adminUser,
      },
      {
        name: 'Eco Yoga Mat',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80',
        description: 'Eco-friendly non-slip yoga mat made from natural rubber for superior grip.',
        category: 'Sports',
        price: 35.00,
        stock: 30,
        rating: 4.4,
        numReviews: 22,
        user: adminUser,
      },
      {
        name: 'Dell XPS 15 Laptop',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
        description: 'Powerful slim laptop for professionals, creators, and developers.',
        category: 'Electronics',
        price: 1899.99,
        stock: 5,
        rating: 4.8,
        numReviews: 55,
        user: adminUser,
      },
      {
        name: 'Classic Denim Jacket',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
        description: 'Timeless blue denim jacket with a modern slim fit for any occasion.',
        category: 'Clothing',
        price: 59.99,
        stock: 20,
        rating: 4.5,
        numReviews: 14,
        user: adminUser,
      },
      {
        name: 'Modern LED Desk Lamp',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
        description: 'Sleek minimalist LED desk lamp with adjustable color temperature and brightness.',
        category: 'Home',
        price: 45.00,
        stock: 12,
        rating: 4.2,
        numReviews: 9,
        user: adminUser,
      }
    ];

    await Product.insertMany(sampleProducts);

    res.json({ message: 'Database successfully seeded with 10 products and 1 admin user!' });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ message: 'Error seeding database: ' + error.message });
  }
});

export default router;
