# 🛣️ Road Care Watch

<div align="center">

![Road Care Watch Logo](https://img.shields.io/badge/Road%20Care%20Watch-Citizen%20Reporting%20System-blue?style=for-the-badge&logo=react)

**A comprehensive citizen reporting system for road maintenance and infrastructure management**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

Road Care Watch is a modern, full-stack web application designed to bridge the gap between citizens and municipal authorities for road maintenance issues. Built with cutting-edge technologies, it provides an intuitive platform for reporting, tracking, and managing road infrastructure problems in real-time.

### 🎯 **Key Objectives**
- **Democratize Infrastructure Reporting**: Enable any citizen to report road issues easily
- **Improve Response Times**: Streamline communication between citizens and authorities
- **Data-Driven Decisions**: Provide analytics for better infrastructure planning
- **Transparency**: Create accountability through public issue tracking

---

## ✨ Features

### 🚨 **Core Functionality**
- **Interactive Map Reporting**: Report issues directly on an interactive map interface
- **Multi-Media Support**: Upload photos and videos as evidence
- **Real-time Tracking**: Monitor issue status and progress
- **Priority Classification**: Automatic and manual priority assignment
- **Geographic Clustering**: Visualize issue patterns across regions

### 👥 **User Management**
- **Secure Authentication**: Firebase-based user authentication
- **Role-based Access**: Separate interfaces for citizens and administrators
- **Profile Management**: Comprehensive user profile system
- **Activity History**: Complete audit trail of user actions

### 📊 **Analytics & Reporting**
- **Real-time Dashboard**: Live statistics and metrics
- **Geographic Analytics**: Heat maps and distribution analysis
- **Trend Analysis**: Historical data and pattern recognition
- **Export Capabilities**: Generate reports in multiple formats

### 🔧 **Administrative Tools**
- **Issue Management**: Comprehensive issue lifecycle management
- **Bulk Operations**: Handle multiple issues simultaneously
- **Email Notifications**: Automated communication system
- **User Management**: Admin controls for user accounts

---

## 🛠️ Tech Stack

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | Core UI framework |
| **TypeScript** | 5.8.3 | Type-safe development |
| **Vite** | 5.4.19 | Build tool and dev server |
| **Tailwind CSS** | 3.4.17 | Utility-first styling |
| **Radix UI** | Latest | Accessible component library |
| **React Router** | 6.30.1 | Client-side routing |
| **React Hook Form** | 7.61.1 | Form management |
| **React Query** | 5.83.0 | Server state management |

### **Maps & Visualization**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Leaflet** | 1.9.4 | Interactive maps |
| **React Leaflet** | 5.0.0 | React integration for maps |
| **Recharts** | 2.15.4 | Data visualization |

### **Backend & Services**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Firebase** | 12.4.0 | Authentication & Database |
| **Firestore** | 12.4.0 | NoSQL database |
| **EmailJS** | 4.4.1 | Email service integration |
| **Firebase Storage** | 12.4.0 | File storage |

### **Development Tools**
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 9.32.0 | Code linting |
| **PostCSS** | 8.5.6 | CSS processing |
| **Autoprefixer** | 10.4.21 | CSS vendor prefixes |
| **Lovable Tagger** | 1.1.11 | Code organization |

---

## 📋 Requirements

### **System Requirements**
- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher (or yarn v1.22.0+)
- **Git**: v2.20.0 or higher
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### **Development Requirements**
- **Code Editor**: VS Code (recommended)
- **Browser DevTools**: For debugging
- **Git**: For version control
- **Firebase Account**: For backend services
- **EmailJS Account**: For email functionality

### **Production Requirements**
- **Web Server**: Nginx, Apache, or similar
- **SSL Certificate**: For HTTPS
- **CDN**: For static asset delivery (optional)
- **Monitoring**: Error tracking and analytics

---

## 🚀 Installation

### **1. Clone the Repository**
```bash
git clone https://github.com/Rayat-Bahra-Professioal-University/DSA_RBPU_Hackathon2025-mindgrid.git
cd DSA_RBPU_Hackathon2025-mindgrid
```

### **2. Install Dependencies**
```bash
npm install
# or
yarn install
```

### **3. Environment Configuration**
Create a `.env` file in the root directory:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Application Configuration
VITE_APP_NAME=Road Care Watch
VITE_APP_VERSION=1.0.0
```

### **4. Firebase Setup**
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Enable Storage
5. Copy configuration to `.env` file

### **5. EmailJS Setup**
1. Create account at [EmailJS](https://www.emailjs.com)
2. Create email service
3. Create email template
4. Get public key and add to `.env`

### **6. Start Development Server**
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to view the application.

---

## 📖 Usage

### **For Citizens**

#### **Reporting an Issue**
1. **Navigate to Map**: Click "Report Issue" on the homepage
2. **Select Location**: Click on the map where the issue is located
3. **Fill Details**: 
   - Select issue type (Pothole, Road Damage, Traffic Light, etc.)
   - Add description
   - Upload photos/videos
   - Set priority level
4. **Submit**: Click "Submit Report" to send the issue

#### **Tracking Reports**
1. **Login**: Access your account
2. **Dashboard**: View all your submitted reports
3. **Status Updates**: Check progress and updates
4. **Notifications**: Receive email updates on status changes

### **For Administrators**

#### **Managing Issues**
1. **Admin Login**: Access admin dashboard
2. **Review Reports**: See all submitted issues
3. **Assign Priority**: Set issue priority levels
4. **Update Status**: Mark issues as in-progress, resolved, etc.
5. **Communicate**: Send updates to reporters

#### **Analytics Dashboard**
1. **Statistics**: View comprehensive metrics
2. **Geographic Analysis**: See issue distribution
3. **Trend Analysis**: Monitor patterns over time
4. **Export Reports**: Generate detailed reports

---

## 📚 API Documentation

### **Authentication Endpoints**
```typescript
// User Registration
POST /api/auth/register
Body: { email: string, password: string, name: string }

// User Login
POST /api/auth/login
Body: { email: string, password: string }

// User Logout
POST /api/auth/logout
```

### **Issue Management**
```typescript
// Create Issue
POST /api/issues
Body: {
  title: string,
  description: string,
  location: { lat: number, lng: number },
  type: string,
  priority: 'high' | 'medium' | 'low',
  images: string[]
}

// Get Issues
GET /api/issues?status=pending&priority=high

// Update Issue
PUT /api/issues/:id
Body: { status: string, assignedTo: string }
```

### **User Management**
```typescript
// Get User Profile
GET /api/users/profile

// Update Profile
PUT /api/users/profile
Body: { name: string, phone: string, address: string }

// Get User Reports
GET /api/users/reports
```

---

## 🚀 Deployment

### **Vercel Deployment (Recommended)**

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Set production values

3. **Deploy**
   ```bash
   vercel --prod
   ```

### **Netlify Deployment**

1. **Build Configuration**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [build.environment]
     NODE_VERSION = "18"
   ```

2. **Deploy**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

### **Docker Deployment**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 🔧 Troubleshooting

### **Common Issues**

#### **Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 16+
```

#### **Firebase Connection Issues**
```bash
# Verify Firebase config
# Check .env file format
# Ensure Firebase project is active
```

#### **Map Not Loading**
```bash
# Check Leaflet CSS import
# Verify map container dimensions
# Check for JavaScript errors in console
```

#### **Email Not Sending**
```bash
# Verify EmailJS configuration
# Check service status
# Verify template ID and service ID
```

### **Performance Issues**

#### **Slow Loading**
- Enable code splitting
- Optimize images
- Use CDN for static assets
- Implement lazy loading

#### **Memory Leaks**
- Clean up event listeners
- Unsubscribe from observables
- Use React.memo for components
- Implement proper cleanup in useEffect

### **Debug Mode**
```bash
# Enable debug logging
VITE_DEBUG=true npm run dev

# Check network requests
# Use React DevTools
# Monitor Firebase console
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### **Code Standards**
- Follow TypeScript best practices
- Use meaningful variable names
- Write comprehensive tests
- Document complex functions
- Follow existing code style

### **Commit Convention**
```
feat: add new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
