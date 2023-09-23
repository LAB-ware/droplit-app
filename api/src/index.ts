import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import pino from 'pino';
import pinoLogger from 'express-pino-logger';
import 'dotenv/config';

import { printRoutes } from './utils/routing';
import routes from './api/routes.config';

// Constants
const DROPLIT_MONGODB_URI = process.env.DROPLIT_MONGODB_URI || '';
const PORT = process.env.PORT || '5100';

// Configure logging
// LOG_LEVEL can be one of ['info', 'warn', 'error', 'debug', 'trace']
const logger = pinoLogger({
  logger: pino({ level: process.env.LOG_LEVEL || 'info' }),
});

// Check if required env vars are defined
if (!DROPLIT_MONGODB_URI) {
  console.error('missing DROPLIT_MONGODB_URI from env');
  process.exit(1);
}
// Initialize Mongo database
mongoose
  .connect(DROPLIT_MONGODB_URI)
  .then(() => console.log('Successfully connected to database'))
  .catch((error) => {
    console.error('Database connection failed. Exiting now...', error);
    process.exit(1);
  });

// Configure Express server
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(logger);

// Route to ping server
app.get('/ping', (req, res) => res.send('pong'));

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
  printRoutes(app);
});
