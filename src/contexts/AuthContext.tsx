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
  signup: (email: string, password: string, name: string, adminCode?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_SECRET_CODE = 'ADMIN2025'; // Change this to your secret admin code

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          
          // Trigger redirect after userData is set
          if (shouldRedirect) {
            setTimeout(() => {
              const redirectPath = data.role === 'admin' ? '/admin' : '/dashboard';
              window.location.href = redirectPath;
              setShouldRedirect(false);
            }, 100);
          }
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [shouldRedirect]);

  const signup = async (email: string, password: string, name: string, adminCode?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const role = adminCode === ADMIN_SECRET_CODE ? 'admin' : 'citizen';
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      });
      
      toast.success(role === 'admin' ? 'Admin account created successfully!' : 'Account created successfully!');
      setShouldRedirect(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      setShouldRedirect(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      throw error;
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

  return (
    <AuthContext.Provider value={{ user, userData, loading, signup, login, logout }}>
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
