import express from 'express';
import { Request, Response } from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import compression from 'compression';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import userRoutes from './routes/user.route';
import errorHandler from './middleware/error.middleware';

dotenv.config();

const app: express.Application = express();

/** handle Api header */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
});

app.use(helmet());
app.use(cors());

/** parse content-type to json */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
// logging middleware configuration

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  )
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false;
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// routes configuration
app.use('/api/users', userRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);

app.get('/', function (req: Request, res: Response) {
  res.send('TestDemo Backend API !');
});

export default app;
