import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { storage } from "./storage";
import { RegisterUser, LoginUser } from "@shared/schema";

export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async registerUser(userData: RegisterUser) {
    // Check if username already exists
    const existingUserByUsername = await storage.getUserByUsername(userData.username);
    if (existingUserByUsername) {
      throw new Error("Username already exists");
    }

    // Check if email already exists
    const existingUserByEmail = await storage.getUserByEmail(userData.email);
    if (existingUserByEmail) {
      throw new Error("Email already exists");
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user
    const user = await storage.createUser({
      id: nanoid(),
      email: userData.email,
      username: userData.username,
      password: hashedPassword,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: null,
      coins: 50, // Starting coins
      xp: 0,
      level: 1,
      streak: 0,
      totalTreesPlanted: 0,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async loginUser(credentials: LoginUser) {
    // Find user by username
    const user = await storage.getUserByUsername(credentials.username);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Check password
    const isValidPassword = await this.comparePassword(credentials.password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid username or password");
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}