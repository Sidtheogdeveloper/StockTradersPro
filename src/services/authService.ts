import { User, LoginCredentials, SignupCredentials } from '../types/auth';

// Mock user storage - in production, this would be a real backend
const USERS_KEY = 'stock_app_users';
const CURRENT_USER_KEY = 'stock_app_current_user';

const getStoredUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getStoredUsers();
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In production, you'd verify the password hash
    if (credentials.password !== 'password') {
      throw new Error('Invalid password');
    }
    
    setCurrentUser(user);
    return user;
  },

  async signup(credentials: SignupCredentials): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getStoredUsers();
    
    if (users.find(u => u.email === credentials.email)) {
      throw new Error('Email already exists');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name,
      watchlist: [],
      createdAt: new Date()
    };
    
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    
    return newUser;
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    setCurrentUser(null);
  },

  getCurrentUser(): User | null {
    return getCurrentUser();
  },

  async updateWatchlist(userId: string, watchlist: string[]): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users[userIndex].watchlist = watchlist;
    saveUsers(users);
    
    const updatedUser = users[userIndex];
    setCurrentUser(updatedUser);
    
    return updatedUser;
  }
};