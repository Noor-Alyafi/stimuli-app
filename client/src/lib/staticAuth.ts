// Static authentication for frontend-only deployment
import { LocalStorageManager, StoredUser } from './localStorage';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export class StaticAuthService {
  // Simple password hashing for demo purposes (not secure for production)
  private static hashPassword(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  static async register(userData: RegisterData): Promise<StoredUser> {
    // Check if username already exists
    const existingUserByUsername = LocalStorageManager.findUserByUsername(userData.username);
    if (existingUserByUsername) {
      throw new Error("Username already exists");
    }

    // Check if email already exists
    const existingUserByEmail = LocalStorageManager.findUserByEmail(userData.email);
    if (existingUserByEmail) {
      throw new Error("Email already exists");
    }

    // Store password hash in localStorage for login verification
    const passwordHash = this.hashPassword(userData.password);
    localStorage.setItem(`stimuli_password_${userData.username}`, passwordHash);

    // Create user without password
    const user = LocalStorageManager.createUser({
      email: userData.email,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    return user;
  }

  static async login(credentials: LoginData): Promise<StoredUser> {
    // Find user by username
    const user = LocalStorageManager.findUserByUsername(credentials.username);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Check password
    const storedPasswordHash = localStorage.getItem(`stimuli_password_${credentials.username}`);
    const providedPasswordHash = this.hashPassword(credentials.password);

    if (storedPasswordHash !== providedPasswordHash) {
      throw new Error("Invalid username or password");
    }

    // Set as current user
    LocalStorageManager.setCurrentUser(user);
    return user;
  }

  static getCurrentUser(): StoredUser | null {
    return LocalStorageManager.getCurrentUser();
  }

  static logout(): void {
    LocalStorageManager.logout();
  }

  static isLoggedIn(): boolean {
    return LocalStorageManager.getCurrentUser() !== null;
  }
}