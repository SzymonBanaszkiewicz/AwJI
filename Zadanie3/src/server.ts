import express = require('express');
import 'dotenv/config';
import { connectDB } from './config/database';
import productRoutes from './routes/productRoutes';

const app: express.Express = express();
const port = 3000;



async function startServer() {
    try {
      await connectDB();
      app.use('/api/products', productRoutes);
      app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
      });
    } catch (error) {
        console.log(error)
    }
}



app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
});

app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Serwer działa poprawnie',
    timestamp: new Date().toISOString()
  });
});

startServer();