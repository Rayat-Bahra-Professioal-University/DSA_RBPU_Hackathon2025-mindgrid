import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      about: "About",
      report: "Report",
      contact: "Contact",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      dashboard: "Dashboard",
      
      // Hero Section
      heroTitle: "Fix the Roads, Save Lives",
      heroSubtitle: "Report potholes in your area and help make our roads safer for everyone",
      reportPothole: "Report a Pothole",
      viewMap: "View Map",
      
      // Stats
      totalReports: "Total Reports",
      fixed: "Fixed",
      pending: "Pending",
      inProgress: "In Progress",
      
      // Auth
      email: "Email",
      password: "Password",
      name: "Name",
      adminCode: "Admin Code (Optional)",
      adminCodeHint: "Enter admin code to register as admin",
      loginTitle: "Login to Your Account",
      signupTitle: "Create New Account",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      
      // Report Form
      reportFormTitle: "Report a Pothole",
      location: "Location",
      description: "Description",
      uploadPhoto: "Upload Photo",
      submit: "Submit",
      descriptionPlaceholder: "Describe the pothole condition, size, and any safety concerns",
      
      // Dashboard
      myReports: "My Reports",
      allReports: "All Reports",
      analytics: "Analytics",
      status: "Status",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      updateStatus: "Update Status",
      
      // Status
      statusPending: "Pending",
      statusInProgress: "In Progress",
      statusFixed: "Fixed",
      
      // Messages
      loginSuccess: "Logged in successfully",
      signupSuccess: "Account created successfully",
      reportSubmitted: "Report submitted successfully",
      reportUpdated: "Report updated successfully",
      reportDeleted: "Report deleted successfully",
      error: "An error occurred",
      
      // Footer
      allRightsReserved: "All Rights Reserved",
      language: "Language",
    }
  },
  hi: {
    translation: {
      // Navigation
      home: "होम",
      about: "परिचय",
      report: "रिपोर्ट",
      contact: "संपर्क",
      login: "लॉगिन",
      signup: "साइन अप",
      logout: "लॉगआउट",
      dashboard: "डैशबोर्ड",
      
      // Hero Section
      heroTitle: "सड़कों की मरम्मत करें, जीवन बचाएं",
      heroSubtitle: "अपने क्षेत्र में गड्ढों की रिपोर्ट करें और हमारी सड़कों को सभी के लिए सुरक्षित बनाने में मदद करें",
      reportPothole: "गड्ढा रिपोर्ट करें",
      viewMap: "नक्शा देखें",
      
      // Stats
      totalReports: "कुल रिपोर्ट",
      fixed: "ठीक किया गया",
      pending: "लंबित",
      inProgress: "प्रगति में",
      
      // Auth
      email: "ईमेल",
      password: "पासवर्ड",
      name: "नाम",
      adminCode: "एडमिन कोड (वैकल्पिक)",
      adminCodeHint: "एडमिन के रूप में रजिस्टर करने के लिए एडमिन कोड दर्ज करें",
      loginTitle: "अपने खाते में लॉगिन करें",
      signupTitle: "नया खाता बनाएं",
      alreadyHaveAccount: "क्या आपके पास पहले से एक खाता मौजूद है?",
      dontHaveAccount: "क्या आपके पास खाता नहीं है?",
      
      // Report Form
      reportFormTitle: "गड्ढा रिपोर्ट करें",
      location: "स्थान",
      description: "विवरण",
      uploadPhoto: "फोटो अपलोड करें",
      submit: "सबमिट करें",
      descriptionPlaceholder: "गड्ढे की स्थिति, आकार और किसी भी सुरक्षा चिंता का वर्णन करें",
      
      // Dashboard
      myReports: "मेरी रिपोर्ट",
      allReports: "सभी रिपोर्ट",
      analytics: "विश्लेषण",
      status: "स्थिति",
      actions: "क्रियाएं",
      edit: "संपादित करें",
      delete: "हटाएं",
      updateStatus: "स्थिति अपडेट करें",
      
      // Status
      statusPending: "लंबित",
      statusInProgress: "प्रगति में",
      statusFixed: "ठीक किया गया",
      
      // Messages
      loginSuccess: "सफलतापूर्वक लॉगिन हो गया",
      signupSuccess: "खाता सफलतापूर्वक बनाया गया",
      reportSubmitted: "रिपोर्ट सफलतापूर्वक सबमिट की गई",
      reportUpdated: "रिपोर्ट सफलतापूर्वक अपडेट की गई",
      reportDeleted: "रिपोर्ट सफलतापूर्वक हटाई गई",
      error: "एक त्रुटि हुई",
      
      // Footer
      allRightsReserved: "सर्वाधिकार सुरक्षित",
      language: "भाषा",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
