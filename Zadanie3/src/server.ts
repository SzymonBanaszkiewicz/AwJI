import express = require('express');

const app: express.Express = express();
const port = 3000;

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