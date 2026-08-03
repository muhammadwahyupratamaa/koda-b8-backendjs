import pool from "./config/db.js";
import express from "express";
import routes from "./routes/index.js";


const app = express();
app.use(express.json())
app.use(routes)

try {
  await pool.query("SELECT NOW()");
  console.log("database Connected");
} catch (error) {
  console.error(error.message);
}

const PORT = process.env.PORT || 8080;

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
