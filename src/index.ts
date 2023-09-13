import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import Conn from '../Connection';
import AuthRoutes from './Routes/Auth';
import MainRoutes from './Routes/Routes';
import path from 'path';
const app = express();
const modelsPath = `${path.join(__dirname,'/Models/')}`;
const conn = new Conn(modelsPath);


app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

morgan.token('req-data', (req: Request) => {
  return JSON.stringify({ body: req.body, params: req.params });
});

const customLogFormat = '[:date[iso]] :method :url :status :response-time ms - :req-data';
app.use(morgan(customLogFormat));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Welcome to Kwanso' });
});

// Middleware to attach 'conn' to the request object
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).conn = conn; // Assuming 'conn' is your database connection instance
  next();
});

app.use('/api/auth', AuthRoutes);
app.use('/api', MainRoutes);

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: '404 Not Found' });
});

const port = 3000;
const host = 'localhost';

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
