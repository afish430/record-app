import { User } from "./user";

export interface UserResponse {
  user: User;
  newToken?: string;
}