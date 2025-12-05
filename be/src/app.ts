import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';

import router from './routes';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(express.json());
app.use(helmet()); // security headers
app.use(compression()); // decreasing request size
app.use(morgan(':method :url :status :response-time ms')); // logging
app.use(cors()); // possibly necessary in prod

app.use('/api/v1', router);

// needs to be after routes
app.use(errorHandler);

export default app;
