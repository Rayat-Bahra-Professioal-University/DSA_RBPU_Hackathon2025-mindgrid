# 📧 Email Setup Guide for CityCare

## 🎯 **Step-by-Step Email Setup with EmailJS**

EmailJS is a **FREE** service that allows you to send emails directly from your React app without a backend server.

---

## **Step 1: Create EmailJS Account**

1. **Go to [EmailJS.com](https://www.emailjs.com/)**
2. **Click "Sign Up"** (it's completely free)
3. **Create your account** using Google, GitHub, or email
4. **Verify your email** if required

---

## **Step 2: Set Up Email Service**

1. **Login to your EmailJS dashboard**
2. **Click "Email Services"** in the left sidebar
3. **Click "Add New Service"**
4. **Choose your email provider:**
   - **Gmail** (recommended - easiest)
   - **Outlook**
   - **Yahoo**
   - **Custom SMTP**

### **For Gmail (Recommended):**
1. **Select "Gmail"**
2. **Click "Connect Account"**
3. **Sign in to your Gmail account**
4. **Allow EmailJS to access your Gmail**
5. **Copy the Service ID** (looks like `service_1234567`)

---

## **Step 3: Create Email Template**

1. **Click "Email Templates"** in the left sidebar
2. **Click "Create New Template"**
3. **Use this template:**

### **Subject Line:**
```
Report Confirmation - {{unique_id}} | CityCare
```

### **Email Body (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">🏛️ CityCare</h1>
    <p style="margin: 8px 0 0 0; opacity: 0.9;">Your report has been successfully submitted!</p>
  </div>
  
  <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2>Hello {{to_name}},</h2>
    
    <p>Thank you for reporting a city problem! Your report has been received and assigned a unique tracking ID.</p>
    
    <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; font-size: 18px; font-weight: bold;">
      📋 Tracking ID: {{unique_id}}
    </div>
    
    <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 16px 0; color: #1f2937;">📝 Report Details</h3>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
        <span style="font-weight: 600; color: #374151;">📍 Location:</span>
        <span style="color: #6b7280;">{{location}}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
        <span style="font-weight: 600; color: #374151;">🔧 Problem Type:</span>
        <span style="color: #6b7280;">{{problem_type}}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="font-weight: 600; color: #374151;">📅 Submitted:</span>
        <span style="color: #6b7280;">{{current_date}}</span>
      </div>
    </div>
    
    <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <h3 style="margin: 0 0 8px 0; color: #1e40af;">🔍 How to Track Your Report</h3>
      <p style="margin: 0; color: #1e40af;">Use your tracking ID <strong>{{unique_id}}</strong> to check the status of your report anytime on our website.</p>
    </div>
    
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <h3 style="margin: 0 0 8px 0; color: #92400e;">⏭️ What Happens Next?</h3>
      <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #92400e;">
        <li>Your report will be reviewed by our admin team</li>
        <li>You'll receive email updates when the status changes</li>
        <li>Our team will work to resolve the issue as quickly as possible</li>
        <li>You can track progress using your unique ID</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://your-website.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
        🏠 View Your Reports
      </a>
    </div>
  </div>
  
  <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
    <p style="margin: 0; color: #6b7280;">
      <strong>CityCare</strong> - Making our cities better, one report at a time<br>
      <a href="https://your-website.com" style="color: #3b82f6; text-decoration: none;">Visit our website</a>
    </p>
  </div>
</div>
```

4. **Save the template**
5. **Copy the Template ID** (looks like `template_1234567`)

---

## **Step 4: Get Your Public Key**

1. **Click "Account"** in the left sidebar
2. **Find "Public Key"** section
3. **Copy your Public Key** (looks like `user_1234567890abcdef`)

---

## **Step 5: Update Your Code**

1. **Open** `road-care-watch/src/lib/emailClient.ts`
2. **Replace these lines:**

```typescript
// Replace these with your actual EmailJS values:
const EMAILJS_SERVICE_ID = 'service_1234567'; // Your Service ID
const EMAILJS_TEMPLATE_ID = 'template_1234567'; // Your Template ID  
const EMAILJS_PUBLIC_KEY = 'your_public_key_here'; // Your Public Key
```

**With your actual values:**
```typescript
const EMAILJS_SERVICE_ID = 'service_abcdef123'; // Your actual Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789'; // Your actual Template ID
const EMAILJS_PUBLIC_KEY = 'user_1234567890abcdef'; // Your actual Public Key
```

---

## **Step 6: Test Your Setup**

1. **Start your development server:**
   ```bash
   cd road-care-watch
   npm run dev
   ```

2. **Open your website**
3. **Submit a test report**
4. **Check your email** - you should receive a confirmation email!

---

## **Step 7: Create Status Update Template (Optional)**

For admin status updates, create another template:

1. **Create a new template** in EmailJS
2. **Use this subject:**
   ```
   Status Update - {{unique_id}} | CityCare
   ```

3. **Use this body:**
   ```html
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
     <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
       <h1 style="margin: 0; font-size: 28px;">🏛️ CityCare</h1>
       <p style="margin: 8px 0 0 0; opacity: 0.9;">Status Update for Your Report</p>
     </div>
     
     <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
       <h2>Hello {{to_name}},</h2>
       
       <p>Your report <strong>{{unique_id}}</strong> at <strong>{{location}}</strong> has been updated:</p>
       
       <div style="display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; background-color: #d1fae5; color: #065f46;">
         Status: {{status}}
       </div>
       
       <p>You can track all your reports on our website.</p>
       
       <div style="text-align: center; margin: 30px 0;">
         <a href="https://your-website.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
           🏠 View Your Reports
         </a>
       </div>
     </div>
   </div>
   ```

---

## **🎉 You're Done!**

Your email system is now fully functional! Users will receive:
- ✅ **Confirmation emails** when they submit reports
- ✅ **Status update emails** when admins change report status
- ✅ **Professional HTML emails** with tracking IDs

---

## **📊 EmailJS Limits (Free Plan)**

- **200 emails per month** (perfect for testing)
- **Unlimited templates**
- **All features included**

For production, you can upgrade to paid plans for more emails.

---

## **🔧 Troubleshooting**

**If emails don't work:**
1. **Check browser console** for error messages
2. **Verify your EmailJS credentials** are correct
3. **Make sure your Gmail account** is properly connected
4. **Check spam folder** - emails might be filtered

**Common issues:**
- Wrong Service ID, Template ID, or Public Key
- Gmail not properly connected
- Template variables not matching ({{unique_id}} vs {{unique_id}})

---

## **💡 Pro Tips**

1. **Test with your own email first**
2. **Use a dedicated Gmail account** for your app
3. **Keep your credentials secure** - don't commit them to public repos
4. **Monitor your email usage** in EmailJS dashboard

**Your CityCare app now has professional email notifications! 🚀**
