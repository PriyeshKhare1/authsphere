// Script to create an admin user securely
// Run with: node src/scripts/createAdmin.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdminUser() {
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database\n');

    console.log('='.repeat(50));
    console.log('🔐 ADMIN USER CREATION');
    console.log('='.repeat(50));
    console.log('⚠️  This script creates an admin user with full privileges.\n');

    // Get admin details
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 chars): ');

    // Validate input
    if (!name || !email || !password) {
      console.log('\n❌ Error: All fields are required');
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('\n❌ Error: Password must be at least 6 characters');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`\n❌ Error: User with email "${email}" already exists`);
      process.exit(1);
    }

    // Create admin user
    console.log('\n⏳ Creating admin user...');
    const adminUser = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isEmailVerified: true, // Admin users are automatically verified
      emailVerificationToken: undefined,
      emailVerificationExpires: undefined,
    });

    console.log('\n' + '='.repeat(50));
    console.log('✅ ADMIN USER CREATED SUCCESSFULLY');
    console.log('='.repeat(50));
    console.log(`\n📧 Email: ${adminUser.email}`);
    console.log(`👤 Name: ${adminUser.name}`);
    console.log(`🔑 Role: ${adminUser.role}`);
    console.log(`✓  Email Verified: ${adminUser.isEmailVerified}`);
    console.log(`🆔 User ID: ${adminUser._id}`);
    console.log('\n🎉 Admin can now log in with these credentials!\n');

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    process.exit(0);
  }
}

// Run the script
createAdminUser();
