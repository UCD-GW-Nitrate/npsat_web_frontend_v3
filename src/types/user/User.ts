export interface User {
  userId: number;
  username: string;
  isStaff: boolean;
  isSuperuser: boolean;
  isVerified: boolean;
  email: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
