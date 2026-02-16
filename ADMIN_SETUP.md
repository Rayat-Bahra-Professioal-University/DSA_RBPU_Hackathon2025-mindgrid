# 🔐 Admin Setup Guide

## How to Create Admin Accounts

### **Method 1: Admin Signup (Recommended)**

1. **Go to the Auth page** (`/auth`)
2. **Click "Admin Signup"** button at the bottom
3. **Enter the admin code**: `ADMIN2025`
4. **Fill out the form** with admin details
5. **Submit** - the account will be created with admin privileges
6. **Login** with the new admin credentials
7. **You'll be redirected** to the admin dashboard (`/admin`)

### **Method 2: Promote Existing Users (For Existing Admins)**

If you already have admin access, you can promote existing users:

1. **Login as admin** and go to admin dashboard
2. **Find the user** you want to promote
3. **Use the promote function** (if implemented in admin dashboard)

## **Admin Code**

- **Current Admin Code**: `ADMIN2025`
- **Location**: `src/contexts/AuthContext.tsx` (line 34)
- **To Change**: Update the `ADMIN_SECRET_CODE` constant

## **User Flow**

### **Regular Users (Citizens)**
1. Sign up → Account created as "citizen"
2. Login → Redirected to `/dashboard`
3. Can report potholes and view their reports

### **Admin Users**
1. Sign up with admin code → Account created as "admin"
2. Login → Redirected to `/admin`
3. Can manage all reports, update statuses, etc.

## **Security Notes**

- The admin code is currently hardcoded for simplicity
- In production, consider implementing:
  - Email-based admin invitations
  - Role-based access control
  - Admin approval workflows
  - Audit logs for admin actions

## **Testing the System**

1. **Create a regular user**:
   - Go to `/auth`
   - Click "Sign Up"
   - Fill form and submit
   - Login with credentials
   - Should redirect to `/dashboard`

2. **Create an admin user**:
   - Go to `/auth`
   - Click "Admin Signup"
   - Enter admin code: `ADMIN2025`
   - Fill form and submit
   - Login with credentials
   - Should redirect to `/admin`

## **Troubleshooting**

- **Can't access admin dashboard**: Check if user role is set to "admin" in Firestore
- **Admin code not working**: Verify the code matches `ADMIN2025`
- **Redirect issues**: Check AuthContext redirect logic

---

**Need help?** Check the browser console for any error messages.

