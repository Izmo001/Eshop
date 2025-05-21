import express, { Request, Response } from 'express';
import cors from 'cors';
import { errorMiddleware } from '@packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import router from './routes/auth.router';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();

const swaggerDocument = require('./swagger-output.json');

const app = express();

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000'],
  allowedHeaders: ['Authorization', 'Content-Type'], // 🔧 Capitalized correctly
  credentials: true,
}));

app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Hi David' });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs.json", (req: Request, res: Response) => {
  res.json(swaggerDocument);
});

// Routes
app.use('/api', router); // 🔧 Fixed import statement

app.use(errorMiddleware);

// Port setup
const port = process.env.PORT || 6001; // 🔧 Fixed `PORT` casing

// Start server
const server = app.listen(port, () => {
  console.log(`Auth service is running at http://localhost:${port}/api`);
  console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
});
  
// Error handling
server.on('error', (err) => {
  console.error('Server Error:', err);
});
