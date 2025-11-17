// M-Pesa Express (STK Push) API Integration
// This is a Node.js/Express backend for M-Pesa Daraja API

const express = require('express');
const axios = require('axios');
const router = express.Router();

// M-Pesa Configuration (Replace with your actual credentials)
const MPESA_CONFIG = {
    consumerKey: process.env.MPESA_CONSUMER_KEY || 'YOUR_CONSUMER_KEY',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || 'YOUR_CONSUMER_SECRET',
    shortcode: process.env.MPESA_SHORTCODE || 'YOUR_SHORTCODE',
    passkey: process.env.MPESA_PASSKEY || 'YOUR_PASSKEY',
    callbackUrl: process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/mpesa/callback',
    environment: process.env.MPESA_ENV || 'sandbox' // 'sandbox' or 'production'
};

// Base URLs
const BASE_URL = MPESA_CONFIG.environment === 'sandbox' 
    ? 'https://sandbox.safaricom.co.ke' 
    : 'https://api.safaricom.co.ke';

// Email configuration (using nodemailer)
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
});

// SMS configuration (using Africa's Talking or similar)
const AfricasTalking = require('africastalking');
const africastalking = AfricasTalking({
    apiKey: process.env.AT_API_KEY || 'YOUR_API_KEY',
    username: process.env.AT_USERNAME || 'sandbox'
});
const sms = africastalking.SMS;

// Get M-Pesa Access Token
async function getAccessToken() {
    try {
        const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString('base64');
        
        const response = await axios.get(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response?.data || error.message);
        throw new Error('Failed to get M-Pesa access token');
    }
}

// Generate Password for STK Push
function generatePassword() {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${MPESA_CONFIG.shortcode}${MPESA_CONFIG.passkey}${timestamp}`).toString('base64');
    return { password, timestamp };
}

// Initiate M-Pesa STK Push
router.post('/initiate', async (req, res) => {
    try {
        const { customerName, phone, email, location, items, total } = req.body;
        
        // Validate request
        if (!phone || !total || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
        
        // Get access token
        const accessToken = await getAccessToken();
        
        // Generate password and timestamp
        const { password, timestamp } = generatePassword();
        
        // Prepare STK Push request
        const stkPushData = {
            BusinessShortCode: MPESA_CONFIG.shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(total),
            PartyA: phone,
            PartyB: MPESA_CONFIG.shortcode,
            PhoneNumber: phone,
            CallBackURL: MPESA_CONFIG.callbackUrl,
            AccountReference: `DELAMA-${Date.now()}`,
            TransactionDesc: `Payment for DELAMA Compression Socks`
        };
        
        // Send STK Push
        const response = await axios.post(
            `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
            stkPushData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // Store order details temporarily (use database in production)
        const orderDetails = {
            checkoutRequestId: response.data.CheckoutRequestID,
            customerName,
            phone,
            email,
            location,
            items,
            total,
            timestamp: new Date().toISOString()
        };
        
        // In production, save to database
        // await saveOrderToDatabase(orderDetails);
        
        res.json({
            success: true,
            message: 'STK Push sent successfully',
            checkoutRequestId: response.data.CheckoutRequestID
        });
        
    } catch (error) {
        console.error('M-Pesa initiation error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to initiate payment',
            error: error.response?.data || error.message
        });
    }
});

// M-Pesa Callback Handler
router.post('/callback', async (req, res) => {
    try {
        const { Body } = req.body;
        const { stkCallback } = Body;
        
        const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = stkCallback;
        
        if (ResultCode === 0) {
            // Payment successful
            const metadata = {};
            CallbackMetadata.Item.forEach(item => {
                metadata[item.Name] = item.Value;
            });
            
            // Extract payment details
            const paymentDetails = {
                amount: metadata.Amount,
                mpesaReceiptNumber: metadata.MpesaReceiptNumber,
                transactionDate: metadata.TransactionDate,
                phoneNumber: metadata.PhoneNumber
            };
            
            // Retrieve order details from database using CheckoutRequestID
            // const orderDetails = await getOrderFromDatabase(CheckoutRequestID);
            
            // Send confirmation email to customer
            await sendCustomerEmail({
                to: 'customer@email.com', // Get from order details
                subject: 'Order Confirmation - DELAMA Compression Socks',
                orderDetails: paymentDetails
            });
            
            // Send notification to business
            await sendBusinessNotification({
                paymentDetails,
                checkoutRequestId: CheckoutRequestID
            });
            
            console.log('Payment successful:', paymentDetails);
        } else {
            // Payment failed
            console.log('Payment failed:', ResultDesc);
        }
        
        // Always respond with success to M-Pesa
        res.json({ ResultCode: 0, ResultDesc: 'Success' });
        
    } catch (error) {
        console.error('Callback error:', error);
        res.json({ ResultCode: 0, ResultDesc: 'Success' });
    }
});

// Send Email to Customer
async function sendCustomerEmail({ to, subject, orderDetails }) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: `
                <h2>Thank you for your order!</h2>
                <p>Your payment has been received successfully.</p>
                <h3>Payment Details:</h3>
                <ul>
                    <li>Receipt Number: ${orderDetails.mpesaReceiptNumber}</li>
                    <li>Amount: Ksh ${orderDetails.amount}</li>
                    <li>Date: ${orderDetails.transactionDate}</li>
                </ul>
                <p>We will process your order and contact you shortly for delivery.</p>
                <p>Thank you for choosing DELAMA Compression Socks!</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Customer email sent successfully');
    } catch (error) {
        console.error('Error sending customer email:', error);
    }
}

// Send Notification to Business (Email + SMS)
async function sendBusinessNotification({ paymentDetails, checkoutRequestId }) {
    try {
        // Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.BUSINESS_EMAIL || 'business@delama.com',
            subject: 'New Order Received - DELAMA',
            html: `
                <h2>New Order Alert!</h2>
                <p>A new order has been placed and payment received.</p>
                <h3>Payment Details:</h3>
                <ul>
                    <li>Receipt Number: ${paymentDetails.mpesaReceiptNumber}</li>
                    <li>Amount: Ksh ${paymentDetails.amount}</li>
                    <li>Phone: ${paymentDetails.phoneNumber}</li>
                    <li>Date: ${paymentDetails.transactionDate}</li>
                    <li>Checkout ID: ${checkoutRequestId}</li>
                </ul>
                <p>Please process this order for delivery.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Business email sent successfully');
        
        // Send SMS
        const smsOptions = {
            to: [process.env.BUSINESS_PHONE || '+254712345678'],
            message: `New DELAMA order! Amount: Ksh ${paymentDetails.amount}. Receipt: ${paymentDetails.mpesaReceiptNumber}. Check email for details.`
        };
        
        await sms.send(smsOptions);
        console.log('Business SMS sent successfully');
        
    } catch (error) {
        console.error('Error sending business notification:', error);
    }
}

module.exports = router;
