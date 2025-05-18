import express from 'express';
import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import rateLimit from 'express-rate-limit';
//import axios from "axios";
import cookieparser from "cookie-parser";

const 
app = express();

app.use(cors(
  {
    origin: [
      "http://localhost:3000",
     // "http://localhost:4200",
      //"http://localhost:8080",
      //"https://api-gateway-frontend.vercel.app",
    ],
    allowedHeaders: ["Content-Type","Authorization"],
    credentials: true,
  }
));

app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb",extended: true }));
app.use(cookieparser());
app.set("trust proxy", 1);

// Rate limiting

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: import('express').Request & { user?: unknown }) => (req.user ? 1000 : 100), // 1000 if authenticated, otherwise 100
  message: "Too many requests, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: true,   // Enable the `X-RateLimit-*` headers (deprecated)
  keyGenerator: (req: import('express').Request) => req.ip || 'unknown-ip', // Use IP address as the unique key, fallback if undefined
});
app.use(limiter);


app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

app.use ("/", proxy("http://localhost:6001"));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
