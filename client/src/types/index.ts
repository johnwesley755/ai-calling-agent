export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Call {
  _id: string;
  userId: string;
  phoneNumber: string;
  script: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  transcript: string;
  response: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  createdAt: string;
  updatedAt: string;
}

export interface CallRequest {
  phoneNumbers: string[];
  script: string;
}