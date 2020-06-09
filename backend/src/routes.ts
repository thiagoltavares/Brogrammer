import { Router } from 'express';
import ItemsController from "./controllers/ItemsController";
import PointsController from "./controllers/PointsController";
import multer from 'multer';
import multerConfig from './config/multer'
import { celebrate, Joi } from 'celebrate'

const routes = Router();
const uploads = multer(multerConfig);

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.get('/items', itemsController.index);
routes.get('/points/:id', pointsController.show);
routes.get('/points/', pointsController.index);

routes.post('/points', 
  uploads.single('image'), celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      whatsapp: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      district: Joi.string().required(),
      items: Joi.string().required(),
    })
  }, { abortEarly: false }), 
  pointsController.create);

export default routes;
