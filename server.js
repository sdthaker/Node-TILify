import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;
const distDir = path.join(path.resolve(), './src/public');

app.use(express.static(distDir));

app.listen(port, () => console.log(`Server listening on port ${port}!`));
