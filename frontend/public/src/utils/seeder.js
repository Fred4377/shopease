import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import bcrypt from 'bcryptjs';

dotenv.config();
connectDB();

const importData = async () => {
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
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('123456', 10),
      },
    ]);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = [
      {
        name: 'iPhone 15 Pro',
        image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'The latest iPhone with incredible camera capabilities.',
        category: 'Electronics',
        price: 999.99,
        stock: 10,
        rating: 4.8,
        numReviews: 12,
        user: adminUser,
      },
      {
        name: 'Nike Running Shoes',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Comfortable and lightweight running shoes for athletes.',
        category: 'Sports',
        price: 89.99,
        stock: 25,
        rating: 4.5,
        numReviews: 8,
        user: adminUser,
      },
      {
        name: 'JavaScript: The Definitive Guide',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'The complete guide to mastering JavaScript programming.',
        category: 'Books',
        price: 29.99,
        stock: 50,
        rating: 4.9,
        numReviews: 45,
        user: adminUser,
      },
      {
        name: 'Sony Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Noise-cancelling wireless headphones for an immersive experience.',
        category: 'Electronics',
        price: 149.99,
        stock: 15,
        rating: 4.7,
        numReviews: 24,
        user: adminUser,
      },
      {
        name: 'Linen Casual T-Shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Premium linen t-shirt perfect for summer days.',
        category: 'Clothing',
        price: 24.99,
        stock: 100,
        rating: 4.3,
        numReviews: 31,
        user: adminUser,
      },
      {
        name: 'Ceramic Coffee Mug',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Handcrafted ceramic mug for your morning coffee.',
        category: 'Home',
        price: 14.99,
        stock: 40,
        rating: 4.6,
        numReviews: 18,
        user: adminUser,
      },
      {
        name: 'Yoga Mat',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Eco-friendly non-slip yoga mat.',
        category: 'Sports',
        price: 35.00,
        stock: 30,
        rating: 4.4,
        numReviews: 22,
        user: adminUser,
      },
      {
        name: 'Dell XPS 15 Laptop',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Powerful laptop for professionals and creators.',
        category: 'Electronics',
        price: 1899.99,
        stock: 5,
        rating: 4.8,
        numReviews: 55,
        user: adminUser,
      },
      {
        name: 'Denim Jacket',
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Classic blue denim jacket for a timeless look.',
        category: 'Clothing',
        price: 59.99,
        stock: 20,
        rating: 4.5,
        numReviews: 14,
        user: adminUser,
      },
      {
        name: 'Modern Desk Lamp',
        image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Minimalist desk lamp with adjustable brightness.',
        category: 'Home',
        price: 45.00,
        stock: 12,
        rating: 4.2,
        numReviews: 9,
        user: adminUser,
      }
    ];

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
