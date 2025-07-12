// Vote on answer
export interface VoteAnswerRequest {
  answerId: string;
  title: string;
  description: string;
  userId: string;
  vote: 1 | -1;
}
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  userName: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'USER';
  imageBuffer?: string; // Base64 encoded image
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      name: string;
      userName: string;
      email: string;
      role: 'ADMIN' | 'USER';
      imageId?: string;
    };
  };
}

export interface User {
  id: string;
  name: string;
  userName: string;
  email: string;
  role: 'ADMIN' | 'USER';
  imageId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth API functions
export const authAPI = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register new user
  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<{ success: boolean; message: string; data?: { user: User } }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Verify token
  verifyToken: async (): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-token');
    return response.data;
  },

  // Logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Image API functions
export const imageAPI = {
  // Get image by ID
  getImage: async (imageId: string): Promise<{ success: boolean; data?: { id: string; bufferString: string } }> => {
    const response = await api.get(`/images/${imageId}`);
    return response.data;
  },
};

// Answers API functions
export interface PostAnswerRequest {
  description: string;
  questionId: string;
  title?: string;
}

export const answersAPI = {
  postAnswer: async ({ description, questionId, title }: PostAnswerRequest) => {
    const user = authUtils.getUser();
    if (!user) throw new Error('User not logged in');
    const response = await api.post('/answers', {
      description,
      userId: user.id,
      questionId,
      ...(title !== undefined ? { title } : {}),
    });
    return response.data;
  },
  voteAnswer: async (voteData: VoteAnswerRequest) => {
    // Ensure userId is present and a string
    let userId = voteData.userId;
    if (!userId) {
      const user = authUtils.getUser();
      if (!user) throw new Error('User not logged in');
      userId = user.id;
    }
    const response = await api.put('/answers', { ...voteData, userId });
    return response.data;
  },
};

// Auth helper functions
export const authUtils = {
  // Save token to localStorage
  saveToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  // Save user data to localStorage
  saveUser: (user: User) => {
    localStorage.setItem('userData', JSON.stringify(user));
  },

  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  // Get user data from localStorage
  getUser: (): User | null => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  // Convert file to base64
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/...;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  },
};

export default api;
