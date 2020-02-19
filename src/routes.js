import { Router } from 'express';
// upload de arquivos
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import PackageController from './app/controllers/PackageController';
import PackageStatusController from './app/controllers/PackageStatusController';
import PackageProblemController from './app/controllers/PackageProblemController';

// middleware
import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();
// upload
const upload = multer(multerConfig);

// session routes
routes.post('/sessions', SessionController.store);

// user routes
routes.post('/users', UserController.store);

// deliveryman deliveries
routes.get('/deliveryman/deliveries', PackageStatusController.index);
routes.get(
  '/deliveryman/:deliveryman_id/deliveries',
  PackageStatusController.show
);
routes.put(
  '/deliveryman/:deliveryman_id/deliveries/:package_id',
  PackageStatusController.update
);
// signatures
routes.post('/files/signature', upload.single('file'), FileController.store);

routes.post('/deliveries/:package_id/problems', PackageProblemController.store); // create package problems

// midleware for auth routes
routes.use(AuthMiddleware);

// update user
routes.put('/users', UserController.update);

// recipients
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:recipient_id', RecipientController.update);

// upload files
routes.get('/files', FileController.index);
routes.post('/files', upload.single('file'), FileController.store);

// routes to deliverymans
routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:deliveryman_id', DeliverymanController.update);
routes.delete('/deliveryman/:deliveryman_id', DeliverymanController.delete);

// routes for packages
routes.get('/packages', PackageController.index);
routes.post('/packages', PackageController.store);
routes.put('/packages/:package_id', PackageController.update);
routes.delete('/packages/:package_id', PackageController.delete);

// package problem
routes.get('/deliveries/problems', PackageProblemController.index); // problems by package
routes.get('/deliveries/:package_id/problems', PackageProblemController.show); // problems by package
routes.delete(
  '/problem/:package_id/cancel-delivery',
  PackageProblemController.delete
);
export default routes;
