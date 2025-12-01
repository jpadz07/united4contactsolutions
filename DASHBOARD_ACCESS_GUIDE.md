# Dashboard Access Guide

This guide will walk you through accessing the United4ContactSolutions Admin Dashboard.

## 📋 Prerequisites

- A web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection
- Admin credentials (provided by your administrator)

---

## 🚀 Step-by-Step Instructions

### Step 1: Navigate to the Login Page

1. Open your web browser
2. Go to the admin login page:
   ```
   http://localhost:3000/admin
   ```
   **For production:**
   ```
   https://your-domain.com/admin
   ```

### Step 2: Enter Your Credentials

1. **Email Address:**
   - Enter: `admin@united4contactsolutions.com`
   - Or use your assigned admin email

2. **Password:**
   - Enter: `SecurePass123!`
   - Or use your assigned password

### Step 3: Optional - Remember Me

- ✅ **Check "Remember me"** if you want to:
  - Stay logged in for 30 days
  - Have your email auto-filled on next visit
- ⬜ **Leave unchecked** for a standard 2-hour session

### Step 4: Sign In

1. Click the **"Sign In"** button
2. Wait for authentication (usually takes 1-2 seconds)
3. You will be automatically redirected to the dashboard

### Step 5: Access Dashboard

After successful login, you will be redirected to:
```
http://localhost:3000/admin/dashboard?t=encrypted_token
```

The dashboard URL includes an encrypted token for security.

---

## 🎯 Dashboard Features

Once logged in, you can:

- **Overview** - View metrics and quick actions
- **Header & Hero** - Edit company name, tagline, and hero section
- **Core Values** - Update your company's core values
- **About Us** - Edit About Us, Mission, and Vision content
- **Services** - Manage your service offerings
- **Team** - Update team member information
- **Projects** - Showcase featured projects
- **Testimonials** - Manage client testimonials
- **Settings** - Configure dashboard settings

---

## 🔒 Security Features

### URL Encryption
- The dashboard URL is automatically encrypted after login
- You cannot access the dashboard without a valid encrypted token
- The token is validated on every page load

### Session Management
- **Standard Session:** 2 hours (if "Remember me" is unchecked)
- **Extended Session:** 30 days (if "Remember me" is checked)
- Session automatically extends on user activity

### Logout
1. Click the **"Logout"** button in the sidebar
2. A confirmation dialog will appear
3. Click **"Logout"** to confirm or **"Cancel"** to stay logged in

---

## ❓ Troubleshooting

### Issue: "Invalid credentials" error
**Solution:**
- Double-check your email and password
- Ensure there are no extra spaces
- Contact your administrator if credentials don't work

### Issue: Redirected back to login page
**Solution:**
- Your session may have expired
- Log in again
- Check "Remember me" for longer sessions

### Issue: Cannot access dashboard URL directly
**Solution:**
- This is normal security behavior
- You must log in through `/admin` first
- The system will generate a secure URL automatically

### Issue: "Verifying authentication..." loading screen
**Solution:**
- Wait a few seconds for authentication to complete
- If it persists, refresh the page
- Clear browser cache and try again

---

## 📝 Quick Reference

### Default Credentials
```
Email: admin@united4contactsolutions.com
Password: SecurePass123!
```

### Important URLs
- **Login:** `/admin`
- **Dashboard:** `/admin/dashboard?t=encrypted_token` (auto-generated)

### Keyboard Shortcuts
- **ESC** - Close modals/dialogs (if applicable)
- **Tab** - Navigate between form fields

---

## 🔐 Best Practices

1. **Never share your credentials** with anyone
2. **Log out** when finished, especially on shared computers
3. **Use "Remember me"** only on trusted devices
4. **Keep your password secure** and change it regularly
5. **Report suspicious activity** to your administrator immediately

---

## 📞 Support

If you encounter any issues accessing the dashboard:

1. Check this guide first
2. Verify your credentials are correct
3. Clear your browser cache and cookies
4. Try a different browser
5. Contact your system administrator

---

## 📌 Notes

- The dashboard requires an active internet connection
- All changes are saved to the Supabase database
- Changes appear on the landing page after saving
- The encrypted URL token changes with each login session

---

**Last Updated:** January 2025
**Version:** 1.0



