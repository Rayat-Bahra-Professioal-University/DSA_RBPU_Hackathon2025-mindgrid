# 📧 Email Setup Guide for CityCare

This guide will help you set up email notifications using Nodemailer with Gmail SMTP.

## 🚀 Quick Setup

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Navigate to **Security** → **2-Step Verification**
- Enable 2-Factor Authentication if not already enabled

### 2. Generate App Password
- In Google Account settings, go to **Security** → **2-Step Verification**
- Scroll down to **App passwords**
- Click **Generate password**
- Select **Mail** as the app
- Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### 3. Create Environment File
Create a `.env` file in your project root:

```env
# Email Configuration
VITE_EMAIL_USER=your-email@gmail.com
VITE_EMAIL_PASS=your-16-character-app-password
VITE_BASE_URL=http://localhost:5173
```

### 4. Restart Development Server
```bash
npm run dev
```

## 📧 Email Features

### ✅ What's Included:
- **Report Confirmation Emails** - Sent when users submit reports
- **Status Update Emails** - Sent when admin changes report status
- **Beautiful HTML Templates** - Professional email design
- **Unique ID Tracking** - Each email includes tracking ID
- **Mobile-Responsive** - Emails look great on all devices

### 📨 Email Templates:
1. **Report Confirmation**
   - Welcome message with user's name
   - Unique tracking ID prominently displayed
   - Report details (location, problem type, date)
   - Instructions for tracking progress
   - Direct link to user dashboard

2. **Status Updates**
   - Status change notifications
   - Updated status badge
   - Link to view all reports

## 🔧 Configuration Options

### Gmail SMTP (Recommended - Free)
```typescript
// Already configured in emailService.ts
service: 'gmail',
auth: {
  user: 'your-email@gmail.com',
  pass: 'your-app-password'
}
```

### Other Email Providers
You can also use:
- **Outlook/Hotmail** - `service: 'hotmail'`
- **Yahoo** - `service: 'yahoo'`
- **Custom SMTP** - Configure manually

## 📊 Email Limits

| Provider | Free Limit | Paid Option |
|----------|------------|-------------|
| Gmail | 500/day | Google Workspace |
| Outlook | 300/day | Microsoft 365 |
| Yahoo | 500/day | Yahoo Business |

## 🧪 Testing Email Setup

### Test Connection
```typescript
import { testEmailConnection } from '@/lib/emailService';

// Test if email service is working
const isReady = await testEmailConnection();
console.log('Email service ready:', isReady);
```

### Test Email Sending
1. Submit a test report
2. Check your email inbox
3. Verify the email contains:
   - Unique tracking ID
   - Report details
   - Professional formatting

## 🚨 Troubleshooting

### Common Issues:

1. **"Invalid login" error**
   - Make sure you're using App Password, not regular password
   - Verify 2FA is enabled on your Google account

2. **"Less secure app access" error**
   - Use App Passwords instead of regular passwords
   - Don't enable "Less secure app access"

3. **Emails not sending**
   - Check your internet connection
   - Verify email credentials in `.env` file
   - Check console for error messages

4. **Emails going to spam**
   - Add your email to contacts
   - Check spam folder
   - Consider using a professional email service for production

## 🔒 Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use App Passwords** instead of regular passwords
3. **Rotate App Passwords** regularly
4. **Use environment variables** in production

## 📈 Production Deployment

### For Production:
1. **Use a professional email service** (SendGrid, Mailgun, etc.)
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Monitor email delivery rates**
4. **Set up email analytics**

### Environment Variables for Production:
```env
VITE_EMAIL_USER=your-production-email@yourdomain.com
VITE_EMAIL_PASS=your-production-password
VITE_BASE_URL=https://yourdomain.com
```

## 🎯 Email Content Customization

You can customize email templates in `src/lib/emailService.ts`:

- **HTML Templates** - Modify the `html` property
- **Text Templates** - Modify the `text` property
- **Subject Lines** - Change the `subject` property
- **Styling** - Update CSS in the `<style>` tags

## 📞 Support

If you need help with email setup:
1. Check the console for error messages
2. Verify your `.env` file configuration
3. Test with a simple email first
4. Check Gmail's security settings

---

**Your CityCare project now has professional email notifications! 🎉**
