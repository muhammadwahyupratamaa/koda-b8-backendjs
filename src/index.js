import express from "express";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import corsMiddleware from "./middlewares/cors.middleware.js";
import path from "path";
import sequelize from "./config/sequelize.js";
import http from "http";
import { initWebSocket } from "./websocket/index.js";

const app = express();

app.use(express.json());

app.use("/uploads", express.static(path.resolve("uploads")));
app.use(corsMiddleware);
app.use(routes);

try {
  await sequelize.authenticate();
  console.log("database Connected");
} catch (error) {
  console.error("Database connection failed:", error.message);
}

const PORT = process.env.PORT || 8081;

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = http.createServer(app);

initWebSocket(server);

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
