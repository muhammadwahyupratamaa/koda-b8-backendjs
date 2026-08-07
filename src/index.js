import pool from "./config/db.js";
import express from "express";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import corsMiddleware from "./middlewares/cors.middleware.js";

const app = express();
// console.log(corsmiddleware);
app.use(express.json());

app.use((req, res, next) => {
  console.log(req)
  next()
})
app.use(corsMiddleware);
app.use(routes);

try {
  await pool.query("SELECT NOW()");
  console.log("database Connected");
} catch (error) {
  console.error(error.message);
}

const PORT = process.env.PORT || 8081;

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
