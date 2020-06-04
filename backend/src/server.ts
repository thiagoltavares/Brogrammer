import express from 'express';
import routes from './routes';
import path from 'path';

const app = express();

app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));


console.log('Server started at port: 3333 🚀🚀🚀');

app.listen(3333);
