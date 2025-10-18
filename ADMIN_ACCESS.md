# CityCare Admin Access

## Secret Admin Login

For authorized administrators only.

### Access URL
```
https://yourdomain.com/citycare-admin-secure
```

### Access Code
```
CITYCARE_ADMIN_2025
```

### Admin Credentials
Use your registered admin email and password.

## Security Features

1. **Hidden from Public Interface**: No admin login buttons visible to regular users
2. **Secret URL**: Only accessible via direct URL that's not discoverable
3. **Access Code Protection**: Additional security layer with secret code
4. **Role-based Redirects**: Automatically redirects based on user role

## How to Access

1. Navigate directly to: `/citycare-admin-secure`
2. Enter the access code: `CITYCARE_ADMIN_2025`
3. Enter your admin email and password
4. You'll be redirected to the admin dashboard

## Security Notes

- The admin login is completely hidden from the public interface
- Regular users cannot discover the admin access URL
- The access code provides an additional security layer
- All admin features are protected behind authentication

## Changing Access Code

To change the access code, update the `SecretAdmin.tsx` file:
```typescript
if (secretCode !== 'YOUR_NEW_SECRET_CODE') {
  toast.error('Invalid access code');
  return;
}
```

## Admin Features

- View all reports from citizens
- Update report statuses
- Manage user accounts
- Access analytics and insights
- Send notifications to users
