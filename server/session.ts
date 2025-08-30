import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgreSQLStore = connectPg(session);

export const sessionStore = new PostgreSQLStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true,
  tableName: "sessions",
});

export const sessionMiddleware = session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || "stimuli-dev-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
});

// Extend express session type
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}