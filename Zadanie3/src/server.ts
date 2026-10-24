import express = require('express');
import 'dotenv/config';
import { connectDB } from './config/database';

const app: express.Express = express();
const port = 3000;

connectDB().catch(error => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Serwer działa poprawnie',
    timestamp: new Date().toISOString()
  });
});