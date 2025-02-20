export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    credit: number;
    // ... autres champs
  }
  
  export interface AuthState {
    user: User | null;
    permissions: string[];
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }