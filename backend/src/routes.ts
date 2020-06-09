import { Router } from 'express';
import ItemsController from "./controllers/ItemsController";
import PointsController from "./controllers/PointsController";
import multer from 'multer';
import multerConfig from './config/multer'

const routes = Router();
const uploads = multer(multerConfig);

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.get('/items', itemsController.index);
routes.get('/points/:id', pointsController.show);
routes.get('/points/', pointsController.index);

routes.post('/points', uploads.single('image'),pointsController.create);

export default routes;
