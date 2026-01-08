// backend/src/scripts/testEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('🔧 Testing email configuration...\n');
  
  // Check if email credentials are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not found in .env file');
    console.log('Please set EMAIL_USER and EMAIL_PASS in your .env file');
    return;
  }
  
  console.log('📧 Email User:', process.env.EMAIL_USER);
  console.log('🔑 Email Password:', process.env.EMAIL_PASS ? '***' : 'Not set');
  console.log('📨 Email From:', process.env.EMAIL_FROM);
  console.log('👑 Admin Email:', process.env.ADMIN_EMAIL);
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    // Verify connection
    console.log('\n🔗 Testing connection to email server...');
    await transporter.verify();
    console.log('✅ Email server connection successful!');

    // Send test email
    console.log('\n📤 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'Frozo Email Test',
      text: 'This is a test email from Frozo backend system.',
      html: '<h1>✅ Frozo Email Test</h1><p>This is a test email from Frozo backend system.</p>'
    });

    console.log('✅ Test email sent successfully!');
    console.log('📫 Message ID:', info.messageId);
    
  } catch (error) {
    console.error('\n❌ Email test failed:', error.message);
    
    // Provide troubleshooting tips
    console.log('\n🔧 Troubleshooting tips for Gmail:');
    console.log('1. Enable 2-Factor Authentication on your Google account');
    console.log('2. Generate an App Password:');
    console.log('   - Go to https://myaccount.google.com/apppasswords');
    console.log('   - Select "Mail" as the app');
    console.log('   - Select "Other (Custom name)" as the device');
    console.log('   - Name it "Frozo Backend"');
    console.log('   - Copy the 16-character password');
    console.log('   - Use it as EMAIL_PASS in .env file');
    console.log('\n3. Make sure "Less secure app access" is enabled (if not using 2FA)');
    console.log('4. Check if your account has any security restrictions');
  }
}

testEmail();