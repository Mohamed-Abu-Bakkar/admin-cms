import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local first
config({ path: resolve(process.cwd(), '.env.local') });

async function seedDatabase() {
  // Dynamic imports after env is loaded
  const { connectDB } = await import('../lib/db');
  const { default: User } = await import('../models/User');
  const bcrypt = await import('bcryptjs');

  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      phone: '+1234567890',
    });

    console.log('Admin user created successfully:', adminUser.email);
    console.log('Login credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
