# Production Deployment Checklist

## 📋 Pre-Deployment

### 1. M-Pesa Production Setup
- [ ] Create production app on Safaricom Daraja Portal
- [ ] Get production Consumer Key and Consumer Secret
- [ ] Get production Shortcode and Passkey
- [ ] Update `.env` with production credentials
- [ ] Set `MPESA_ENV=production`
- [ ] Configure production callback URL
- [ ] Test with small amounts first

### 2. Email Configuration
- [ ] Set up professional email (business@delama.com)
- [ ] Consider using SendGrid/Mailgun for better deliverability
- [ ] Set up SPF, DKIM, and DMARC records
- [ ] Test email delivery
- [ ] Update email templates with branding

### 3. SMS Configuration
- [ ] Purchase Africa's Talking credits
- [ ] Verify sender ID
- [ ] Test SMS delivery
- [ ] Set up production phone numbers

### 4. Security
- [ ] Create `.env` file (never commit to git)
- [ ] Use strong, unique passwords
- [ ] Enable HTTPS/SSL certificate
- [ ] Implement rate limiting
- [ ] Add CORS restrictions
- [ ] Sanitize all user inputs
- [ ] Add request validation middleware

### 5. Code Review
- [ ] Remove all console.log statements
- [ ] Remove test/debug code
- [ ] Verify error handling
- [ ] Check for hardcoded credentials
- [ ] Optimize images
- [ ] Minify CSS/JS (optional)

### 6. Database Setup (Recommended)
- [ ] Set up MongoDB or PostgreSQL
- [ ] Create orders collection/table
- [ ] Create customers collection/table
- [ ] Implement data backup strategy
- [ ] Set up database indexes

## 🚀 Deployment Steps

### Option A: VPS/Cloud Server (Recommended)

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

#### 2. Deploy Application
```bash
# Clone repository
git clone your-repo-url
cd DELAMA/Deploy/home

# Install dependencies
npm install --production

# Create .env file
nano .env
# (paste your production environment variables)

# Start with PM2
pm2 start server.js --name delama-shop
pm2 save
pm2 startup
```

#### 3. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/delama
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/delama /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option B: Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create delama-shop

# Set environment variables
heroku config:set MPESA_CONSUMER_KEY=your_key
heroku config:set MPESA_CONSUMER_SECRET=your_secret
# ... (set all env variables)

# Deploy
git push heroku main

# Open app
heroku open
```

### Option C: Vercel (Frontend Only)

For static frontend without backend:
```bash
npm install -g vercel
vercel login
vercel
```

Note: You'll need separate backend hosting for M-Pesa API.

## ✅ Post-Deployment

### 1. Testing
- [ ] Test all pages load correctly
- [ ] Test navigation between pages
- [ ] Test product images display
- [ ] Test cart functionality
- [ ] Test checkout form validation
- [ ] Test M-Pesa payment (small amount)
- [ ] Verify email notifications received
- [ ] Verify SMS notifications received
- [ ] Test on mobile devices
- [ ] Test on different browsers

### 2. Monitoring
- [ ] Set up error logging (e.g., Sentry)
- [ ] Configure uptime monitoring (e.g., UptimeRobot)
- [ ] Set up Google Analytics
- [ ] Monitor server resources
- [ ] Check PM2 logs regularly: `pm2 logs delama-shop`

### 3. Backup
- [ ] Set up automated database backups
- [ ] Backup environment variables
- [ ] Document server configuration
- [ ] Keep code repository updated

### 4. Performance
- [ ] Enable gzip compression
- [ ] Optimize images (compress)
- [ ] Implement caching headers
- [ ] Use CDN for static assets (optional)
- [ ] Monitor page load times

### 5. SEO & Marketing
- [ ] Add meta descriptions
- [ ] Set up Google Search Console
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Set up social media meta tags
- [ ] Configure Google My Business

## 🔒 Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] SQL injection prevention (if using SQL)
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secure headers (helmet.js)
- [ ] Regular security updates

## 📱 Mobile Testing

Test on actual devices:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad/Android)
- [ ] Different screen sizes
- [ ] Touch interactions
- [ ] Form inputs on mobile
- [ ] Payment flow on mobile

## 🎯 Go-Live Checklist

- [ ] Domain name configured
- [ ] DNS records updated
- [ ] SSL certificate active
- [ ] All environment variables set
- [ ] Database connected and tested
- [ ] M-Pesa production credentials active
- [ ] Email sending working
- [ ] SMS sending working
- [ ] Error monitoring active
- [ ] Backup system running
- [ ] All tests passed
- [ ] Team trained on order processing
- [ ] Customer support ready
- [ ] Payment reconciliation process defined

## 📞 Emergency Contacts

- **Safaricom M-Pesa Support**: apioperations@safaricom.co.ke
- **Server Provider Support**: [Your provider]
- **Domain Registrar**: [Your registrar]
- **Email Service**: [Your service]
- **SMS Service**: support@africastalking.com

## 🔄 Maintenance

### Daily
- [ ] Check for new orders
- [ ] Monitor error logs
- [ ] Verify payment reconciliation

### Weekly
- [ ] Review server performance
- [ ] Check backup integrity
- [ ] Update inventory (if applicable)
- [ ] Review customer feedback

### Monthly
- [ ] Security updates
- [ ] Performance optimization
- [ ] Analytics review
- [ ] Backup testing

## 📊 Success Metrics to Track

- Total orders
- Conversion rate
- Average order value
- Payment success rate
- Page load times
- Mobile vs desktop traffic
- Cart abandonment rate
- Customer acquisition cost

---

## 🆘 Troubleshooting

### M-Pesa Issues
**Problem**: Payment not initiating
- Check internet connectivity
- Verify credentials are correct
- Ensure phone number format is correct (254XXXXXXXXX)
- Check M-Pesa API status

**Problem**: Callback not received
- Verify callback URL is publicly accessible
- Check firewall settings
- Review server logs
- Test callback URL with Postman

### Email Issues
**Problem**: Emails not sending
- Check email credentials
- Verify SMTP settings
- Check spam folder
- Review email service logs

### Server Issues
**Problem**: Site not loading
- Check server status: `pm2 status`
- Review logs: `pm2 logs delama-shop`
- Check Nginx: `sudo systemctl status nginx`
- Verify DNS settings

---

**Good luck with your deployment! 🚀**
