const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ status: 'unread' });
    
    res.json({
      success: true,
      notifications,
      total,
      unreadCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
    
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications',
      message: error.message
    });
  }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      notification
    });
    
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    console.error('Error fetching notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notification',
      message: error.message
    });
  }
};

// Create notification (from contact form)
exports.createNotification = async (req, res) => {
  try {
    console.log('📨 Creating notification with data:', req.body);
    
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }
    
    // Create notification in database
    const notification = new Notification({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    });
    
    console.log('💾 Saving to database...');
    await notification.save();
    console.log('✅ Saved to database:', notification._id);
    
    // Send thank you email to customer (in background, don't wait for it)
    try {
      await sendThankYouEmail(name, email, subject);
      console.log('✅ Thank you email sent');
    } catch (emailError) {
      console.error('⚠️ Failed to send thank you email:', emailError.message);
      // Don't fail the request if email fails
    }
    
    // Send notification to admin (in background)
    try {
      await sendAdminNotification(name, email, subject, message);
      console.log('✅ Admin notification sent');
    } catch (adminEmailError) {
      console.error('⚠️ Failed to send admin notification:', adminEmailError.message);
    }
    
    // Send success response
    res.status(201).json({
      success: true,
      message: 'Message sent successfully. Thank you for your feedback!',
      notification: {
        _id: notification._id,
        name: notification.name,
        email: notification.email,
        subject: notification.subject,
        status: notification.status,
        createdAt: notification.createdAt
      }
    });
    
    console.log('🎉 Request completed successfully');
    
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    console.error('Error stack:', error.stack);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', ')
      });
    }
    
    // Check if it's a duplicate error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
      message: error.message
    });
  }
};

// Mark as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        status: 'read',
        readAt: new Date()
      },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
    
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update notification',
      message: error.message
    });
  }
};

// Mark as replied
exports.markAsReplied = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        status: 'replied',
        repliedAt: new Date()
      },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification marked as replied',
      notification
    });
    
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    console.error('Error marking notification as replied:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update notification',
      message: error.message
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
    
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification',
      message: error.message
    });
  }
};

// Email Functions

