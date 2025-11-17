# DELAMA Compression Socks E-Commerce Platform

A modern, mobile-responsive e-commerce website for selling compression socks with M-Pesa Express payment integration.

## Features

- ✅ **Responsive Design** - Optimized for mobile, tablet, and desktop
- ✅ **Shopping Cart** - Add/remove items with quantity management
- ✅ **M-Pesa Express Integration** - STK Push payment system
- ✅ **Email Notifications** - Automated emails to customers and business
- ✅ **SMS Notifications** - Business alerts for new orders
- ✅ **Product Showcase** - Beautiful product gallery with sliders
- ✅ **Customer Testimonials** - Social proof section
- ✅ **Instructions Page** - How to wear compression socks
- ✅ **Why Page** - Educational content about compression socks

## Pages

1. **Home** (`index.html`) - Landing page with hero, features, products, testimonials
2. **Shop** (`shop.html`) - Full product catalog with cart and checkout
3. **Why** (`Why/why.html`) - Benefits and use cases for compression socks
4. **Instructions** (`instructions/index.html`) - Step-by-step wearing guide

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# M-Pesa Configuration (Get from Safaricom Daraja Portal)
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
MPESA_ENV=sandbox  # or 'production'

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # Use Gmail App Password

# Business Contact
BUSINESS_EMAIL=business@delama.com
BUSINESS_PHONE=+254712345678

# Africa's Talking SMS (Optional)
AT_API_KEY=your_africastalking_api_key
AT_USERNAME=sandbox  # or your username

# Server
PORT=3000
NODE_ENV=development
```

### 3. M-Pesa Setup

#### Get M-Pesa Credentials:
1. Go to [Safaricom Daraja Portal](https://developer.safaricom.co.ke/)
2. Create an account and login
3. Create a new app (Sandbox or Production)
4. Get your Consumer Key and Consumer Secret
5. For STK Push, get your Shortcode and Passkey

#### Configure Callback URL:
- For development, use ngrok or similar to expose your local server
- For production, use your actual domain

### 4. Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App Passwords
   - Generate password for "Mail"
3. Use this app password in `.env`

### 5. SMS Setup (Optional - Africa's Talking)

1. Sign up at [Africa's Talking](https://africastalking.com/)
2. Get your API Key and Username
3. Add to `.env` file

## Running the Application

### Development Mode

```bash
npm run dev
```

This starts the server with nodemon for auto-restart on file changes.

### Production Mode

```bash
npm start
```

The server will run on `http://localhost:3000` (or your specified PORT)

## Project Structure

```
DELAMA/
├── index.html              # Home page
├── shop.html              # Shop page with cart
├── shop-styles.css        # Shop page styles
├── shop-script.js         # Shop functionality & cart
├── styles.css             # Main styles
├── scripts.js             # Main scripts
├── server.js              # Express server
├── package.json           # Dependencies
├── .env                   # Environment variables (create this)
├── .env.example           # Environment template
├── Why/
│   ├── why.html          # Why page
│   ├── why-style.css     # Why page styles
│   └── why-script.js     # Why page scripts
├── instructions/
│   ├── index.html        # Instructions page
│   ├── style.css         # Instructions styles
│   ├── script.js         # Instructions scripts
│   └── images/           # Instruction images
├── images/               # Product images
└── api/
    └── mpesa.js          # M-Pesa API integration
```

## API Endpoints

### POST `/api/mpesa/initiate`
Initiates M-Pesa STK Push payment

**Request Body:**
```json
{
  "customerName": "John Doe",
  "phone": "254712345678",
  "email": "john@example.com",
  "location": "Nairobi",
  "items": [...],
  "total": 1500
}
```

**Response:**
```json
{
  "success": true,
  "message": "STK Push sent successfully",
  "checkoutRequestId": "ws_CO_123456789"
}
```

### POST `/api/mpesa/callback`
M-Pesa callback handler (called by Safaricom)

## Mobile Responsiveness

The application is fully responsive with breakpoints at:
- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: ≤ 480px

## Testing M-Pesa (Sandbox)

1. Use test credentials from Daraja Portal
2. Use test phone number: `254708374149`
3. Test PIN: `1234`

## Deployment

### Option 1: Traditional Hosting (VPS/Cloud)

1. Set up a VPS (DigitalOcean, AWS, etc.)
2. Install Node.js
3. Clone repository
4. Install dependencies
5. Configure environment variables
6. Set up PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name delama
   pm2 save
   pm2 startup
   ```
7. Configure Nginx as reverse proxy
8. Set up SSL certificate (Let's Encrypt)

### Option 2: Vercel (Frontend Only)

For static pages without backend:
```bash
vercel deploy
```

Note: For M-Pesa integration, you'll need a separate backend server.

### Option 3: Heroku

1. Create Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy:
   ```bash
   git push heroku main
   ```

## Important Notes

### Security
- Never commit `.env` file to version control
- Use HTTPS in production
- Validate all user inputs
- Implement rate limiting for API endpoints
- Use secure session management

### M-Pesa Production
- Test thoroughly in sandbox before going live
- Update callback URL to production domain
- Use production credentials
- Implement proper error handling and logging

### Email Deliverability
- Consider using SendGrid or Mailgun for production
- Set up SPF, DKIM, and DMARC records
- Monitor email delivery rates

## Troubleshooting

### M-Pesa Issues
- **401 Unauthorized**: Check consumer key/secret
- **500 Error**: Verify shortcode and passkey
- **Callback not received**: Check callback URL is publicly accessible

### Email Issues
- **Authentication failed**: Verify app password
- **Emails not sending**: Check Gmail security settings

### SMS Issues
- **Invalid credentials**: Verify Africa's Talking API key
- **SMS not delivered**: Check phone number format (254XXXXXXXXX)

## Support

For issues or questions:
- Email: support@delama.com
- Phone: +254712345678

## License

Copyright © 2025 DELAMA Compression Socks. All rights reserved.
