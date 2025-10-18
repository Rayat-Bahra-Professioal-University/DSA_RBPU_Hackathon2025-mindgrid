// Client-side email service using EmailJS (free service)

import emailjs from '@emailjs/browser';

export interface EmailData {
  userName: string;
  userEmail: string;
  uniqueId: string;
  location: string;
  problemType: string;
  status?: string;
}

export interface FixedEmailData {
  userName: string;
  userEmail: string;
  uniqueId: string;
  location: string;
  problemType: string;
  fixedDate: string;
  reportDate: string;
}

// EmailJS configuration - YOU NEED TO SET THESE UP
const EMAILJS_SERVICE_ID = 'service_4edtir9'; // Replace with your actual Service ID
const EMAILJS_TEMPLATE_ID = 'template_vmzl628'; // Replace with your actual Template ID for report submission
const EMAILJS_FIXED_TEMPLATE_ID = 'template_zun966y'; // NEW: Template ID for fixed notifications
const EMAILJS_PUBLIC_KEY = 'JkhWHOZeJxg8hkPow'; // Replace with your actual Public Key

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Real email notification function using EmailJS
export const sendEmailNotification = async (emailData: EmailData): Promise<boolean> => {
  try {
    console.log('Sending email notification:', emailData);
    
    // Prepare template parameters
    const templateParams = {
      to_email: emailData.userEmail,
      to_name: emailData.userName,
      unique_id: emailData.uniqueId,
      location: emailData.location,
      problem_type: emailData.problemType,
      status: emailData.status || 'Submitted',
      current_date: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Send email using EmailJS
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
};

// Email templates for display
export const getEmailTemplate = (emailData: EmailData) => {
  return {
    subject: `Report Confirmation - ${emailData.uniqueId} | CityCare`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🏛️ CityCare</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">Your report has been successfully submitted!</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2>Hello ${emailData.userName},</h2>
          
          <p>Thank you for reporting a city problem! Your report has been received and assigned a unique tracking ID.</p>
          
          <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; font-size: 18px; font-weight: bold;">
            📋 Tracking ID: ${emailData.uniqueId}
          </div>
          
          <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 16px 0; color: #1f2937;">📝 Report Details</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
              <span style="font-weight: 600; color: #374151;">📍 Location:</span>
              <span style="color: #6b7280;">${emailData.location}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
              <span style="font-weight: 600; color: #374151;">🔧 Problem Type:</span>
              <span style="color: #6b7280;">${emailData.problemType.charAt(0).toUpperCase() + emailData.problemType.slice(1)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: 600; color: #374151;">📅 Submitted:</span>
              <span style="color: #6b7280;">${new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
          
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <h3 style="margin: 0 0 8px 0; color: #1e40af;">🔍 How to Track Your Report</h3>
            <p style="margin: 0; color: #1e40af;">Use your tracking ID <strong>${emailData.uniqueId}</strong> to check the status of your report anytime on our website.</p>
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
          
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <p style="margin: 0; color: #6b7280;">
            <strong>CityCare</strong> - Making our cities better, one report at a time<br>
            <a href="/" style="color: #3b82f6; text-decoration: none;">Visit our website</a> | 
            <a href="/contact" style="color: #3b82f6; text-decoration: none;">Contact Support</a>
          </p>
        </div>
      </div>
    `
  };
};

// Status update email template
export const getStatusUpdateTemplate = (emailData: EmailData) => {
  return {
    subject: `Status Update - ${emailData.uniqueId} | CityCare`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🏛️ CityCare</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">Status Update for Your Report</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2>Hello ${emailData.userName},</h2>
          
          <p>Your report <strong>${emailData.uniqueId}</strong> at <strong>${emailData.location}</strong> has been updated:</p>
          
          <div style="display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; background-color: #d1fae5; color: #065f46;">
            Status: ${emailData.status?.charAt(0).toUpperCase() + emailData.status?.slice(1) || 'Updated'}
          </div>
          
          <p>You can track all your reports on our website.</p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <p style="margin: 0; color: #6b7280;"><strong>CityCare</strong> - Making our cities better, one report at a time</p>
        </div>
      </div>
    `
  };
};

// NEW: Send "Problem Fixed" email notification
export const sendProblemFixedEmail = async (emailData: FixedEmailData): Promise<boolean> => {
  try {
    console.log('Sending problem fixed email:', emailData);
    
    // Prepare template parameters for fixed email
    const templateParams = {
      to_email: emailData.userEmail,
      to_name: emailData.userName,
      unique_id: emailData.uniqueId,
      location: emailData.location,
      problem_type: emailData.problemType,
      fixed_date: emailData.fixedDate,
      report_date: emailData.reportDate,
      current_date: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Send email using EmailJS with the fixed template
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_FIXED_TEMPLATE_ID,
      templateParams
    );

    console.log('Problem fixed email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending problem fixed email:', error);
    return false;
  }
};

// Generate HTML content for "Problem Fixed" email
export const generateFixedEmailHTML = (emailData: FixedEmailData): string => {
  const htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Problem Fixed!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your city problem has been resolved</p>
      </div>
      
      <div style="padding: 30px;">
        <h2>Hello ${emailData.userName},</h2>
        
        <p>Great news! Your reported problem has been <strong style="color: #10b981;">successfully fixed</strong>:</p>
        
        <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #065f46;">📋 Report Details</h3>
          <p style="margin: 5px 0;"><strong>Tracking ID:</strong> ${emailData.uniqueId}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${emailData.location}</p>
          <p style="margin: 5px 0;"><strong>Problem Type:</strong> ${emailData.problemType}</p>
          <p style="margin: 5px 0;"><strong>Reported:</strong> ${emailData.reportDate}</p>
          <p style="margin: 5px 0;"><strong>Fixed:</strong> ${emailData.fixedDate}</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #065f46;">✅ Status: FIXED</h3>
          <p style="margin: 0; color: #047857; font-weight: 600;">Thank you for helping make our city better!</p>
        </div>
        
        <p>Your report has been successfully resolved. We appreciate your contribution to keeping our city clean and safe.</p>
        
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #374151;">💡 How to help further:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
            <li>Continue reporting any new problems you notice</li>
            <li>Share CityCare with your friends and neighbors</li>
            <li>Rate the quality of fixes when prompted</li>
          </ul>
        </div>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
        <p style="margin: 0; color: #6b7280;"><strong>CityCare</strong> - Making our cities better, one report at a time</p>
        <p style="margin: 5px 0 0 0; color: #9ca3af; font-size: 14px;">Thank you for being an active citizen!</p>
      </div>
    </div>
  `;
  
  return htmlContent;
};
