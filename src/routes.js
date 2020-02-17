import { Router } from 'express';
// upload de arquivos
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import RecipientSignatureController from './app/controllers/RecipientSignatureController';

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

// recipients
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:recipient_id', RecipientController.update);

// upload files
routes.post('/files', upload.single('file'), FileController.store);

// routes to deliverymans
routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:deliveryman_id', DeliverymanController.update);
routes.delete('/deliveryman/:deliveryman_id', DeliverymanController.delete);

// recipient signatures
routes.get('/signatures', RecipientSignatureController.index);
routes.post(
  '/signatures/:recipient_id',
  upload.single('signature'),
  RecipientSignatureController.store
);
routes.put('/signatures/:signature_id', RecipientSignatureController.update);
routes.delete('/signatures/:signature_id', RecipientSignatureController.delete);

export default routes;
