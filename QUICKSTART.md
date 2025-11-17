# Quick Start Guide - DELAMA E-Commerce

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

### Step 2: Create Environment File

Copy the example environment file:

```bash
copy .env.example .env
```

Or manually create `.env` file with this content:

```env
# M-Pesa (Use sandbox for testing)
MPESA_CONSUMER_KEY=your_key_here
MPESA_CONSUMER_SECRET=your_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_here
MPESA_CALLBACK_URL=http://localhost:3000/api/mpesa/callback
MPESA_ENV=sandbox

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Business
BUSINESS_EMAIL=business@delama.com
BUSINESS_PHONE=+254712345678

# Server
PORT=3000
NODE_ENV=development
```

### Step 3: Start the Server

```bash
npm start
```

Visit: **http://localhost:3000**

## 📱 Testing Without Backend

If you just want to test the frontend without M-Pesa integration:

1. Simply open `shop.html` in your browser
2. The cart and checkout will work in "demo mode"
3. Payment will show a test message instead of actual M-Pesa

## 🔧 Getting M-Pesa Credentials (Sandbox)

1. Go to https://developer.safaricom.co.ke/
2. Sign up / Login
3. Click "My Apps" → "Create New App"
4. Select "Lipa Na M-Pesa Sandbox"
5. Copy your **Consumer Key** and **Consumer Secret**
6. Get test credentials from the sandbox page

**Test Phone Number**: 254708374149  
**Test PIN**: 1234

## 📧 Gmail App Password Setup

1. Go to your Google Account
2. Security → 2-Step Verification (enable it)
3. Security → App Passwords
4. Select "Mail" and generate
5. Copy the 16-character password to `.env`

## 🎨 Customization

### Change Product Prices
Edit `shop.html` - find the product cards and update the price.

### Add More Products
Copy a product card in `shop.html`:

```html
<div class="product-card">
    <img src="images/your-image.jpg" alt="Product Name">
    <h3>Product Name</h3>
    <p class="price">Ksh 1,200</p>
    <button onclick="addToCart('Product Name', 1200, 'images/your-image.jpg')">Add to Cart</button>
</div>
```

### Change Colors
Edit `shop-styles.css` - look for color codes like `#ff6347` and change them.

## 📱 Mobile Testing

The site is fully responsive! Test on:
- Chrome DevTools (F12 → Device Toolbar)
- Your actual phone
- Tablet

## ⚠️ Common Issues

### Port Already in Use
Change PORT in `.env` to something else like 3001

### M-Pesa Not Working
- Check you're using sandbox credentials
- Verify callback URL is accessible
- For local testing, use ngrok to expose your server

### Emails Not Sending
- Make sure 2FA is enabled on Gmail
- Use App Password, not your regular password
- Check spam folder

## 🎯 Next Steps

1. **Test the shop page** - Add items to cart
2. **Try checkout** - Fill in the form
3. **Get M-Pesa credentials** - For real payments
4. **Customize branding** - Update colors, logo, content
5. **Deploy to production** - See README.md for deployment options

## 📞 Need Help?

Check the full README.md for detailed documentation.

---

**Happy Selling! 🧦**
