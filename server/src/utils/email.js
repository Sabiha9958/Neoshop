const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const templates = {
  welcome: (data) => ({
    subject: 'Welcome to NeoShop! 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: white; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00f5ff; font-size: 28px; margin: 0;">NeoShop</h1>
          <p style="color: #39ff14; margin: 5px 0;">Futuristic Shopping Experience</p>
        </div>
        
        <h2 style="color: #00f5ff;">Welcome, ${data.name}! 🎉</h2>
        
        <p>Thank you for joining NeoShop, the future of e-commerce. You're now part of our cyber community!</p>
        
        <div style="background: rgba(0, 245, 255, 0.1); padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #00f5ff;">
          <h3 style="color: #39ff14; margin-top: 0;">What's Next?</h3>
          <ul style="color: #fff;">
            <li>Explore our futuristic product catalog</li>
            <li>Customize your profile and preferences</li>
            <li>Enjoy exclusive member benefits</li>
            <li>Experience cutting-edge shopping technology</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}" style="background: linear-gradient(135deg, #00f5ff, #bf00ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Start Shopping</a>
        </div>
        
        <p style="color: #888; font-size: 14px; text-align: center;">
          Need help? Contact our support team at support@neoshop.com
        </p>
      </div>
    `
  }),

  orderConfirmation: (data) => ({
    subject: `Order Confirmation - ${data.orderNumber} 📦`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: white; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00f5ff; font-size: 28px; margin: 0;">NeoShop</h1>
          <p style="color: #39ff14; margin: 5px 0;">Order Confirmation</p>
        </div>
        
        <h2 style="color: #00f5ff;">Hi ${data.customerName}! 👋</h2>
        
        <p>Your order has been confirmed and is being processed. Here are the details:</p>
        
        <div style="background: rgba(0, 245, 255, 0.1); padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #00f5ff;">
          <h3 style="color: #39ff14; margin-top: 0;">Order #${data.orderNumber}</h3>
          
          <div style="margin: 20px 0;">
            <h4 style="color: #00f5ff;">Items Ordered:</h4>
            ${data.items.map(item => `
              <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 10px; background: rgba(255, 255, 255, 0.05); border-radius: 5px;">
                <span>${item.name} (x${item.quantity})</span>
                <span>₹${item.total}</span>
              </div>
            `).join('')}
          </div>
          
          <div style="border-top: 1px solid #00f5ff; padding-top: 15px; margin-top: 15px;">
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #39ff14;">
              <span>Total: ₹${data.total}</span>
            </div>
          </div>
        </div>
        
        <p>We'll send you another email once your order has shipped. Thank you for shopping with NeoShop!</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/profile/orders" style="background: linear-gradient(135deg, #00f5ff, #bf00ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Track Order</a>
        </div>
        
        <p style="color: #888; font-size: 14px; text-align: center;">
          Questions? Contact us at support@neoshop.com
        </p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, template, data }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent;
    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else {
      emailContent = { subject, html: data.html || data.text };
    }

    const mailOptions = {
      from: `"NeoShop" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = { sendEmail };
