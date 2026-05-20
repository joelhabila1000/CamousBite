import "dotenv/config";
import express from "express";
import helmet from "helmet";
import healthHandler from "../api/health.js";
import ordersHandler from "../api/orders/index.js";
import publicProductsHandler from "../api/public/products.js";
import publicVendorsHandler from "../api/public/vendors.js";
import vendorLoginHandler from "../api/vendor/login.js";
import vendorMeHandler from "../api/vendor/me.js";
import vendorProfileHandler from "../api/vendor/profile.js";
import vendorRegisterHandler from "../api/vendor/register.js";
import vendorOrdersHandler from "../api/vendor/orders/index.js";
import vendorOrderStatusHandler from "../api/vendor/orders/[orderId]/status.js";
import vendorProductsHandler from "../api/vendor/products/index.js";
import vendorProductHandler from "../api/vendor/products/[id].js";
import {
  createCorsMiddleware,
  createRateLimiter,
  validateEnv,
} from "./security.js";

const app = express();
const port = Number(process.env.API_PORT || 3001);

validateEnv();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }),
);
app.use(createCorsMiddleware());
app.use(createRateLimiter({ limit: 180, windowMs: 60_000 }));
app.use(express.json({ limit: "64kb", strict: true }));

const adapt = (handler, getQuery) => async (req, res, next) => {
  try {
    req.query = { ...req.query, ...(getQuery ? getQuery(req) : {}) };
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};

app.get("/api/health", adapt(healthHandler));
app.get("/api/public/vendors", adapt(publicVendorsHandler));
app.get("/api/public/products", adapt(publicProductsHandler));
app.post("/api/orders", adapt(ordersHandler));

app.post("/api/vendor/register", adapt(vendorRegisterHandler));
app.post("/api/vendor/login", adapt(vendorLoginHandler));
app.get("/api/vendor/me", adapt(vendorMeHandler));
app.put("/api/vendor/profile", adapt(vendorProfileHandler));
app.get("/api/vendor/products", adapt(vendorProductsHandler));
app.post("/api/vendor/products", adapt(vendorProductsHandler));
app.patch(
  "/api/vendor/products/:id",
  adapt(vendorProductHandler, (req) => ({ id: req.params.id })),
);
app.get("/api/vendor/orders", adapt(vendorOrdersHandler));
app.patch(
  "/api/vendor/orders/:orderId/status",
  adapt(vendorOrderStatusHandler, (req) => ({ orderId: req.params.orderId })),
);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Server error" });
});

app.listen(port, () => {
  console.log(`CampusBite API listening on http://localhost:${port}`);
});
