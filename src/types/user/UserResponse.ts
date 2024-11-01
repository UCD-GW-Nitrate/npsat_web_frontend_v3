export interface UserResponse {
  token: string;
  user_id: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  email: string;
}
