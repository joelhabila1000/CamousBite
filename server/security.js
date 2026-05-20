const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

const parseAllowedOrigins = () => {
  const configured = process.env.CORS_ORIGIN;
  if (!configured) return DEFAULT_ALLOWED_ORIGINS;
  return configured
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const createCorsMiddleware = () => {
  const allowedOrigins = parseAllowedOrigins();

  return (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
    }

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type",
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, OPTIONS",
    );

    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      return res.end();
    }

    return next();
  };
};

const createRateLimiter = ({ limit = 120, windowMs = 60_000 } = {}) => {
  const hits = new Map();

  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const entry = hits.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    hits.set(key, entry);

    if (entry.count > limit) {
      res.statusCode = 429;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ error: "Too many requests" }));
    }

    return next();
  };
};

const validateEnv = () => {
  const missing = [];
  if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
    missing.push("POSTGRES_URL");
  }
  if (!process.env.JWT_SECRET) missing.push("JWT_SECRET");

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
  }
};

export { createCorsMiddleware, createRateLimiter, validateEnv };
