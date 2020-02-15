import { Router } from 'express';
// upload de arquivos
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';

// middleware
import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();
// upload
const upload = multer(multerConfig);

// session routes
routes.post('/sessions', SessionController.store);

// user routes
routes.post('/users', UserController.store);

// midleware for auth routes
routes.use(AuthMiddleware);
// update user
routes.put('/users', UserController.update);
// create recipient
routes.post('/recipients', RecipientController.store);
// update recipient
routes.put('/recipients/:recipient_id', RecipientController.update);
// upload files
routes.post('/files', upload.single('file'), FileController.store);
// routes to deliverymans
routes.get('/deliverymans', DeliverymanController.index);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:deliveryman_id', DeliverymanController.update);
routes.delete('/deliverymans/:deliveryman_id', DeliverymanController.delete);

export default routes;
