import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UserData {
  uid: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  authLoading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  promoteToAdmin: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_SECRET_CODE = 'ADMIN2025'; // Change this to your secret admin code

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user data in background without blocking
        if (!userData || userData.uid !== user.uid) {
          getDoc(doc(db, 'users', user.uid)).then(userDoc => {
            if (userDoc.exists()) {
              const data = userDoc.data() as UserData;
              setUserData(data);
            }
          }).catch(error => {
            console.error('Error fetching user data:', error);
          });
        }
        
        if (shouldRedirect) {
          const redirectPath = userData?.role === 'admin' ? '/admin' : '/dashboard';
          navigate(redirectPath);
          setShouldRedirect(false);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [shouldRedirect, userData, navigate]);

  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Check if email contains admin keywords anywhere in the email
      const adminKeywords = ['admin', 'hr', 'manager', 'supervisor', 'director', 'head', 'lead', 'chief'];
      const emailLower = email.toLowerCase();
      const isAdmin = adminKeywords.some(keyword => emailLower.includes(keyword));
      
      // Determine user role based on email
      const role = isAdmin ? 'admin' : 'citizen';
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      });
      
      toast.success(isAdmin ? 'Admin account created successfully!' : 'Account created successfully!');
      // Don't auto-redirect after signup, let user login manually
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };


  const login = async (email: string, password: string) => {
    if (authLoading) return; // Prevent multiple simultaneous logins
    
    setAuthLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data first to check role
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);
        
        // Check if user is admin - prevent admin login through user login page
        if (data.role === 'admin') {
          await signOut(auth); // Sign out the admin
          setUserData(null);
          toast.error('Admins must use the admin login page');
          throw new Error('Admin login not allowed through user login');
        }
        
        // Navigate to dashboard for regular users
        navigate('/dashboard');
        toast.success('Logged in successfully!');
      } else {
        toast.error('User data not found');
        throw new Error('User data not found');
      }
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  const promoteToAdmin = async (userId: string) => {
    try {
      // Only existing admins can promote users
      if (userData?.role !== 'admin') {
        throw new Error('Only admins can promote users');
      }
      
      await setDoc(doc(db, 'users', userId), {
        role: 'admin'
      }, { merge: true });
      
      toast.success('User promoted to admin successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to promote user');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, authLoading, signup, login, logout, promoteToAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
