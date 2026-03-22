export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Formula {
  id: string;
  name: string;
  category: string;
  description: string;
  latex: string;
  example: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
