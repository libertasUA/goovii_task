import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import routes from './app/routes/routes';
// import HttpException from './app/models/http-exception.model';
import rateLimiter from './config/rateLimiter';

const app = express();


/**
 * App Configuration
 */
app.use(rateLimiter);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ status: 'API is running on /api' });
});

export default app;
