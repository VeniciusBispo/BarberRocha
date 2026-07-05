export interface User {
  id: string;
  name: string;
  phone: string;
  isAdmin: boolean;
  mustChangePassword?: boolean;
}

export interface LoginData {
  phone: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  phone: string;
  password?: string;
  isAdmin?: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  completePasswordChange: () => void;
}

export interface AppointmentData {
  service: string;
  price: number;
  duration: number;
  barber: string;
  date: string;
  time: string;
  name: string;
  phone: string;
}

export interface Appointment {
  _id: string;
  userId: User; // User populado
  service: string;
  price: number;
  duration: number;
  barber: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
  updatedAt: string;
}
