import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import cookiePaser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookiePaser());
app.use(express.static(path.join(rootDir, "public")));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/api/auth", authRouter);

export default app;