// Send thank you email (fire and forget)
async function sendThankYouEmail(name, email, subject) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Frozo <alberttitto111@gmail.com>',
      to: email,
      subject: 'Thank You for Contacting Frozo!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You for Contacting Frozo</title>
          <style>
            /* Reset and base styles */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
              line-height: 1.6;
              color: #333333;
              background-color: #f8f9fa;
              margin: 0;
              padding: 20px;
            }
            
            /* Email container */
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }
            
            /* Header - Matching Frozo website gradient */
            .email-header {
              background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%);
              padding: 40px 30px;
              text-align: center;
              color: white;
            }
            
            .email-header h1 {
              font-size: 32px;
              font-weight: 900;
              margin-bottom: 10px;
              text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            .email-header p {
              font-size: 18px;
              opacity: 0.9;
              font-weight: 500;
            }
            
            /* Content section */
            .email-content {
              padding: 40px 30px;
            }
            
            .welcome-section {
              text-align: center;
              margin-bottom: 30px;
            }
            
            
            
            .welcome-section h2 {
              color: #1a237e;
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 15px;
            }
            
            .welcome-section p {
              color: #333333;
              font-size: 16px;
              line-height: 1.6;
            }
            
            /* Message details - Matching website cards */
            .message-details {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 25px;
              margin: 25px 0;
              border-left: 5px solid #2196F3;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
              border: 1px solid #e0e0e0;
            }
            
            .message-details h3 {
              color: #1a237e;
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 15px;
            }
            
            .message-details p {
              color: #333333;
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 10px;
            }
            
            /* Thank you message - Matching website alerts */
            .thank-you-message {
              background-color: #FFF8E1;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
              border: 1px solid #FFD54F;
            }
            
            .thank-you-message p {
              color: #333333;
              font-size: 16px;
              line-height: 1.6;
              margin: 0;
            }
            
            /* Contact info - Matching website footer style */
            .contact-info {
              background-color: #F5F5F5;
              border-radius: 8px;
              padding: 25px;
              margin: 25px 0;
            }
            
            .contact-info h3 {
              color: #1a237e;
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 15px;
            }
            
            .contact-info ul {
              list-style: none;
              padding: 0;
            }
            
            .contact-info li {
              color: #333333;
              font-size: 15px;
              margin-bottom: 8px;
              padding-left: 24px;
              position: relative;
            }
            
            .contact-info li:before {
              content: "•";
              color: #2196F3;
              font-size: 20px;
              position: absolute;
              left: 0;
              top: -2px;
            }
            
            /* Signature */
            .signature {
              text-align: center;
              padding-top: 25px;
              border-top: 1px solid #E0E0E0;
              margin-top: 25px;
            }
            
            .signature p {
              color: #666666;
              font-size: 15px;
              margin-bottom: 5px;
            }
            
            /* Footer - Matching website footer */
            .email-footer {
              background-color: #1a237e;
              padding: 30px;
              text-align: center;
              color: white;
            }
            
            .footer-logo {
              font-size: 24px;
              font-weight: 700;
              color: white;
              margin-bottom: 15px;
              text-decoration: none;
            }
            
            .footer-address {
              font-size: 14px;
              margin-bottom: 20px;
              opacity: 0.9;
            }
            
            .social-links {
              display: flex;
              justify-content: center;
              gap: 15px;
              margin-bottom: 20px;
            }
            
            .social-link {
              color: white;
              text-decoration: none;
              font-size: 14px;
              opacity: 0.8;
              transition: opacity 0.2s;
            }
            
            .social-link:hover {
              opacity: 1;
            }
            
            .copyright {
              font-size: 12px;
              opacity: 0.7;
              margin-top: 15px;
            }
            
            /* Responsive styles */
            @media (max-width: 480px) {
              body {
                padding: 10px;
              }
              
              .email-header {
                padding: 30px 20px;
              }
              
              .email-header h1 {
                font-size: 26px;
              }
              
              .email-content {
                padding: 30px 20px;
              }
              
              .welcome-section h2 {
                font-size: 24px;
              }
              
              .email-footer {
                padding: 25px 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            
            <!-- Header matching Frozo website -->
            <div class="email-header">
              <h1>Frozo</h1>
              <p>Premium Frozen Foods</p>
            </div>
            
            <!-- Main content -->
            <div class="email-content">
              
              <!-- Welcome section -->
              <div class="welcome-section">
            
                <h2>Thank You, ${name}!</h2>
                <p>We appreciate you reaching out to us. Your message has been received and our team will review it shortly.</p>
              </div>
              
              <!-- Message details -->
              <div class="message-details">
                <h3>Message Details</h3>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Received:</strong> ${new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              
              <!-- Thank you message -->
              <div class="thank-you-message">
                <p><strong>🕒 Our Response Time:</strong><br>
                Thank you for your feedback! We will review your message and respond to you as soon as possible, typically within 24 hours during business days.</p>
              </div>
              
              <!-- Contact information -->
              <div class="contact-info">
                <h3>Need Immediate Assistance?</h3>
                <ul>
                  <li><strong>Phone:</strong> (123) 456-7890</li>
                  <li><strong>Email:</strong> support@frozo.com</li>
                  <li><strong>Business Hours:</strong> Mon-Fri: 8am-8pm EST</li>
                </ul>
              </div>
              
              <!-- Signature -->
              <div class="signature">
                <p>Best regards,</p>
                <p><strong>The Frozo Team</strong></p>
              </div>
              
            </div>
            
            <!-- Footer matching Frozo website -->
            <div class="email-footer">
              <div class="footer-logo">Frozo</div>
              <div class="footer-address">
                733 Suffolk Ave, Brentwood, NY 11717, United States
              </div>
              <div class="social-links">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="social-link">Home</a>
                <span style="color: rgba(255,255,255,0.5);">•</span>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" class="social-link">Products</a>
                <span style="color: rgba(255,255,255,0.5);">•</span>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/about" class="social-link">About</a>
                <span style="color: rgba(255,255,255,0.5);">•</span>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" class="social-link">Contact</a>
              </div>
              <div class="copyright">
                © ${new Date().getFullYear()} Frozo. All rights reserved.<br>
                <a href="mailto:unsubscribe@frozo.com" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 11px;">Unsubscribe</a>
              </div>
            </div>
            
          </div>
        </body>
        </html>
      `,
      text: `Dear ${name},

Thank you for contacting Frozo!

We have received your message regarding: "${subject}"

Thank you for your feedback! We will review your message and respond to you as soon as possible, typically within 24 hours during business days.

For immediate assistance:
• Phone: (123) 456-7890
• Email: support@frozo.com
• Business Hours: Mon-Fri 8am-8pm EST

Best regards,
The Frozo Team

Frozo Headquarters
733 Suffolk Ave, Brentwood, NY 11717, United States

© ${new Date().getFullYear()} Frozo. All rights reserved.`
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Thank you email sent to: ${email} (Message ID: ${info.messageId})`);
    return info;
    
  } catch (error) {
    console.error('❌ Error sending thank you email:', error);
    throw error;
  }
}

// Update the sendAdminNotification function to match website style:

async function sendAdminNotification(name, email, subject, message) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Frozo <alberttitto111@gmail.com>',
      to: process.env.ADMIN_EMAIL || 'alberttitto111@gmail.com',
      subject: `📨 New Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Message - Frozo Admin</title>
          <style>
            /* Same base styles as above */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 20px; }
            .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
            
            /* Admin-specific header */
            .admin-header {
              background: linear-gradient(135deg, #FF4081 0%, #FF79B0 100%);
              padding: 40px 30px;
              text-align: center;
              color: white;
            }
            
            .admin-header h1 {
              font-size: 32px;
              font-weight: 900;
              margin-bottom: 10px;
              text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            .admin-header p {
              font-size: 18px;
              opacity: 0.9;
              font-weight: 500;
            }
            
            .admin-content { padding: 40px 30px; }
            
            .alert-box {
              background-color: #FFF8E1;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 25px;
              border: 1px solid #FFD54F;
              text-align: center;
            }
            
            .alert-box h2 {
              color: #FF9800;
              font-size: 24px;
              margin-bottom: 10px;
            }
            
            .customer-info {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 25px;
              margin: 20px 0;
              border: 1px solid #e0e0e0;
              box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }
            
            .customer-info h3 {
              color: #1a237e;
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #2196F3;
            }
            
            .info-row {
              display: flex;
              margin-bottom: 12px;
              padding-bottom: 12px;
              border-bottom: 1px solid #f0f0f0;
            }
            
            .info-label {
              font-weight: 600;
              color: #1a237e;
              min-width: 120px;
            }
            
            .info-value {
              color: #333;
              flex: 1;
            }
            
            .message-content {
              background-color: #F5F5F5;
              border-radius: 8px;
              padding: 25px;
              margin: 25px 0;
              border-left: 4px solid #2196F3;
            }
            
            .message-content h3 {
              color: #1a237e;
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 15px;
            }
            
            .message-text {
              color: #333;
              font-size: 15px;
              line-height: 1.6;
              white-space: pre-wrap;
              background: white;
              padding: 20px;
              border-radius: 4px;
              border: 1px solid #e0e0e0;
            }
            
            .action-button {
              display: inline-block;
              background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%);
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
              transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .action-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
            }
            
            .admin-footer {
              background-color: #1a237e;
              padding: 25px;
              text-align: center;
              color: white;
              font-size: 14px;
              opacity: 0.9;
            }
            
            @media (max-width: 480px) {
              .info-row { flex-direction: column; }
              .info-label { margin-bottom: 5px; }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            
            <div class="admin-header">
              <h1>New Message Alert</h1>
              <p>Frozo Admin Panel</p>
            </div>
            
            <div class="admin-content">
              
              <div class="alert-box">
                <h2>📨 New Contact Form Submission</h2>
                <p>A customer has sent a new message through the Frozo website.</p>
              </div>
              
              <div class="customer-info">
                <h3>Customer Information</h3>
                <div class="info-row">
                  <div class="info-label">From:</div>
                  <div class="info-value">${name} &lt;${email}&gt;</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Subject:</div>
                  <div class="info-value">${subject}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Received:</div>
                  <div class="info-value">${new Date().toLocaleString()}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Status:</div>
                  <div class="info-value"><strong style="color: #FF4081;">Unread</strong></div>
                </div>
              </div>
              
              <div class="message-content">
                <h3>Message Content</h3>
                <div class="message-text">${message}</div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.ADMIN_PANEL_URL || 'http://localhost:3000/admin/notifications'}" class="action-button">
                  🔍 View in Admin Panel
                </a>
              </div>
              
            </div>
            
            <div class="admin-footer">
              <p>Frozo Admin System | This is an automated notification</p>
              <p style="font-size: 12px; margin-top: 10px; opacity: 0.7;">
                © ${new Date().getFullYear()} Frozo. All rights reserved.
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notification email sent (Message ID: ${info.messageId})`);
    return info;
    
  } catch (error) {
    console.error('❌ Error sending admin notification:', error);
    throw error;
  }
}