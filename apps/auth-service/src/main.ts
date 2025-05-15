import express from 'express';
import cors from 'cors'; 
// eslint-disable-next-line @nx/enforce-module-boundaries
import { errorMiddleware } from '../../../packages/middleware/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import router from './routes/auth.router';
import swaggerui from 'swagger-ui-express';



const swaggerDocument = require("./swagger-output.json");
const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));


app.use(express.json);
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

// Routes
app.use('/api/', router);

app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerDocument, ));
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerDocument);
});


// Error handling middleware
app.use(errorMiddleware);

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
  console.log(`Swagger UI at http://localhost:${port}/docs`);
});
server.on('error', (error) => {
  console.error('Server error:', error);
});

