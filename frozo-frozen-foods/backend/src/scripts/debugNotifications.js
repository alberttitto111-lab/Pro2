// backend/src/scripts/debugNotifications.js
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
require('dotenv').config();

async function debugNotifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');
    
    // Count all notifications
    const count = await Notification.countDocuments({});
    console.log(`📊 Total notifications in database: ${count}`);
    
    // Get recent notifications
    const recentNotifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(5);
    
    console.log('\n📨 Recent notifications:');
    recentNotifications.forEach((notif, index) => {
      console.log(`\n[${index + 1}] ${notif._id}`);
      console.log(`   Name: ${notif.name}`);
      console.log(`   Email: ${notif.email}`);
      console.log(`   Subject: ${notif.subject}`);
      console.log(`   Status: ${notif.status}`);
      console.log(`   Created: ${notif.createdAt}`);
    });
    
    // Count unread
    const unreadCount = await Notification.countDocuments({ status: 'unread' });
    console.log(`\n🔴 Unread notifications: ${unreadCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugNotifications();