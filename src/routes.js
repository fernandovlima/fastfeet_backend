import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

// middleware
import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

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

export default routes;
